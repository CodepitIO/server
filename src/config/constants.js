module.exports = {
  // Databases
  MONGO: {
    HOST: 'mongo',
    PORT: 27017,
    DB: 'maratonando',
  },
  REDIS: {
    HOST: 'redis',
    PORT: 6379
  },
  MAILER: {
    SES_REGION: 'us-west-2',
    RATE_LIMIT: 5,
    MAX_CONN: 5,
  },

  // Dev
  ACCESS: {
    MEMBER: 0,
    ADMIN: 10
  }
}
