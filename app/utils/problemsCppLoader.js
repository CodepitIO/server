'use strict';

const fs = require('fs'),
      path = require('path'),
      argv = require('optimist').argv,
      mongoose = require('mongoose'),
      Problem = require('./models/problem'),
      db = require('./config/db');

module.exports = function() {
  var problemsFile = path.join(__dirname, "..", "..", "cpp", "problems.txt");
  try {
    fs.unlinkSync(problemsFile);
  } catch(e) {}

  Problem.find().select('_id oj fullName url').exec().then(function(problems) {
    for (var i = 0; i < problems.length; i++) {
      // TODO: remove this uri condition when they release the API
      if (problems[i].oj != 'uri' && problems[i].fullName.substring(0,1) === '[') {
        try {
          fs.appendFileSync(problemsFile, problems[i].fullName + "\n\r" + problems[i].url + "\n\r" + problems[i]._id + "\n\r", {flags: 'a', mode: '0666'});
        } catch (err) {
          // TODO: log error properly
          console.log(err);
        }
      }
    }
  });
}
