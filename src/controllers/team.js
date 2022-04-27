const async = require(`async`);
const _ = require(`lodash`);

const Contest = require(`../../common/models/contest`);
const Team = require(`../../common/models/team`);
const User = require(`../../common/models/user`);
const Errors = require(`../utils/errors`);

const Utils = require(`../../common/lib/utils`);

const MAX_TEAMS_PER_USER = 20;
const MAX_USERS_PER_TEAM = 5;

exports.getTeamMembersInContest = async (req, res) => {
  try {
    const contestId = req.params.id;
    const { teamId } = req.params;
    const team = await Contest.find({
      _id: contestId,
      contestants: { team: teamId, user: req.user?._id },
    });
    if (!team) {
      return res.sendStatus(400);
    }
    return res.status(200).json({
      data: team,
    });
  } catch (err) {
    return res.sendStatus(500);
  }
};

const getByUserId = async (userId) => {
  const memberPromise = Team.find(
    { members: userId },
    `_id name description members`
  ).populate({
    path: `members`,
    select: `_id username firstName lastName email`,
  });
  const invitedPromise = Team.find(
    { invites: userId },
    `_id name description members`
  ).populate({
    path: `members`,
    select: `_id username firstName lastName email`,
  });
  const [member, invited] = await Promise.all([memberPromise, invitedPromise]);
  return {
    member: _.map(member, (obj) => obj.toObject({ virtuals: true })),
    invited: _.map(invited, (obj) => obj.toObject({ virtuals: true })),
  };
};

exports.getByUser = async (req, res) => {
  try {
    const response = await getByUserId(req.params.id);
    return res.status(200).json(response);
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.getByLoggedUser = async (req, res) => {
  try {
    const response = await getByUserId(req.user._id);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

exports.getInvites = async (req, res) => {
  const userId = req.user._id;
  try {
    const count = await Team.count({ invites: userId });
    return res.status(200).json({ count });
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.getById = async (req, res) => {
  const teamId = req.params.id;
  try {
    const team = await Team.findById(teamId)
      .populate({
        path: `members`,
        select: `_id username firstName lastName email`,
      })
      .populate({
        path: `invites`,
        select: `_id username firstName lastName email`,
      });
    if (!team) return res.sendStatus(400);
    return res.status(200).json({ team: team.toObject({ virtuals: true }) });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

exports.leave = async (req, res) => {
  const teamId = req.params.id;
  const userId = req.user._id;
  try {
    const team = await Team.findOneAndUpdate(
      { _id: teamId, members: userId },
      {
        $pull: {
          members: userId,
        },
      }
    );
    if (!team) return res.sendStatus(400);
    if (team.members.length <= 1) {
      await Team.deleteOne({ _id: teamId });
    }
    return res.json({});
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.invite = async (req, res) => {
  const teamId = req.params.id;
  const invitedUsernameOrEmail = req.body.usernameOrEmail;
  const userId = req.user._id;
  const teamPromise = Team.findOne({ _id: teamId, members: userId });
  const invitedPromise = User.findOne(
    {
      $or: [
        { username: invitedUsernameOrEmail },
        { email: invitedUsernameOrEmail },
      ],
    },
    `_id username firstName lastName email`
  );
  try {
    const [team, invited] = await Promise.all([teamPromise, invitedPromise]);
    if (!team) return res.sendStatus(400);
    if (!invited) return res.json(Errors.UserNotFoundByEmail);
    if (team.hasUser(invited._id)) return res.json(Errors.UserAlreadyInTeam);
    if (team.members.length + team.invites.length >= MAX_USERS_PER_TEAM) {
      return res.sendStatus(400);
    }
    team.invites.push(invited._id);
    await team.save();
    return res.json({ invited: invited.toObject({ virtuals: true }) });
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.remove = async (req, res) => {
  const teamId = req.params.id;
  const removedId = req.body.removed;
  const userId = req.user._id;
  try {
    const team = await Team.findOne({ _id: teamId, members: userId });
    if (!team) return res.sendStatus(400);
    team.invites = _.filter(team.invites, Utils.cmpDiffStringFn(removedId));
    team.members = _.filter(team.members, Utils.cmpDiffStringFn(removedId));
    await team.save();
    return res.json({});
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.accept = async (req, res) => {
  const teamId = req.params.id;
  const userId = req.user._id;
  const countPromise = Team.count({ members: userId });
  const teamPromise = Team.findOne({ _id: teamId, invites: userId });
  try {
    const [count, team] = await Promise.all([countPromise, teamPromise]);
    if (!team) return res.sendStatus(400);
    if (count >= MAX_TEAMS_PER_USER)
      return res.json(Errors.UserTeamLimitExceed);
    team.invites = _.filter(team.invites, Utils.cmpDiffStringFn(userId));
    team.members.push(userId);
    await team.save();
    return res.json({});
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.decline = async (req, res) => {
  const teamId = req.params.id;
  const userId = req.user._id;
  try {
    const team = await Team.findOne({ _id: teamId, invites: userId });
    if (!team) return res.sendStatus(400);
    team.invites = _.filter(team.invites, Utils.cmpDiffStringFn(userId));
    await team.save();
    return res.json({});
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.create = async (req, res) => {
  if (Team.validateChain(req).seeName().seeDescription().notOk()) {
    return res.sendStatus(400);
  }
  // TODO: user should wait at least 10 minutes to create a new team
  const userId = req.user._id;

  try {
    const count = await Team.count({
      members: userId,
    });
    if (count >= MAX_TEAMS_PER_USER) {
      return res.sendStatus(400);
    }
    const teamModel = new Team({
      name: req.body.name,
      description: req.body.description || ``,
      members: [userId],
    });
    const team = await teamModel.save();
    return res.json({ team });
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.edit = (req, res) => {
  if (Team.validateChain(req).seeName().seeDescription().notOk()) {
    return res.sendStatus(400);
  }
  const teamId = req.body.id;
  const userId = req.user._id;
  Team.findOne({ _id: teamId, members: userId }, (err, team) => {
    if (err) return res.sendStatus(500);
    if (!team) return res.sendStatus(400);
    team.name = req.body.name;
    team.description = req.body.description || ``;
    team.save((err) => {
      if (err) return res.sendStatus(500);
      return res.json({});
    });
  });
};
