const async = require(`async`);
const _ = require(`lodash`);

const Contest = require(`../../common/models/contest`);
const Team = require(`../../common/models/team`);
const Submission = require(`../../common/models/submission`);
const Redis = require(`../services/dbs`).redisClient;
const Problems = require(`./problems`);
const Errors = require(`../utils/errors`);

const Utils = require(`../../common/lib/utils`);

const { LANGUAGES } = require(`../../common/constants`);

function canViewContest(contest, user) {
  return (
    !contest.watchPrivate ||
    (user &&
      (user.isAdmin || contest.userInContest(user) || contest.isAuthor(user)))
  );
}

exports.getMetadata = (req, res) => {
  const { id } = req.params;
  Contest.findById(id)
    .populate({
      path: `contestants.team`,
      select: `_id name`,
    })
    .populate({
      path: `contestants.user`,
      select: `_id username`,
    })
    .populate({
      path: `problems`,
      select: `_id name oj id fullName timelimit memorylimit supportedLangs`,
    })
    .then((contest) => {
      if (!contest) {
        return res.sendStatus(400);
      }
      const userId = req.user && req.user._id;
      const obj = {
        _id: contest._id,
        name: contest.name,
        author: contest.author,
        date_start: contest.date_start,
        date_end: contest.date_end,
        frozen_time: contest.frozen_time,
        blind_time: contest.blind_time,
        isPrivate: contest.isPrivate,
        watchPrivate: contest.watchPrivate,
        contestantType: contest.contestantType,
        languages: contest.languages,
        problems: [],

        hasStarted: contest.hasStarted(),
        hasEnded: contest.hasEnded(),
        canViewContest: canViewContest(contest, req.user),
        inContest: contest.userInContest(userId),
        isContestAdmin: Utils.cmpToString(req.user?._id, contest.author),
      };

      const isAdmin = req.user && req.user.isAdmin;
      const canViewContestants = obj.canViewContest;
      const canViewProblems =
        obj.canViewContest &&
        (isAdmin || contest.isAuthor(req.user) || obj.hasStarted);

      if (canViewContestants) obj.contestants = contest.contestants;
      if (canViewProblems) obj.problems = contest.problems;
      if (obj.isContestAdmin) obj.password = contest.password;

      return res.json(obj);
    });
};

exports.getEvents = async (req, res) => {
  const { id } = req.params;
  const now = new Date();
  const startFrom = _.toInteger(req.query.from) || 0;
  let upTo = _.toInteger(req.query.to) || now.getTime();
  try {
    const contest = Contest.findById(id);
    if (!contest) {
      return res.sendStatus(400);
    }
    if (!canViewContest(contest, req.user)) {
      return res.status(200).json({});
    }
    const isAdmin = req.user && req.user.isAdmin;
    const isContestAdmin = Utils.cmpToString(
      req.user && req.user._id,
      contest.author
    );
    if (
      !isAdmin &&
      !isContestAdmin &&
      now >= contest.frozen_time &&
      now < contest.date_end
    ) {
      upTo = new Date(contest.frozen_time).getTime();
    }
    const results = await async.parallel({
      pending: (next) =>
        Redis.zrangebyscore(`${id}:PENDING`, startFrom, upTo, next),
      rejected: (next) =>
        Redis.zrangebyscore(`${id}:REJECTED`, startFrom, upTo, next),
      accepted: (next) =>
        Redis.zrangebyscore(`${id}:ACCEPTED`, startFrom, upTo, next),
    });
    return res.json(results);
  } catch {
    return res.sendStatus(500);
  }
};

exports.join = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const teamId = req.body.team;
    const userId = req.user._id;
    const contestPromise = Contest.findById(id);
    const countPromise = Team.count({ _id: teamId, members: userId });
    const [contest, count] = await Promise.all([contestPromise, countPromise]);
    if (!contest) return res.sendStatus(400);
    if (contest.contestantType === 1 && teamId) return res.sendStatus(400);
    if (contest.contestantType === 2 && !teamId) return res.sendStatus(400);
    if (teamId && count === 0) return res.sendStatus(400);
    if (contest.userInContest(userId)) return res.sendStatus(400);
    if (contest.isPrivate && contest.password !== password) {
      return res.json(Errors.InvalidPassword);
    }
    const contestant = { user: userId };
    if (teamId) contestant.team = teamId;
    contest.contestants.push(contestant);
    contest.save();
    return res.json({});
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.leave = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const count = await Submission.count({ contest: id, rep: userId });
    if (count > 0) return res.sendStatus(400);
    await Contest.findByIdAndUpdate(id, {
      $pull: { contestants: { user: userId } },
    });
    return res.json({});
  } catch {
    return res.sendStatus(500);
  }
};

