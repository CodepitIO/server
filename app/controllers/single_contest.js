var ProblemsCtrl = require('./problems');
var SubmissionCtrl = require('./submission');

var Contest = require('../models/contest');
var _ = require('underscore');
var ObjectId = require('mongoose').Types.ObjectId;

var InvalidOperation = require('../utils/exception').InvalidOperation;

exports.getFullData = function(req, res, next) {
  Contest.findById(req.params.id)
  .populate('problems')
  .lean()
  .exec()
  .then(function(contest) {
    try {
      if (!contest) {
        return res.json(InvalidOperation);
      }
      if (contest.date_end <= new Date()) {
        return res.json(InvalidOperation);
      }
      if (contest.author.toString() !== req.user._id.toString()) {
        return res.json(InvalidOperation);
      }
      contest.problems = _.map(contest.problems, ProblemsCtrl.remapProblem);
      return res.json({contest: contest});
    } catch (err) {
      return res.json({error: err});
    }
  }, function(err) {
    return res.json({error: err});
  });
}

exports.remove = function(req, res, next) {
  var id = req.params.id;
  Contest.findById(id).exec()
  .then(function(contest) {
    if (!contest) {
      return res.json(InvalidOperation);
    }
    if (contest.author.toString() != req.user._id.toString()) {
      return res.json(InvalidOperation);
    }
    contest.remove(function(err) {
      if (err) {
        return res.json({error: err});
      }
      return res.json({});
    });
  }, function(err) {
    return res.json({error: err});
  });
}

exports.join = function(req, res, next) {
  var data = req.body;
  Contest.findById(data.id).exec()
  .then(function(contest) {
    try {
      if (new Date(contest.date_end) <= new Date()) {
        return res.json(InvalidOperation);
      }
      if (contest.isPrivate && contest.password != data.password) {
        return res.json({error: "Senha inválida."});
      }
      if ((data.team == '0' && contest.contestantType == 2) ||
        (data.team != '0' && contest.contestantType == 1)) {
        return res.json(InvalidOperation);
      }
      if (contest.inContest(req.user._id)) {
        return res.json(InvalidOperation);
      }
      if (data.team != '0' && !ObjectId.isValid(data.team)) {
        return res.json(InvalidOperation);
      }
      var props = {
        id: req.user._id,
        isIndividual: (data.team == '0')
      };
      if (data.team != '0') {
        props.team = new ObjectId(data.team);
      }
    } catch(err) {
      console.log(err);
      return res.json({error: err});
    }
    
    contest.contestants.push(props);
    contest.save(function(err) {
      if (err) {
        return res.json({error: err});
      }
      return res.json({});
    });
  });
}

exports.leave = function(req, res, next) {
  var data = req.body;
  Contest.findById(data.id).exec()
  .then(function(contest) {
    try {
      if (new Date(contest.date_start) <= new Date()) {
        return res.json(InvalidOperation);
      }
      if (!contest.inContest(req.user._id)) {
        return res.json(InvalidOperation);
      }
      contest.contestants = _.filter(contest.contestants, function(obj) {
        return obj.id && obj.id.toString() != req.user._id.toString();
      });
      contest.save(function(err) {
        if (err) {
          return res.json({error: err});
        }
        return res.json({});
      });
    } catch(err) {
      console.log(err);
      return res.json({error: err});
    }
  });
}

function getMinutesBetweenDates(startDate, endDate) {
  return Math.floor((endDate - startDate) / 60000);
}

exports.prevalidation = function(req, res, next) {
  var contest = req.body;
  contest.problems = _.uniq(contest.problems, false, function(obj) { return obj.id; });
  // TODO array de problemas tem que ser unico e válido
  contest.problems = _.map(contest.problems, function(problem) {
    return ObjectId(problem.id);
  });
  try {
    contest.startDateTime = new Date(contest.startDateTime);
    contest.endDateTime = new Date(contest.endDateTime);
    contest.frozenDateTime = new Date(contest.frozenDateTime);
    contest.blindDateTime = new Date(contest.blindDateTime);
    if (!contest.startDateTime || !contest.endDateTime || !contest.frozenDateTime || !contest.blindDateTime) {
      throw new Error('Formato inválido de data.');
      return res.json(InvalidOperation);
    }
    contest.duration = getMinutesBetweenDates(contest.startDateTime, contest.endDateTime);
    contest.frozenDuration = getMinutesBetweenDates(contest.frozenDateTime, contest.endDateTime);
    contest.blindDuration = getMinutesBetweenDates(contest.blindDateTime, contest.endDateTime);
    if (!contest.name || contest.name.length === 0) {
      return res.json(InvalidOperation);
    }
    if (contest.name.length > 30) {
      return res.json(InvalidOperation);
    }
    if (contest.descr && contest.descr.length > 500) {
      return res.json(InvalidOperation);
    }
    if (!contest.startDateTime || !contest.endDateTime) {
      return res.json(InvalidOperation);
    }
    if (contest.duration < 10) {
      return res.json(InvalidOperation);
    }
    if (contest.duration > 365 * 24 * 60) {
      return res.json(InvalidOperation);
    }
    if (contest.frozenDuration > contest.duration) {
      return res.json(InvalidOperation);
    }
    if (contest.blindDuration > contest.frozenDuration) {
      return res.json(InvalidOperation);
    }
    if (!contest.problems || !contest.problems.length) {
      return res.json(InvalidOperation);
    }
    if (contest.problems.length > 26) {
      return res.json(InvalidOperation);
    }
    // TODO check if problems are valid
    if (contest.password != contest.confirmPassword) {
      return res.json(InvalidOperation);
    }
    contest.contestantType = Number(contest.contestantType);
    if (!contest.contestantType || contest.contestantType < 1 || contest.contestantType > 3) {
      return res.json(InvalidOperation);
    }
    contest.watchPrivate = Number(contest.watchPrivate);
    if (contest.watchPrivate != 0 && contest.watchPrivate != 1) {
      return res.json(InvalidOperation);
    }
    return next();
  } catch (err) {
    console.log(err);
    return res.json(InvalidOperation);
  }
}

