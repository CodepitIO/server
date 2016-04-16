'use strict';

const async     = require('async'),
      _         = require('underscore'),
      spawn     = require('child_process').spawn,
      exec      = require('child_process').exec,
      readline  = require('readline'),
      fs        = require('fs'),
      path      = require('path'),
      pindexer  = require('pindexer');

const globals   = require('../config/globals').GLOBAL_SET,
      channels  = require('../config/globals').CHANNELS,
      redis     = require('../config/redis').createClient(),
      Problem   = require('./models/problem'),
      ObjectId  = require('mongoose').Types.ObjectId;

function untar(file, folder, callback) {
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

function importProblems(problemsFile, callback) {
  console.log(`Importing problems file ${problemsFile} to database`);
  Problem.count((err, count) => {
    if (count !== 0) {
      console.log("Not seeding `problems` collections because it have elements.")
      return callback();
    }

    const rl = readline.createInterface({
      input: fs.createReadStream(problemsFile)
    });

    rl.on('line', (line) => {
      var newProblemJson = JSON.parse(line);
      newProblemJson._id = new ObjectId(newProblemJson._id.$oid);
      (new Problem(newProblemJson)).save();
    });

    rl.on('close', function(err) {
      if (err) console.log(err);
      else console.log(`Imported ${problemsFile} to problems collection successfully`);
      return callback();
    });
  });
}

function isHtml(file) {
  return path.extname(file) === '.html';
}

function extractProblemsHtml(file, folder, callback) {
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

function populate(callback) {
  const seedFile = path.join(__dirname, '.seed.tar.bz2');
  const tmpSeedFolder = path.join(__dirname, 'tmp');
  redis.sismember(globals._name, globals.SEEDED, (err, seeded) => {
    if (seeded) {
      console.log('Already seeded before.');
      return callback();
    }
    console.log('Seeding application... This might take a few minutes.');
    untar(seedFile, __dirname, () => {
      const problemsFile = path.join(tmpSeedFolder, 'problems.json');
      const problemsTarGz = path.join(tmpSeedFolder, 'problems.tar.gz');
      const problemsHtmlFolder = path.join(__dirname, '..', '..', 'public', 'problems');
      async.parallel([
        (callback) => { importProblems(problemsFile, callback); },
        (callback) => { extractProblemsHtml(problemsTarGz, problemsHtmlFolder, callback); },
      ], function() {
        redis.sadd(globals._name, globals.SEEDED);
        console.log(`Removed ${tmpSeedFolder} folder.`);
        return exec(`rm -rf ${tmpSeedFolder}`, callback);
      });
    });
  });
}

module.exports = function() {
  async.waterfall([
    populate,
    (callback) => { Problem.find({}, callback); },
    (problems, callback) => {
      for (var i = 0; i < problems.length; i++) {
        if (problems[i].fullName && problems[i].id && problems[i].url && problems[i].fullName.substring(0,1) === '[' && problems[i].oj !== 'uri') {
          pindexer.addProblem(
            problems[i].fullName,
            problems[i]._id,
            problems[i].url
          );
        }
      }
      callback();
    }
  ], () => {
    console.log('Finished adding problems to index.');
  });
}
