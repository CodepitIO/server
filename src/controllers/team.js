var Team = require('../models/team');
var AccountCtrl = require('./account');

var ObjectId = require('mongoose').Types.ObjectId;
var Submission = require('../models/submission');
var _s             = require('underscore.string');

var config = {
  MAX_MEMBERS: 5
};

exports.createNew = function(req, res, next) {
  req.user.countEmptyTeam().exec().then(function(count) {
    if (count > 0) {
      return res.json({error: "Você já possui outro time vazio."})
    }
    var newTeam = new Team();

    newTeam.name = req.body.name;
    newTeam.members.push(req.user._id);
    newTeam.admin = req.user._id;

    newTeam.save(function(err, team) {
      if (err) {
        return res.json({error: err});
      }
      Team.findById(team._id)
      .populate('members invites')
      .lean()
      .exec()
      .then(function(data) {
        data.members = data.members.map(AccountCtrl.remapUser);
        return res.json(data);
      });
    });
  });
}

exports.getFromUser = function(req, res, next) {
  /*Submission.find({verdict: 4, contest: new ObjectId('55b2cf66fbb7236c0182aea5')}).exec().then(function(subs) {
    for (var i = 0; i < subs.length; i++) {
      subs[i].code = _s.unescapeHTML(subs[i].code);
      subs[i].verdict = 0;
      subs[i].save(function() {
        console.log(": )");
      });
    }
  });*/
  /*Contest.find().select('_id').exec().then(function(all) {
    console.log(all);
  });*/
  /*Team.find().exec().then(function(all) {
    console.log(all);
  });*/
  var id = req.params.id || (req.user && req.user._id);
  if (!id) {
    return res.json({error: 'Operação inválida.'});
  }
  Team.find({
    members: id
  })
  .select('_id name admin')
  .lean()
  .exec()
  .then(function(teams) {
    Team.find({
      invites: id
    })
    .select('_id name admin')
    .lean()
    .exec()
    .then(function(invited) {
      return res.json({
        teams: teams,
        invited: invited
      });
    });
  });
}

exports.getById = function(req, res, next) {
  var id = req.params.id;
  Team.findById(id)
  .populate('members invites')
  .lean()
  .exec()
  .then(function success(team) {
    if (!team) {
      return res.json({error: "Time não encontrado."});
    }
    team.members = team.members.map(AccountCtrl.remapUser);
    team.invites = team.invites.map(AccountCtrl.remapUser);
    team.isLoggedAdmin = (req.isAuthenticated() && team.admin.toString() == req.user._id.toString());
    return res.json(team);
  }, function error() {
    return res.json({error: "Time não encontrado."});
  });
}

exports.leave = function(req, res, next) {
  Team.findByIdAndUpdate(req.body.id, {
    $pull: {
      'members': req.user._id
    }
  })
  .exec()
  .then(function(team) {
    if (team.isAdmin(req.user._id)) {
      if (team.members.length == 0) {
        team.remove(function() {
          return res.json({});
        });
      } else {
        team.admin = team.members[0];
        team.save(function(err) {
          if (err) {
            return res.json({error: err});
          }
          return res.json({});
        });
      }
    } else {
      return res.json({});
    }
  });
}

exports.invite = function(req, res, next) {
  var id = req.body.id;
  var invitee = req.body.invitee;
  Team.findById(id).exec().then(function(team) {
    if (!team.isAdmin(req.user._id)) {
      return res.json({error: "Você não é o administrador deste time."});
    }
    if (team.getAllCount() >= config.MAX_MEMBERS) {
      return res.json({error: "Seu time não pode ter mais do que " + config.MAX_MEMBERS + " membros."});
    }

    AccountCtrl.getUserDataByEmail(invitee, function(userData) {
      if (!userData) {
        return res.json({error: "Não existe usuário com este email."});
      }
      if (team.hasUser(userData.id)) {
        return res.json({error: "Você não pode adicionar este usuário duas vezes."});
      }
      team.invites.push(userData.id);
      team.save(function(err) {
        if (err) {
          return res.json({error: err});
        }
        return res.json(userData);
      });
    });
  });
}

exports.remove = function(req, res, next) {
  var id = req.body.id;
  var removee = req.body.removee;
  Team.findById(id).exec().then(function(team) {
    if (!team.isAdmin(req.user._id) || team.isAdmin(removee) || !team.hasUser(removee)) {
      return res.json({error: "Operação ilegal."});
    }

    var removeUserFilter = function(id) {
      return id.toString() != removee.toString();
    }
    team.invites = team.invites.filter(removeUserFilter);
    team.members = team.members.filter(removeUserFilter);

    team.save(function(err) {
      if (err) {
        return res.json({error: err});
      }
      return res.json({});
    });
  }, function(err) {
    return res.json({error: err});
  });
}

exports.accept = function(req, res, next) {
  var id = req.params.id;
  Team.findById(id).exec().then(function(team) {
    if (!team.isInvited(req.user._id)) {
      return res.json({error: "Operação ilegal."});
    }

    var removeUserFilter = function(elem) {
      return elem.toString() != req.user._id.toString();
    }
    team.invites = team.invites.filter(removeUserFilter);
    team.members.push(req.user._id);

    team.save(function(err, team) {
      if (err) {
        return res.json({error: err});
      }
      return res.json({
        _id: team._id,
        name: team.name,
        admin: team.admin
      });
    });
  }, function(err) {
    return res.json({error: err});
  });
}

exports.decline = function(req, res, next) {
  var id = req.params.id;
  Team.findById(id).exec().then(function(team) {
    if (!team.isInvited(req.user._id)) {
      return res.json({error: "Operação ilegal."});
    }

    var removeUserFilter = function(elem) {
      return elem.toString() != req.user._id.toString();
    }
    team.invites = team.invites.filter(removeUserFilter);

    team.save(function(err, team) {
      if (err) {
        return res.json({error: err});
      }
      return res.json({});
    });
  }, function(err) {
    return res.json({error: err});
  });
}

exports.edit = function(req, res, next) {
  Team.findById(req.body.id).exec().then(function(team) {
    if (!team.isAdmin(req.user._id)) {
      return res.json({error: "Operação ilegal."});
    }
    var name = req.body.name || "";
    var descr = req.body.descr || "";
    if (name.length >= 1 && name.length <= 30) {
      team.name = name;
    }
    if (descr.length <= 250) {
      team.description = descr;
    }
    team.save(function(err, team) {
      if (err) {
        return res.json({error: err});
      }
      return res.json({});
    });
  }, function(err) {
    return res.json({error: err});
  });
}
