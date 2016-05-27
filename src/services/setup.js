'use strict'

const async = require('async'),
  spawn = require('child_process').spawn,
  exec = require('child_process').exec,
  readline = require('readline'),
  fs = require('fs'),
  path = require('path'),
  pindexer = require('pindexer')

const globals = require('../config/constants').GLOBAL_SET,
  Problem = require('../models/problem'),
  ObjectId = require('mongoose').Types.ObjectId,
  dbs = require('./dbs'),
  queues = require('./queue')

function untar (file, folder, callback) {
  var flags
  if (path.extname(file) == '.bz2') flags = '-jxf'
  else if (path.extname(file) == '.gz') flags = '-zxf'
  else return callback(new Error('Compressed file type not recognized.'))
  console.log(`Unzipping file ${file} to folder ${folder}`)

  var proc = spawn('tar', [flags, file, '-C', folder])
  proc.on('close', (code) => {
    if (code === 0) console.log(`${file} unzipped to ${folder} successfully`)
    else console.log(`Error while unzipping ${file} to ${folder}`)
    return callback(code === 0 ? null : code)
  })
}

function importProblems (problemsFile, callback) {
  console.log(`Importing problems file ${problemsFile} to database`)
  Problem.count((err, count) => {
    if (count !== 0) {
      console.log('Not seeding `problems` collections because it have elements.')
      return callback()
    }

    const rl = readline.createInterface({
      input: fs.createReadStream(problemsFile)
    })

    rl.on('line', (line) => {
      var newProblemJson = JSON.parse(line)
      newProblemJson._id = new ObjectId(newProblemJson._id.$oid)
      ;(new Problem(newProblemJson)).save()
    })

    rl.on('close', function (err) {
      if (err) console.log(err)
      else console.log(`Imported ${problemsFile} to problems collection successfully`)
      return callback()
    })
  })
}

function populate (callback) {
  const utilsFolder = path.join(__dirname, '..', 'utils')
  const seedFile = path.join(utilsFolder, '.seed.tar.bz2')
  const tmpSeedFolder = path.join(utilsFolder, 'tmp')
  dbs.redisClient.sismember(globals._name, globals.SEEDED, (err, seeded) => {
    if (seeded) {
      console.log('Already seeded before.')
      return callback()
    }
    console.log('Seeding application... This might take a few minutes.')
    untar(seedFile, utilsFolder, () => {
      const problemsFile = path.join(tmpSeedFolder, 'problems.json')
      importProblems(problemsFile, () => {
        dbs.redisClient.sadd(globals._name, globals.SEEDED)
        console.log(`Removed ${tmpSeedFolder} folder.`)
        return exec(`rm -rf ${tmpSeedFolder}`, callback)
      })
    })
  })
}

function populateAndIndexProblems () {
  async.waterfall([
    populate,
    (next) => {
      Problem.find({}, next)
    },
    (problems, next) => {
      async.eachSeries(problems, (item, callback) => {
        if (item.id && item.url && item.fullName && item.fullName.substring(0, 1) === '[') {
          pindexer.addProblem(
            item.fullName,
            item._id,
            item.url
          )
        }
        return async.setImmediate(callback)
      }, next)
    }
  ], () => {
    console.log('Finished adding problems to index.')
  })
}

module.exports = function (callback) {
  if (process.env.NODE_ENV === 'development') {
    // populateAndIndexProblems()
  }
  return callback()
}
