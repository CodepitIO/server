'use strict';

const fs = require('fs'),
      path = require('path'),
      async = require('async'),
      argv = require('optimist').argv,
      mongoose = require('mongoose'),
      redis = require('redis').createClient({ host: 'redis' }),
      Problem = require('../models/problem'),
      config = require('../../config/global').GLOBAL,
      db = require('../../config/db');

var load = function() {
  var problemsFile = path.join(__dirname, "..", "..", "cpp", "problems.txt");
  fs.unlink(problemsFile, () => {
    Problem.find().select('_id oj fullName url').exec().then((problems) => {
      console.log(`Loading ${problems.length} problems to txt file...`);
      async.eachSeries(problems, (problem, cb) => {
        if (problem.oj === 'uri' || problem.fullName.substring(0,1) !== '[') return cb();
        fs.appendFile(problemsFile, problem.fullName + "\n\r" + problem.url + "\n\r" + problem._id + "\n\r", {flags: 'a', mode: '0666'}, cb); 
      }, () => {
        console.log('Completed problems loading to txt.');
      });
    });
  });
}

module.exports = (function() {
  redis.subscribe(config.LOAD_PROBLEMS_TXT_CHN);
  redis.on('message', (a, b) => { load() });
})();
