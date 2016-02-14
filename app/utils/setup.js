'Use strict';

const mongoose = require('mongoose'),
      redis = require('../../config/redis').defaultClient,
      config = require('../../config/global').GLOBAL,
      async = require('async'),
      _ = require('underscore'),
      exec = require('child_process').exec,
      spawn = require('child_process').spawn,
      readline = require('readline'),
      fs = require('fs'),
      path = require('path'),
      Problem = require('../models/problem'),
      ObjectId = require('mongoose').Types.ObjectId,
      ProblemsFileLoader = require('./problemsFileLoader');

var hasSeeded = function(seedFile, callback) {
  redis.sismember(config._name, config.SEEDED, (err, res) => {
    return callback(res !== 0);
  });
}

var untar = function(file, folder, callback) {
  var flags;
  if (path.extname(file) == '.bz2') flags = '-jxf';
  else if (path.extname(file) == '.gz') flags = '-zxf';
  else return callback(new Error('Compressed file type not recognized.'));
  console.log(`Unzipping file ${file} to folder ${folder}`);

  var proc = spawn('tar', [flags, file, '-C', folder]);
  proc.on('close', (code) => {
    if (code === 0) console.log(`${file} unzipped to ${folder} successfully`);
    else console.log(`Error while unzipping ${file} to ${folder}`);
    return callback(code === 0? null : code);
  });
}

var importProblems = function(problemsFile, callback) {
  console.log(`Importing problems file ${problemsFile} to database`);
  Problem.count((err, count) => {
    if (count !== 0) return callback(new Error("problems table is not pure."));

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
  });
}

var isHtml = function(file) {
  return path.extname(file) === '.html';
}

var extractProblemsHtml = function(file, folder, callback) {
  console.log('Extracting problems html folder');
  fs.mkdir(folder, (err) => {
    async.waterfall([
      fs.readdir.bind(null, folder),
      function(files, cb) {
        if (_.filter(files, isHtml).length !== 0) return cb(new Error(`${folder} is not pure.`));
        else return untar(file, folder, cb);        
      }
    ], function(err) {
      if (err) console.log(err);
      return callback(err);
    });
  });
}

var tryMakeTxt = function() {
  const problemsFile = path.join(__dirname, "..", "..", "cpp", "problems.txt");
  fs.stat(problemsFile, (err) => {
    if (err) redis.publish(config.LOAD_PROBLEMS_TXT_CHN, 0);
  });
}

module.exports = function() {
  const seedFile = path.join(__dirname, '.seed.tar.bz2');
  const tmpSeedFolder = path.join(__dirname, 'tmp');
  hasSeeded(seedFile, (seeded) => {
    if (seeded) return tryMakeTxt();
    console.log('Seeding application... This might take a few minutes.');
    redis.sadd(config._name, config.SEEDED);
    untar(seedFile, __dirname, () => {
      const problemsFile = path.join(tmpSeedFolder, 'problems.json');
      const problemsTarGz = path.join(tmpSeedFolder, 'problems.tar.gz');
      const problemsHtmlFolder = path.join(__dirname, '..', '..', 'public', 'problems');
      importProblems(problemsFile, (err) => {
        if (err) console.log(err);
        else {
          console.log(`Imported ${problemsFile} to problems collection successfully`);
          redis.publish(config.LOAD_PROBLEMS_TXT_CHN, 0);
        }
      });
      extractProblemsHtml(problemsTarGz, problemsHtmlFolder, () => {});
    });
  });
}
