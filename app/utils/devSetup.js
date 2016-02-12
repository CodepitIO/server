'use strict';

const mongoose = require('mongoose'),
      exec = require('child_process').exec,
      spawnSync = require('child_process').spawnSync,
      readline = require('readline'),
      fs = require('fs'),
      path = require('path'),
      Problem = require('../models/problem'),
      ObjectId = require('mongoose').Types.ObjectId;
      //problemsCppLoader = require('./problemsCppLoader');

var untarProblems = function(callback) {
  var problemsTarFile = path.join(__dirname, '.problems.tar.bz2');
  try {
    //fs.statSync(problemsTarFile);
    //spawnSync('tar', ['-jcvf', problemsTarFile, './test']);
  } catch (e) {}
}

var importProblems = function(callback) {
  var problemsFile = path.join(__dirname, '.problems.json');
  const rl = readline.createInterface({
    input: fs.createReadStream(problemsFile)
  });

  rl.on('line', (line) => {
    var newProblemJson = JSON.parse(line);
    newProblemJson._id = new ObjectId(newProblemJson._id.$oid);
    var newProblem = new Problem(newProblemJson);
    newProblem.save();
  });

  rl.on('close', callback);
}

//var problemsToCpp = problemsCppLoader;

module.exports = function() {
  untarProblems();
  // remove file as soon as we import problems
  Problem.count((err, count) => {
    if (count === 0) {
      importProblems(() => {
        //problemsToCpp(); 
      });
    }
  });
}
