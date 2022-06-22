const Submission = require(`../../common/models/submission`);
const Problem = require(`../../common/models/problem`);
const Contest = require(`../../common/models/contest`);
const Queue = require(`../services/queue`);

const Utils = require(`../../common/lib/utils`);

const async = require(`async`);
const fs = require(`fs`);
const multiparty = require(`multiparty`);

const _ = require(`lodash`);

const createSubmission = async (submission, userId) => {
  const sub = new Submission({
    contest: submission.contest,
    contestant: userId,
    rep: submission.rep,
    problem: submission.problem,
    language: submission.language,
    code: submission.code,
  });
  if (!submission.problem) sub.verdict = 15;
  return await sub.save();
};

exports.tryExtractFile = (req, res, next) => {
  if (req.body.code) return next();
  const form = new multiparty.Form();
  let fpath;
  async.waterfall(
    [
      (callback) => {
        form.parse(req, callback);
      },
      (fields, files, callback) => {
        try {
          fpath = files.file[0].path;
          req.body = {};
          req.body.id = fields.id[0];
          req.body.problem = fields.problem[0];
          req.body.language = fields.language[0];
        } catch (err) {
          return callback(err);
        }
        fs.readFile(fpath, `utf8`, callback);
      },
      (code, callback) => {
        req.body.code = code;
        fs.unlink(fpath, callback);
      },
    ],
    (err) => {
      if (err) return res.sendStatus(400);
      return next();
    }
  );
};

exports.submit = async (req, res) => {
  req.body.contest = req.params.id;

  try {
    const submission = req.body;
    const userId = req.user._id;

    if (Submission.validateChain(req).seeLanguage().seeCode().notOk()) {
      return res.sendStatus(400);
    }

    if (submission.problem === 0) {
      submission.problem = null;
    }
    const contest = await Contest.findById(
      submission.contest,
      `contestants problems`
    );
    if (!contest.userInContest(userId)) {
      return res.sendStatus(400);
    }
    if (contest.date_start > new Date()) {
      return res.sendStatus(400);
    }
    if (!_.some(submission.language, contest.languages)) {
      return res.sendStatus(400);
    }
    let problem = null;
    if (submission.problem) {
      if (!contest.problemInContest(submission.problem)) {
        return res.sendStatus(400);
      }
      problem = await Problem.findById(submission.problem);
    }
    submission.rep = contest.getUserRepresentative(userId);
    const savedSubmission = await createSubmission(submission, userId);
    if (problem) {
      Queue.pushSubmission(problem.oj, savedSubmission, () =>
        res.json({
          submission: savedSubmission,
        })
      );
    } else {
      return res.json({
        submission: savedSubmission,
      });
    }
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.getById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate({ path: `contest`, select: `name` })
      .populate({ path: `contestant`, select: `username` })
      .populate({ path: `problem`, select: `name` });
    if (!submission) return res.sendStatus(400);
    return res.json({
      submission,
    });
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.getRepContestSubmissions = async (req, res) => {
  const contestId = req.params.id;
  const startFrom = new Date(_.toInteger(req.query.from) || 0);
  const rep = req.user?._id;
  try {
    const contest = await Contest.findById(contestId);
    if (!contest) return res.sendStatus(400);
    if (!rep) return res.status(200).json({});
    let submissions = await Submission.find({
      contest: contestId,
      rep,
      date: { $gt: startFrom },
    })
      .select(`_id id date verdict language problem`)
      .sort(`-date`);
    const isBlind = !contest.hasEnded() && new Date() >= contest.blind_time;
    if (isBlind) {
      submissions = _.map(submissions, (s) => {
        if (s.date >= contest.blind_time) s.verdict = 0;
        return s;
      });
    }
    return res.json({ submissions });
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.getRepProblemSubmissions = (req, res) => {
  const contestId = req.params.id;
  const repId = req.params.rid;
  const problemId = req.params.pid;
  Contest.findById(contestId, (err, contest) => {
    if (err) return res.sendStatus(500);
    if (!contest) return res.sendStatus(400);
    const rep = contest.getUserRepresentative(req.user._id);
    if (!req.user.isAdmin && !Utils.cmpToString(req.user._id, contest.author)) {
      return res.sendStatus(400);
    }
    Submission.find({
      contest: contestId,
      rep: repId,
      problem: problemId,
    })
      .select(`_id date verdict language problem`)
      .sort(`-date`)
      .exec((err, submissions) => {
        if (err) return res.sendStatus(500);
        return res.json({ submissions });
      });
  });
};
