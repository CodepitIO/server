"use strict";

const async = require("async"),
  _ = require("lodash");

const Team = require("../../common/models/team"),
  User = require("../../common/models/user"),
  Errors = require("../utils/errors"),
  Utils = require("../../common/lib/utils");

const MAX_TEAMS_PER_USER = 20;
const MAX_USERS_PER_TEAM = 5;

const getByUserId = async (userId) => {
  const memberPromise = Team.find(
    { members: userId },
    "_id name description members"
  ).populate({
    path: "members",
    select: "_id username firstName lastName email",
  });
  const invitedPromise = Team.find(
    { invites: userId },
    "_id name description members"
  ).populate({
    path: "members",
    select: "_id username firstName lastName email",
  });
  const [member, invited] = await Promise.all([memberPromise, invitedPromise]);
  return {
    member: _.map(member, (obj) => {
      return obj.toObject({ virtuals: true });
    }),
    invited: _.map(invited, (obj) => {
      return obj.toObject({ virtuals: true });
    }),
  };
};

exports.getByUser = async (req, res) => {
  try {
    const response = await getByUserId(req.params.id);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).send();
  }
};

exports.getByLoggedUser = async (req, res) => {
  try {
    const response = await getByUserId(req.user._id);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

exports.getInvites = async (req, res) => {
  const userId = req.user._id;
  try {
    const count = await Team.count({ invites: userId });
    return res.status(200).json({ count: count });
  } catch (err) {
    return res.status(500).send();
  }
};

exports.getById = async (req, res) => {
  let teamId = req.params.id;
  try {
    const team = await Team.findById(teamId)
      .populate({
        path: "members",
        select: "_id username firstName lastName email",
      })
      .populate({
        path: "invites",
        select: "_id username firstName lastName email",
      });
    if (!team) return res.status(400).send();
    return res.status(200).json({ team: team.toObject({ virtuals: true }) });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

exports.leave = async (req, res) => {
  let teamId = req.params.id,
    userId = req.user._id;
  try {
    const team = await Team.findOneAndUpdate(
      { _id: teamId, members: userId },
      {
        $pull: {
          members: userId,
        },
      }
    );
    if (!team) return res.status(400).send();
    if (team.members.length <= 1) {
      await Team.deleteOne({ _id: teamId });
    }
    return res.json({});
  } catch (err) {
    return res.status(500).send();
  }
};

exports.invite = async (req, res) => {
  let teamId = req.params.id;
  let invitedUsernameOrEmail = req.body.usernameOrEmail;
  let userId = req.user._id;
  const teamPromise = Team.findOne({ _id: teamId, members: userId });
  const invitedPromise = User.findOne(
    {
      $or: [
        { username: invitedUsernameOrEmail },
        { email: invitedUsernameOrEmail },
      ],
    },
    "_id username firstName lastName email"
  );
  try {
    const [team, invited] = await Promise.all([teamPromise, invitedPromise]);
    if (!team) return res.status(400).send();
    if (!invited) return res.json(Errors.UserNotFoundByEmail);
    if (team.hasUser(invited._id)) return res.json(Errors.UserAlreadyInTeam);
    if (team.members.length + team.invites.length >= MAX_USERS_PER_TEAM) {
      return res.status(400).send();
    }
    team.invites.push(invited._id);
    await team.save();
    return res.json({ invited: invited.toObject({ virtuals: true }) });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

exports.remove = async (req, res) => {
  let teamId = req.params.id;
  let removedId = req.body.removed;
  let userId = req.user._id;
  try {
    const team = await Team.findOne({ _id: teamId, members: userId });
    if (!team) return res.status(400).send();
    team.invites = _.filter(team.invites, Utils.cmpDiffStringFn(removedId));
    team.members = _.filter(team.members, Utils.cmpDiffStringFn(removedId));
    await team.save();
    return res.json({});
  } catch (err) {
    return res.status(500).send();
  }
};

exports.accept = async (req, res) => {
  let teamId = req.params.id;
  let userId = req.user._id;
  const countPromise = Team.count({ members: userId });
  const teamPromise = Team.findOne({ _id: teamId, invites: userId });
  try {
    const [count, team] = await Promise.all([countPromise, teamPromise]);
    if (!team) return res.status(400).send();
    if (count >= MAX_TEAMS_PER_USER)
      return res.json(Errors.UserTeamLimitExceed);
    team.invites = _.filter(team.invites, Utils.cmpDiffStringFn(userId));
    team.members.push(userId);
    await team.save();
    return res.json({});
  } catch (err) {
    return res.status(500).send();
  }
};

exports.decline = async (req, res) => {
  let teamId = req.params.id;
  let userId = req.user._id;
  try {
    const team = await Team.findOne({ _id: teamId, invites: userId });
    if (!team) return res.status(400).send();
    team.invites = _.filter(team.invites, Utils.cmpDiffStringFn(userId));
    await team.save();
    return res.json({});
  } catch (err) {
    return res.status(500).send();
  }
};

exports.create = async (req, res) => {
  if (Team.validateChain(req).seeName().seeDescription().notOk()) {
    return res.status(400).send();
  }
  // TODO: user should wait at least 10 minutes to create a new team
  let userId = req.user._id;

  try {
    const count = await Team.count({
      members: userId,
    });
    if (count >= MAX_TEAMS_PER_USER) {
      return res.status(400).send();
    }
    let teamModel = new Team({
      name: req.body.name,
      description: req.body.description || "",
      members: [userId],
    });
    const team = await teamModel.save();
    return res.json({ team: team });
  } catch (err) {
    return res.status(500).send();
  }
};

exports.edit = (req, res) => {
  if (Team.validateChain(req).seeName().seeDescription().notOk()) {
    return res.status(400).send();
  }
  let teamId = req.body.id;
  let userId = req.user._id;
  Team.findOne({ _id: teamId, members: userId }, (err, team) => {
    if (err) return res.status(500).send();
    if (!team) return res.status(400).send();
    team.name = req.body.name;
    team.description = req.body.description || "";
    team.save((err) => {
      if (err) return res.status(500).send();
      return res.json({});
    });
  });
};
