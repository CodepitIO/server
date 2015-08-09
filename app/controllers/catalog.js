var Tag = require('../models/tag');
var Catalog = require('../models/catalog');
var ObjectId = require('mongoose').Types.ObjectId;

exports.update = function(req, res, next) {
  var keys = req.body.keys;
  var data = req.body.data;

  // TODO check if logged user relates to this contestant on the contest
  // i.e, Contest.contestants[req.user._id].team == contestant?? (if using team)

  keys.contestant = new ObjectId(keys.contestant);
  keys.contest = new ObjectId(keys.contest);

  var problem = data.problem;
  delete data.problem;
  Catalog.findOne(keys).exec().then(function(doc) {
    if (!doc) {
      doc = new Catalog({contestant: keys.contestant, contest: keys.contest});
      doc.data = {};
    }
    doc.data[problem] = data;
    doc.markModified('data');
    doc.save(function(err, doc) {
      return res.json({});
    });
  });
}

exports.get = function(req, res, next) {
  var keys = req.body.keys;

  // TODO check if logged user relates to this contestant on the contest
  // i.e, Contest.contestants[req.user._id].team == contestant?? (if using team)

  keys.contestant = new ObjectId(keys.contestant);
  keys.contest = new ObjectId(keys.contest);

  Catalog.findOne(keys).exec().then(function(doc) {
    return res.json({data: doc.data});
  });
}