'use strict';

const redis = require('redis'),
	mongoose = require('mongoose');

const mongoUrl = `mongodb://mongo:27017/maratonando`;

mongoose.connect(mongoUrl);

var redisClient = redis.createClient({
	host: 'redis',
	prefix: process.env.NODE_ENV,
});

redisClient.on('error', (err) => {
	console.log(err);
});

exports.redisClient = redisClient;

exports.createRedisClient = () => {
	return redis.createClient({
		host: 'redis',
		prefix: process.env.NODE_ENV,
	});
}
