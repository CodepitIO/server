const redis = require(`redis`);
const mongoose = require(`mongoose`);
const async = require(`async`);

const { CONN } = require(`../../common/constants`);

mongoose.Promise = require(`bluebird`);

mongoose.connect(CONN.MONGO.GET_URL(), {}, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});

exports.redisClient = redis.createClient({
  host: CONN.REDIS.HOST,
  port: CONN.REDIS.PORT,
  prefix: process.env.NODE_ENV,
});

exports.redisClient.on(`error`, (err) => {
  console.log(err);
});

exports.createRedisClient = () =>
  redis.createClient({
    host: CONN.REDIS.HOST,
    port: CONN.REDIS.PORT,
    prefix: process.env.NODE_ENV,
  });
