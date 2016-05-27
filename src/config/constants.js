module.exports = {
  // SERVER RELATED
  GLOBAL_SET: {
    _name: 'GLOBAL_CONFIG',
    SEEDED: 'SEEDED'
  },
  CHANNELS: {
    LOAD_PROBLEMS: 'LOAD_PROBLEMS_CHANNEL'
  },
  COOKIE_SECRET_KEY: 'COOKIE_SECRET_KEY',

  // SYSTEM RELATED
  LANGUAGES: ['c', 'cpp', 'cpp11', 'java'],
  CODE_BYTE_LENGTH_RANGE: {
    min: 1,
    max: 64 * 1024 // 64KB is the maximum length of a submission code
  }
}