exports.validateContest = (req, res, next) => {
  if (!req.user.verified) return res.sendStatus(400);
  const c = {};
  const data = req.body;
  async.waterfall(
    [
      (next) => {
        // <<-- Validate descr -->>
        c.name = _.toString(data.name);
        if (!_.inRange(c.name.length, 1, 51)) return res.sendStatus(400);
        if (!req.params.id) return next(null, null);
        Contest.findById(req.params.id, next);
      },
      (contest, next) => {
        // <<-- Validate author and dates -->>
        const now = new Date().getTime();
        if (contest) {
          if (!Utils.cmpToString(req.user._id, contest.author))
            return res.sendStatus(400);
          if (contest && contest.date_end < now) return res.sendStatus(400);
        }
        try {
          c.date_start = new Date(data.startDateTime);
          c.date_end = new Date(data.endDateTime);
          if (data.blindDateTime) c.blind_time = new Date(data.blindDateTime);
          else c.blind_time = c.date_end;
          if (data.frozenDateTime)
            c.frozen_time = new Date(data.frozenDateTime);
          else c.frozen_time = c.blind_time;

          const timeArr = [
            c.date_start,
            c.frozen_time,
            c.blind_time,
            c.date_end,
          ];
          if (_.some(timeArr, _.isNaN)) return res.sendStatus(400);
          for (let i = 0; i < 3; i++) {
            if (timeArr[i] > timeArr[i + 1]) return res.sendStatus(400);
          }

          const sevenMonthsFromNow = now + 7 * 30 * 24 * 60 * 60 * 1000;
          if (c.date_end > sevenMonthsFromNow) return res.sendStatus(400);
          if (
            c.date_start <
            Math.min(
              now - 3 * 60 * 60 * 1000,
              (contest && contest.date_start) || now
            )
          ) {
            return res.sendStatus(400);
          }
          return next();
        } catch (err) {
          console.log(err);
          return res.sendStatus(400);
        }
      },
      (next) => {
        // <<-- Validate options -->>
        c.languages = data.languages;
        if (!_.isArray(c.languages) || c.languages.length === 0) {
          return res.sendStatus(400);
        }
        if (_.difference(c.languages, LANGUAGES).length > 0) {
          return res.sendStatus(400);
        }
        c.isPrivate = !!data.password;
        c.password = _.toString(data.password);
        if (c.isPrivate && !_.inRange(c.password.length, 1, 100)) {
          return res.sendStatus(400);
        }
        c.watchPrivate = data.visibility === `closed`;
        if (
          typeof data.contestantType !== `number` ||
          data.contestantType < 1 ||
          data.contestantType > 3
        ) {
          return res.sendStatus(400);
        }
        return next();
      },
      (next) => {
        // <<-- Validate problems -->>
        c.problems = data.problems;
        if (
          !_.isArray(c.problems) ||
          _.isEmpty(c.problems) === 0 ||
          c.problems.length > 26
        ) {
          return res.sendStatus(400);
        }
        c.problems = _.chain(c.problems)
          .map((obj) => _.toString(obj?._id))
          .compact()
          .uniq()
          .value();
        if (!Problems.isIndexed(c.problems)) return res.sendStatus(400);
        return next();
      },
    ],
    (err) => {
      if (err) return res.sendStatus(500);
      req.body = c;
      return next();
    }
  );
};

exports.createOrEdit = (req, res) => {
  const { id } = req.params;
  if (!id) {
    req.body.author = req.user._id;
    const contestModel = new Contest(req.body);
    return contestModel.save((err, contest) => {
      if (err) return res.sendStatus(500);
      return res.json({ id: contest._id });
    });
  }
  return Contest.findOneAndUpdate({ _id: id }, req.body, (err, contest) => {
    if (err) return res.sendStatus(500);
    return res.json({});
  });
};
