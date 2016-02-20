'use strict';

const fs = require('fs'),
      path = require('path'),
      async = require('async'),
      argv = require('optimist').argv,
      mongoose = require('mongoose'),
      redis = require('../config/redis').defaultClient,
      Problem = require('./models/problem'),
      config = require('../config/globals').CHANNELS,
      db = require('../config/db'),
      setup = require('./utils/setup');

const problemsFile = path.join(__dirname, "..", "cpp", "problems.txt");

var job = {};

var loadProblemsTxt = function() {
  fs.unlink(problemsFile, () => {
    Problem.find().select('_id oj fullName url').exec().then((problems) => {
      console.log(`Loading ${problems.length} problems to txt file...`);
      for (var i = 0; i < problems.length; i++) {
        if (problems[i].oj === 'uri' || problems[i].fullName.substring(0,1) !== '[') continue;
        fs.appendFileSync(problemsFile, problems[i].fullName + "\n\r" + problems[i].url + "\n\r" + problems[i]._id + "\n\r", {flags: 'a', mode: '0666'});
      }
      console.log('Completed problems loading to txt.');
    });
  });
}

job[config.LOAD_PROBLEMS] = function(check) {
  if (!check) return loadProblemsTxt();
  fs.stat(problemsFile, (err) => {
    if (err) loadProblemsTxt();
  });
}

function main() {
  console.log('Services waiting for events.');
  mongoose.connect(db.url);
  redis.subscribe(config.LOAD_PROBLEMS);
  redis.on('message', (channel, message) => { job[channel](message); });
  setup(() => { job[config.LOAD_PROBLEMS](true); });
};

main();
