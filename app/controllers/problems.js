'use strict';

const _         = require('underscore'),
      pindexer  = require('pindexer');

exports.fetchProblems = function(req, res, next) {
  var substr = req.body.regex;
  var insertedProblems = req.body.problems || [];
  insertedProblems = _.map(insertedProblems, (obj) => { return obj.id; });
  return res.json({ problems: pindexer.match(substr, insertedProblems) });
};
