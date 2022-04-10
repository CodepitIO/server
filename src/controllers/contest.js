const async = require("async"),
  _ = require("lodash");

const Contest = require("../../common/models/contest"),
  Team = require("../../common/models/team"),
  Submission = require("../../common/models/submission"),
  Redis = require("../services/dbs").redisClient,
  Problems = require("./problems"),
  Errors = require("../utils/errors"),
  Utils = require("../../common/lib/utils");

const LANGUAGES = require("../../common/constants").LANGUAGES;

function canViewContest(contest, user) {
  return (
    !contest.watchPrivate ||
    (user &&
      (user.isAdmin || contest.userInContest(user) || contest.isAuthor(user)))
  );
}

exports.getMetadata = (req, res) => {
  let id = req.params.id;
  Contest.findById(id)
    .populate({
      path: "contestants.team",
      select: "_id name",
    })
    .populate({
      path: "contestants.user",
      select: "_id username",
    })
    .populate({
      path: "problems",
      select: "_id name oj id fullName timelimit memorylimit supportedLangs",
    })
    .then((contest) => {
      if (!contest) {
        return res.status(400).send();
      }
      let userId = req.user && req.user._id;
      let obj = {
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

      let isAdmin = req.user && req.user.isAdmin;
      let canViewContestants = obj.canViewContest;
      let canViewProblems =
        obj.canViewContest &&
        (isAdmin || contest.isAuthor(req.user) || obj.hasStarted);

      if (canViewContestants) obj.contestants = contest.contestants;
      if (canViewProblems) obj.problems = contest.problems;
      if (obj.isContestAdmin) obj.password = contest.password;

      return res.json(obj);
    });
};

exports.getEvents = (req, res) => {
  let id = req.params.id;
  const now = new Date();
  let startFrom = _.toInteger(req.query.from) || 0;
  let upTo = _.toInteger(req.query.to) || now.getTime();
  Contest.findById(id, (err, contest) => {
    if (err) return res.status(500).send();
    if (!contest || !canViewContest(contest, req.user)) {
      return res.status(400).send();
    }

    let isAdmin = req.user && req.user.isAdmin;
    let isContestAdmin = Utils.cmpToString(
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
    async.parallel(
      {
        pending: (next) => {
          return Redis.zrangebyscore(`${id}:PENDING`, startFrom, upTo, next);
        },
        rejected: (next) => {
          return Redis.zrangebyscore(`${id}:REJECTED`, startFrom, upTo, next);
        },
        accepted: (next) => {
          return Redis.zrangebyscore(`${id}:ACCEPTED`, startFrom, upTo, next);
        },
      },
      (err, results) => {
        if (err) {
          return res.status(500).send();
        }
        return res.json(results);
      }
    );
  });
};

exports.join = async (req, res) => {
  try {
    const id = req.params.id;
    const password = req.body.password;
    const teamId = req.body.team;
    const userId = req.user._id;
    const contestPromise = Contest.findById(id);
    const countPromise = Team.count({ _id: teamId, members: userId });
    const [contest, count] = await Promise.all([contestPromise, countPromise]);
    if (!contest) return res.status(400).send();
    if (contest.contestantType === 1 && teamId) return res.status(400).send();
    if (contest.contestantType === 2 && !teamId) return res.status(400).send();
    if (teamId && count === 0) return res.status(400).send();
    if (contest.userInContest(userId)) return res.status(400).send();
    if (contest.isPrivate && contest.password !== password) {
      return res.json(Errors.InvalidPassword);
    }
    let contestant = { user: userId };
    if (teamId) contestant.team = teamId;
    contest.contestants.push(contestant);
    contest.save();
    return res.json({});
  } catch (err) {
    return res.status(500).send();
  }
};

exports.leave = (req, res) => {
  let id = req.params.id;
  let userId = req.user._id;
  async.waterfall(
    [
      (next) => {
        Submission.count({ contest: id, rep: userId }, next);
      },
      (count, next) => {
        if (count > 0) return res.status(400).send();
        Contest.findByIdAndUpdate(
          id,
          { $pull: { contestants: { user: userId } } },
          next
        );
      },
    ],
    (err) => {
      if (err) return res.status(500).send();
      return res.json({});
    }
  );
};

exports.validateContest = (req, res, next) => {
  if (!req.user.verified) return res.status(400).send();
  let c = {},
    data = req.body;
  async.waterfall(
    [
      (next) => {
        // <<-- Validate descr -->>
        c.name = _.toString(data.name);
        if (!_.inRange(c.name.length, 1, 51)) return res.status(400).send();
        if (!req.params.id) return next(null, null);
        Contest.findById(req.params.id, next);
      },
      (contest, next) => {
        // <<-- Validate author and dates -->>
        let now = new Date().getTime();
        if (contest) {
          if (!Utils.cmpToString(req.user._id, contest.author))
            return res.status(400).send();
          if (contest && contest.date_end < now) return res.status(400).send();
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
          if (_.some(timeArr, _.isNaN)) return res.status(400).send();
          for (let i = 0; i < 3; i++) {
            if (timeArr[i] > timeArr[i + 1]) return res.status(400).send();
          }

          const sevenMonthsFromNow = now + 7 * 30 * 24 * 60 * 60 * 1000;
          if (c.date_end > sevenMonthsFromNow) return res.status(400).send();
          if (
            c.date_start <
            Math.min(
              now - 3 * 60 * 60 * 1000,
              (contest && contest.date_start) || now
            )
          ) {
            return res.status(400).send();
          }
          return next();
        } catch (err) {
          console.log(err);
          return res.status(400).send();
        }
      },
      (next) => {
        // <<-- Validate options -->>
        c.languages = data.languages;
        if (!_.isArray(c.languages) || c.languages.length === 0) {
          return res.status(400).send();
        }
        if (_.difference(c.languages, LANGUAGES).length > 0) {
          return res.status(400).send();
        }
        c.isPrivate = !!data.password;
        c.password = _.toString(data.password);
        if (c.isPrivate && !_.inRange(c.password.length, 1, 100)) {
          return res.status(400).send();
        }
        c.watchPrivate = data.visibility === "closed";
        if (
          typeof data.contestantType !== `number` ||
          data.contestantType < 1 ||
          data.contestantType > 3
        ) {
          return res.status(400).send();
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
          return res.status(400).send();
        }
        c.problems = _.chain(c.problems)
          .map((obj) => {
            return _.toString(obj?._id);
          })
          .compact()
          .uniq()
          .value();
        if (!Problems.isIndexed(c.problems)) return res.status(400).send();
        return next();
      },
    ],
    (err) => {
      if (err) return res.status(500).send();
      req.body = c;
      return next();
    }
  );
};

exports.createOrEdit = (req, res) => {
  let id = req.params.id;
  if (!id) {
    req.body.author = req.user._id;
    let contest = new Contest(req.body);
    return contest.save((err, contest) => {
      if (err) return res.status(500).send();
      return res.json({ id: contest._id });
    });
  } else {
    Contest.findOneAndUpdate({ _id: id }, req.body, (err, contest) => {
      if (err) return res.status(500).send();
      return res.json({});
    });
  }
};
