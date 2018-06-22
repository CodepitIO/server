'use strict';

const kue = require('kue');

const Dbs = require('./dbs');

let PublishQueue = kue.createQueue({
  redis: {
    createClientFactory: Dbs.createRedisClient,
  },
  jobEvents: false
});

let SubscribeQueue = kue.createQueue({
  redis: {
    createClientFactory: Dbs.createRedisClient,
  },
  jobEvents: false
});

exports.pushSubmission = (oj, s, callback) => {
  let job = PublishQueue.create(`submission:${oj}`, { id: s._id });
  job.attempts(7);
  job.backoff({ delay: 60 * 1000, type: 'exponential' });
  job.save(callback);
};

exports.pushEmail = (data, callback) => {
  let job = PublishQueue.create(`email`, data);
  job.attempts(3);
  job.backoff({ delay: 5 * 60 * 1000, type: 'exponential' });
  job.save(callback);
};

exports.pullEmail = (delegateFn) => {
  SubscribeQueue.process(`email`, 10, delegateFn);
};
