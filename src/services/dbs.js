'use strict'

const redis = require('redis'),
  mongoose = require('mongoose')

const MONGO = require('../config/constants').MONGO,
  REDIS = require('../config/constants').REDIS

mongoose.connect(`mongodb://${MONGO.HOST}:${MONGO.PORT}/${MONGO.DB}`)

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