exports.edit = function(req, res, next) {
  var editContest = req.body;

  Contest.findById(editContest.id).exec().then(function(contest) {
    try {
      if (!contest) {
        return res.json(InvalidOperation);
      }
      if (contest.date_end <= new Date()) {
        return res.json(InvalidOperation);
      }
      if (contest.author.toString() !== req.user._id.toString()) {
        return res.json(InvalidOperation);
      }
      if (contest.date_start - editContest.startDateTime !== 0 && editContest.startDateTime <= new Date()) {
        return res.json({error: 'A nova data de início deve ocorrer no futuro (o horário do servidor é ' + new Date() + ')'});
      }
      if (contest.date_start <= new Date()) {
        if (contest.date_start - editContest.startDateTime !== 0) {
          return res.json(InvalidOperation);
        }
        if (contest.problems.length != editContest.problems.length) {
          return res.json(InvalidOperation);
        }
        for (var i = 0; i < contest.problems.length; i++) {
          if (contest.problems[i].toString() !== editContest.problems[i].toString()) {
            return res.json(InvalidOperation);
          }
        }
      }
      
      contest.name = editContest.name;
      contest.description = editContest.descr;
      contest.date_start = editContest.startDateTime;
      contest.date_end = editContest.endDateTime;
      contest.frozen_time = editContest.frozenDateTime;
      contest.blind_time = editContest.blindDateTime;
      contest.problems = editContest.problems;
      contest.contestantType = editContest.contestantType;
      contest.password = editContest.password;
      contest.isPrivate = (editContest.password.length > 0);
      contest.watchPrivate = (editContest.watchPrivate == 1);

      contest.save(function(err, data) {
        if (err) {
          return res.json({error: err});
        }
        return res.json(data);
      });
    } catch (err) {
      console.log(err);
      return res.json({error: err});
    }
  });
}

var isInContest = function(id, contest) {
  if (!id) return false;
  var index = _.findIndex(contest.contestants, function(obj) {
    return obj.id && obj.id._id.toString() == id.toString();
  });
  if (index != -1) return true;
  return false;
};

exports.getScoreboard = function(req, res, next) {
  var id = req.params.id;
  Contest.findById(id)
  .populate({
    path: 'contestants.team',
    select: '_id name'
  })
  .populate({
    path: 'contestants.id',
    select: '_id local.username'
  })
  .populate({
    path: 'problems',
    select: '_id url name'
  })
  .lean()
  .exec()
  .then(function(contest) {
    if (contest.watchPrivate && (!req.user || (contest.author.toString() !== req.user._id.toString() && !isInContest(req.user._id, contest)))) {
      return res.json(InvalidOperation);
    }
    var nonNullContestants = _.filter(contest.contestants, function (obj) {
      return obj.id;
    });
    var contestants =
      _.map(nonNullContestants, function (obj) {
        if (obj.team) return [obj.team._id, {type: 'team', name: obj.team.name}];
        else return [obj.id._id, {type: 'user', name: obj.id.local.username}];
      });
    contestants = _.object(contestants);
    var userToContestant =
    _.map(nonNullContestants, function(obj) {
      var toId = null;
      if (obj.team) toId = obj.team._id
      else toId = obj.id._id;
      return [obj.id._id, toId];
    });
    userToContestant = _.object(userToContestant);
    var userId = (req.user && req.user._id) || null;
    SubmissionCtrl.getScoresAndSubmissions(contest, userId, userToContestant, function(data) {
      return res.json({
        contestants: contestants,
        scores: data.scores,
        upsolvingScores: data.upsolvingScores,
        submissions: data.submissions,
        problems: contest.problems,
        start: contest.date_start,
        end: contest.date_end,
        blind: contest.blind_time,
        frozen: contest.frozen_time,
        name: contest.name,
        inContest: isInContest(userId, contest),
        contestantId: (userId && userToContestant[userId]) || null,
        now: new Date()
      });
    });
  });
}


exports.getDynamicScoreboard = function(req, res, next) {
  var id = req.params.id;
  Contest.findById(id)
  .populate({
    path: 'contestants.team',
    select: '_id name'
  })
  .populate({
    path: 'contestants.id',
    select: '_id local.username'
  })
  .populate({
    path: 'problems',
    select: '_id url'
  })
  .lean()
  .exec()
  .then(function(contest) {
    if (contest.watchPrivate && (!req.user || (contest.author.toString() !== req.user._id.toString() && !isInContest(req.user._id, contest)))) {
      return res.json(InvalidOperation);
    }
    if (new Date(contest.date_end) > new Date()) {
      return res.json(InvalidOperation);
    }
    var contestants =
    _.map(contest.contestants, function (obj) {
      if (obj.team) return [obj.team._id, {type: 'team', name: obj.team.name}];
      else return [obj.id._id, {type: 'user', name: obj.id.local.username}];
    });
    contestants = _.object(contestants);
    
    var userToContestant =
    _.map(contest.contestants, function(obj) {
      var toId = null;
      if (obj.team) toId = obj.team._id
      else toId = obj.id._id;
      return [obj.id._id, toId];
    });
    userToContestant = _.object(userToContestant);

    SubmissionCtrl.getAllContestSubmissions(contest, userToContestant, function(data) {
      return res.json({submissions: data.submissions});
    });
  });
}
