const Contest = require(`../../common/models/contest`);
const mongoose = require(`mongoose`);

const _ = require(`lodash`);

const CONTESTS_PER_PAGE = 10;

exports.create = (req, res) => {
  const contest = req.body;
  if (contest.startDateTime <= new Date()) {
    return res.json({
      error: `A competição deve ocorrer no futuro (o horário do servidor é ${new Date()})`,
    });
  }

  const newContest = new Contest({
    name: contest.name,
    description: contest.descr,

    author: req.user._id,

    date_start: contest.startDateTime,
    date_end: contest.endDateTime,

    frozen_time: contest.frozenDateTime,
    blind_time: contest.blindDateTime,

    problems: contest.problems,

    contestantType: contest.contestantType,
    password: contest.password,
    isPrivate: contest.password.length > 0,
    watchPrivate: contest.watchPrivate == 1,
  });

  newContest.save((err, contest) => {
    if (err) return res.sendStatus(500);
    return res.json(contest);
  });
};

const filters = {
  open: {
    opts() {
      return {
        date_end: {
          $gt: new Date(),
        },
      };
    },
    sort: `date_start`,
    limit: 10,
  },
  past: {
    opts(req) {
      return {
        date_end: {
          $lt: new Date(),
        },
      };
    },
    sort: `-date_end`,
    limit: 10,
  },
  created: {
    opts(req) {
      if (!req.isAuthenticated()) return null;
      return {
        author: req.user._id,
      };
    },
    sort: `-date_start`,
    limit: 10,
  },
  joined: {
    opts(req) {
      if (!req.isAuthenticated()) return null;
      return {
        "contestants.id": req.user.id,
      };
    },
    sort: `-date_end`,
    limit: 10,
  },
};

exports.getList = async (req, res) => {
  const filter = filters[req.params.type || ``];

  if (!filter || !filter.opts(req)) {
    return res.sendStatus(400);
  }

  const data = await Promise.all([
    Contest.find(filter.opts(req))
      .select(`-problems -contestants -password`)
      .setOptions({
        sort: filter.sort,
        skip: req.query.page * CONTESTS_PER_PAGE,
        limit: filter.limit,
        lean: true,
      }),
    Contest.count(filter.opts(req)),
  ]);
  res.status(200).json({
    list: data[0],
    count: data[1],
  });
};
