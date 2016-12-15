'use strict'

const redis = require('redis'),
  mongoose = require('mongoose')

const MONGO = require('../config/constants').MONGO,
  REDIS = require('../config/constants').REDIS

mongoose.Promise = require('bluebird')
var connectWithRetry = function() {
  return mongoose.connect(`mongodb://${MONGO.HOST}:${MONGO.PORT}/${MONGO.DB}`, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec');
      setTimeout(connectWithRetry, 5000);
    }
  });
};
connectWithRetry();

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
