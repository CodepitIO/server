'use strict'

const MONGO = require('./constants').MONGO

let SECRET = process.env.COOKIE_SECRET || 'COOKIE_SECRET'

module.exports = {
  mongodb: {
    server: MONGO.HOST,
    port: MONGO.PORT,
    ssl: false,
    sslValidate: true,
    sslCA: [],
    autoReconnect: true,
    poolSize: 4,
    auth: [{
      database: MONGO.DB,
      username: '',
      password: ''
    } ],
    whitelist: [],
    blacklist: []
  },

  site: {
    baseUrl: '/admin/',
    host: 'mongo',
    cookieSecret: SECRET,
    sessionSecret: SECRET,
    port: 8081,
    requestSizeLimit: '50mb',
    sslCert: '',
    sslEnabled: false,
    sslKey: ''
  },

  useBasicAuth: false,
  options: {
    console: false,
    documentsPerPage: 10,
    editorTheme: 'rubyblue',
    maxPropSize: (100 * 1000),
    maxRowSize: (1000 * 1000),
    cmdType: 'subprocess',
    subprocessTimeout: 300,
    readOnly: false,
    collapsibleJSON: true,
    collapsibleJSONDefaultUnfold: 1
  }
}
