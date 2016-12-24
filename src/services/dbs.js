'use strict'

const redis = require('redis'),
  mongoose = require('mongoose'),
  async = require('async')

const MONGO = require('../config/constants').MONGO,
  REDIS = require('../config/constants').REDIS

mongoose.Promise = require('bluebird')
async.retry({times: 5, interval: 5000}, mongoose.connect.bind(mongoose, `mongodb://${MONGO.HOST}:${MONGO.PORT}/${MONGO.DB}`), function(err) {
  if(err) {
    console.log(err)
    process.exit()
  }
})

let redisClient = redis.createClient({
  host: REDIS.HOST,
  port: REDIS.PORT,
  prefix: process.env.NODE_ENV
})

redisClient.on('error', (err) => {
  console.log(err)
})

exports.redisClient = redisClient

exports.createRedisClient = () => {
  return redis.createClient({
    host: REDIS.HOST,
    port: REDIS.PORT,
    prefix: process.env.NODE_ENV
  })
}
