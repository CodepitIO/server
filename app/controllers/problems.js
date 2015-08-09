var Problem = require('../models/problem');

var spawn = require('child_process').spawn;
var problemsFile = 'problems.txt';

var _ = require('underscore');

var allProblems = [];
var problemStepSize = 1;

exports.remapProblem = function(obj) {
  return {
    id: obj._id,
    name: obj.fullName,
    url: obj.url
  };
}

var filterProblems = function(patt, insertedProblems, callback) {
  //console.time('match');
  insertedProblems = insertedProblems.map(function(obj) { return obj.id; });
  var matchProblems    = spawn('./matchProblems', [patt, problemsFile].concat(insertedProblems), {
    cwd: './cpp/'
  });
  
  matchProblems.stdout.on('data', function (data) {
    data = data.toString();
    var json = "{\"problems\":";
    for (var i = 0; i < data.length; i++) {
      if (data.charCodeAt(i) < 32) continue;
      if (data[i] == '"') json = json + '\\';
      if (data[i] == '`') json = json + '"';
      else json = json + data[i];
    }
    json = json + "}";
    return callback(JSON.parse(json));
  });

  matchProblems.stderr.on('data', function(a){console.log(a)});
}

exports.fetchProblems = function(req, res, next) {
  var substr = req.body.regex;
  var insertedProblems = req.body.problems || [];
  filterProblems(substr, insertedProblems, function(problems) {
    //console.timeEnd('match');
    return res.json({problems: problems.problems});
  });
};