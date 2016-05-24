'use strict';

const async     = require('async'),
      fs        = require('fs'),
      path      = require('path'),
      pindexer  = require('pindexer'),
      _         = require('underscore');

const ImportQueue      = require('../services/queue').ImportQueue,
      Exception     = require('../utils/exception'),
      Problem       = require('../models/problem');

const PROBLEMS_PATH = path.join(__dirname, '..', '..', 'public', 'problems');

fs.stat(PROBLEMS_PATH, (err) => {
  if (err) fs.mkdir(PROBLEMS_PATH);
});

exports.fetchProblems = (req, res, next) => {
  let substr = req.body.regex;
  let insertedProblems = req.body.problems || [];
  insertedProblems = _.map(insertedProblems, (obj) => { return obj.id; });
  return res.json({ problems: pindexer.match(substr, insertedProblems) });
};

exports.getProblemMetadata = (req, res, next) => {
  let id = req.params.id;
  Problem.findById(id).select('name oj id originalUrl source timelimit memorylimit inputFile outputFile')
  .exec((err, problem) => {
    if (err || !problem) return res.status(404).send();
    return res.json(problem);
  });
};

exports.getProblemContent = (req, res, next) => {
  let ext = path.extname(req.params.id);
  if (ext !== '.html') return res.status(404).send();
  let problemPath = path.join(PROBLEMS_PATH, req.params.id);
  ImportQueue.push(problemPath, (err) => {
    if (err) return res.status(400).send();
    return res.sendfile(problemPath);
  });
}
