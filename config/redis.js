const redis = require('redis');

exports.defaultClient = redis.createClient({
  host: 'redis',
  prefix: process.env.NODE_ENV,
});

exports.createClient = () => {
  return redis.createClient({
    host: 'redis',
    prefix: process.env.NODE_ENV,
  });
}
