"use strict";

const Contest = require("../../common/models/contest"),
  mongoose = require("mongoose"),
  _ = require("lodash");

const CONTESTS_PER_PAGE = 10;

exports.create = (req, res) => {
  var contest = req.body;
  if (contest.startDateTime <= new Date()) {
    return res.json({
      error:
        "A competição deve ocorrer no futuro (o horário do servidor é " +
        new Date() +
        ")",
    });
  }

  var newContest = new Contest({
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
    if (err) return res.status(500).send();
    return res.json(contest);
  });
};

let filters = {
  open: {
    opts: function () {
      return {
        date_end: {
          $gt: new Date(),
        },
      };
    },
    sort: "date_start",
    limit: 10,
  },
  past: {
    opts: function (req) {
      return {
        date_end: {
          $lt: new Date(),
        },
      };
    },
    sort: "-date_end",
    limit: 10,
  },
  created: {
    opts: function (req) {
      if (!req.isAuthenticated()) return null;
      return {
        author: req.user._id,
      };
    },
    sort: "-date_start",
    limit: 10,
  },
  joined: {
    opts: function (req) {
      if (!req.isAuthenticated()) return null;
      return {
        "contestants.id": req.user.id,
      };
    },
    sort: "-date_end",
    limit: 10,
  },
};

exports.getList = async (req, res) => {
  let filter = filters[req.params.type || ""];

  if (!filter || !filter.opts(req)) {
    return res.status(400).send();
  }

  const data = await Promise.all([
    Contest.find(filter.opts(req))
      .select("-problems -contestants -password")
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
