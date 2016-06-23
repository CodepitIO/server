'use strict'

const express = require('express'),
  passport = require('passport'),
  mongo_express = require('mongo-express/lib/middleware'),
  bodyParser = require('body-parser'),
  expressValidator = require('express-validator'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  cookieSession = require('cookie-session'),
  compression = require('compression'),
  favicon = require('serve-favicon')

const UserCtrl = require('./controllers/user'),
  PostCtrl = require('./controllers/post'),
  ContestListCtrl = require('./controllers/contest_list'),
  ProblemsCtrl = require('./controllers/problems'),
  ContestCtrl = require('./controllers/contest'),
  SubmissionCtrl = require('./controllers/submission'),
  TeamCtrl = require('./controllers/team')

const User = require('./services/authorization'),
  Utils = require('./utils/utils'),
  Recaptcha = require('./utils/recaptcha')

function APIRoutes () {
  let router = express.Router()

  router.use(Recaptcha.middleware())
  router.param('id', Utils.isValidId)

  // utils
  router.get('/server/time', Utils.getTime)

  // user
  router.get('/user/status', UserCtrl.status)
  router.post('/user/register', UserCtrl.register)
  router.post('/user/edit', User.is('logged'), UserCtrl.edit)
  router.post('/user/login', UserCtrl.login)
  router.get('/user/logout', User.is('logged'), UserCtrl.logout)
  router.get('/user/check/username/:username', UserCtrl.checkUsername)
  router.get('/user/check/email/:email', UserCtrl.checkEmail)
  router.get('/user/:id', UserCtrl.get)

  // post
  router.post('/post', User.is('logged'), PostCtrl.post)
  router.get('/post/user/get/:id', PostCtrl.getByUser)
  router.get('/post/user/count/:id', PostCtrl.getCountByUser)
  router.get('/post/page/get/:name', PostCtrl.getByPage)
  router.get('/post/page/count/:name', PostCtrl.getCountByPage)

  // team
  // router.post('/team/create', isLoggedIn, TeamCtrl.createNew)
  // router.post('/team/leave', isLoggedIn, TeamCtrl.leave)
  // router.post('/team/invite', isLoggedIn, TeamCtrl.invite)
  // router.post('/team/remove', isLoggedIn, TeamCtrl.remove)
  // router.post('/team/edit', isLoggedIn, TeamCtrl.edit)
  // router.get('/team/accept/:id', isLoggedIn, TeamCtrl.accept)
  // router.get('/team/decline/:id', isLoggedIn, TeamCtrl.decline)
  // router.get('/team/user/:id', TeamCtrl.getByUser)
  // router.get('/team/get/:id', TeamCtrl.getById)

  // contests
  router.get('/contest/list/:type/from/:from', ContestListCtrl.getList)
  router.get('/contest/:id/metadata', ContestCtrl.getMetadata)
  router.get('/contest/:id/events', ContestCtrl.getEvents)
  router.get('/contest/:id/submissions/user', User.is('logged'), SubmissionCtrl.getUserContestSubmissions)
  router.post('/contest/:id/submit', User.is('logged'), SubmissionCtrl.tryExtractFile, SubmissionCtrl.submit)
  // router.post('/contests/create', isLoggedIn, SingleContestCtrl.prevalidation, ContestsCtrl.create)
  // router.post('/contest/:id/edit', isLoggedIn, SingleContestCtrl.prevalidation, SingleContestCtrl.edit)
  // router.post('/contest/:id/join', isLoggedIn, SingleContestCtrl.join)
  // router.post('/contest/:id/leave', isLoggedIn, SingleContestCtrl.leave)
  // router.get('/contest/:id/remove', isLoggedIn, SingleContestCtrl.remove)
  // router.get('/contest/:id/get/full', isLoggedIn, SingleContestCtrl.getFullData)
  // router.get('/contest/:id/scoreboard/dynamic', SingleContestCtrl.getDynamicScoreboard)
  // router.get('/contest/:id/scoreboard', SingleContestCtrl.getScoreboard)

  // problems
  router.post('/problems/filter', ProblemsCtrl.fetchProblems)
  router.get('/problems/:id', ProblemsCtrl.getProblemMetadata)

  // submissions
  router.get('/submission/:id', SubmissionCtrl.getById)

  return router
}

function OpenRoutes () {
  let indexFile = './public/index.html'
  if (process.env.NODE_ENV === 'development') {
    indexFile = './public/_index.html'
  }

  let router = express.Router()

  router.get('/problems/:id', ProblemsCtrl.getProblemContent)

  router.get('/', (req, res) => {
    return res.sendfile(indexFile)
  })

  router.get('*', (req, res) => {
    res.redirect('/')
  })

  return router
}

function AdminRoutes () {
  const kue = require('kue')

  let router = express.Router()
  router.use(User.is('admin'))
  router.use('/queue', kue.app)
  return router
}

exports.configure = (app) => {
  let cookieSecret = process.env.COOKIE_SECRET || 'COOKIE_SECRET'
  app.use(cookieParser())
  app.use(cookieSession({ secret: cookieSecret, maxAge: 30 * 24 * 60 * 60 * 1000 }))
  app.use(compression())
  app.use(favicon(__dirname + '/../public/imgs/favicon.ico'))
  app.use(bodyParser.json())
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(expressValidator({ customValidators: Utils.validators }))
  app.use(methodOverride('X-HTTP-Method-Override'))
  app.use(express.static(__dirname + '/../public'))

  require('./services/passport')(passport) // pass passport for configuration
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(User.middleware())

  app.use('/admin', AdminRoutes())
  app.use('/admin/mongo', mongo_express(require('./config/mongo_express')))
  app.use('/api/v1/', APIRoutes())
  app.use(OpenRoutes())
}
