"use strict";

const redis = require("redis"),
  mongoose = require("mongoose"),
  async = require("async");

const CONN = require("../../common/constants").CONN;

mongoose.Promise = require("bluebird");
mongoose.connect(CONN.MONGO.GET_URL(), {}, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});

let redisClient = redis.createClient({
  host: CONN.REDIS.HOST,
  port: CONN.REDIS.PORT,
  prefix: process.env.NODE_ENV,
});

redisClient.on("error", (err) => {
  console.log(err);
});

exports.redisClient = redisClient;

exports.createRedisClient = () => {
  return redis.createClient({
    host: CONN.REDIS.HOST,
    port: CONN.REDIS.PORT,
    prefix: process.env.NODE_ENV,
  });
};
