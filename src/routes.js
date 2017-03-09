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
  favicon = require('serve-favicon'),
  path = require('path')

const UserCtrl = require('./controllers/user'),
  PostCtrl = require('./controllers/post'),
  ContestListCtrl = require('./controllers/contest_list'),
  ProblemsCtrl = require('./controllers/problems'),
  ContestCtrl = require('./controllers/contest'),
  SubmissionCtrl = require('./controllers/submission'),
  TeamCtrl = require('./controllers/team')

const User = require('./services/authorization'),
  Utils = require('./utils/utils'),
  Recaptcha = require('./utils/recaptcha'),
  cookieSlider = require('./services/cookie_slider')

function APIRoutes () {
  let router = express.Router()
  router.param('id', Utils.isValidId)

  // utils
  router.get('/server/time', Utils.getTime)

  // user
  router.get('/user/status', UserCtrl.status)
  router.post('/user/login', UserCtrl.login)
  router.get('/user/logout', User.is('logged'), UserCtrl.logout)
  router.post('/user/edit', User.is('logged'), UserCtrl.edit)
  router.post('/user/register', Recaptcha.check, UserCtrl.register)
  router.get('/user/teams', User.is('logged'), TeamCtrl.getByLoggedUser)
  router.get('/user/check/username/:username', UserCtrl.checkUsername)
  router.get('/user/check/email/:email', UserCtrl.checkEmail)
  router.post('/user/recover', User.is('logged-off'), Recaptcha.check, UserCtrl.recover)
  router.get('/user/recover/:user', User.is('logged-off'), UserCtrl.sendPasswordRecoveryEmail)
  router.get('/user/validate', User.is('logged'), UserCtrl.sendValidationEmail)
  router.get('/user/validate/:hash', UserCtrl.validate)
  router.get('/user/:id', UserCtrl.get)

  // post
  router.post('/post', User.is('logged'), PostCtrl.post)
  router.get('/post/user/:id/count', PostCtrl.getCountByUser)
  router.get('/post/user/:id', PostCtrl.getByUser)
  router.get('/post/page/:name/count', PostCtrl.getCountByPage)
  router.get('/post/page/:name', PostCtrl.getByPage)

  // team
  router.post('/team/create', User.is('logged'), TeamCtrl.create)
  router.post('/team/:id/edit', User.is('logged'), TeamCtrl.edit)
  router.post('/team/:id/leave', User.is('logged'), TeamCtrl.leave)
  router.post('/team/:id/invite', User.is('logged'), TeamCtrl.invite)
  router.post('/team/:id/remove', User.is('logged'), TeamCtrl.remove)
  router.post('/team/:id/accept', User.is('logged'), TeamCtrl.accept)
  router.post('/team/:id/decline', User.is('logged'), TeamCtrl.decline)
  router.get('/team/:id', TeamCtrl.getById)

  // contests
  router.get('/contest/list/:type/:from?', ContestListCtrl.getList)
  router.get('/contest/:id/metadata', ContestCtrl.getMetadata)
  router.get('/contest/:id/events/:from?', ContestCtrl.getEvents)
  router.get('/contest/:id/submissions/:from?', User.is('logged'), SubmissionCtrl.getRepContestSubmissions)
  router.get('/contest/:id/rep/:rid/problem/:pid', User.is('logged'), SubmissionCtrl.getRepProblemSubmissions)
  router.post('/contest/:id/join', User.is('logged'), ContestCtrl.join)
  router.post('/contest/:id/leave', User.is('logged'), ContestCtrl.leave)
  router.post('/contest/:id/submit', User.is('logged'), SubmissionCtrl.tryExtractFile, SubmissionCtrl.submit)
  router.post('/contest/:id/edit', User.is('logged'), Recaptcha.check, ContestCtrl.validateContest, ContestCtrl.createOrEdit)
  router.post('/contest/create', User.is('logged'), Recaptcha.check, ContestCtrl.validateContest, ContestCtrl.createOrEdit)

  // problems
  router.post('/problems/filter', ProblemsCtrl.searchProblems)
  router.get('/problems/:id', ProblemsCtrl.getProblemMetadata)

  // submissions
  router.get('/submission/:id', SubmissionCtrl.getById)

  return router
}

function OpenRoutes () {
  let indexFile = 'index.html'
  if (process.env.NODE_ENV === 'development') {
    indexFile = '_index.html'
  }
  let router = express.Router()
  router.get('/', (req, res) => {
    return res.sendFile(indexFile, { root: path.join(__dirname, '../public/') })
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
  app.use(cookieSession({ secret: cookieSecret, maxAge: 24 * 60 * 60 * 1000 }))
  app.use(compression())
  app.use(favicon(path.join(__dirname,'../public/imgs/favicon.ico')))
  app.use(bodyParser.json())
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(expressValidator())
  app.use(methodOverride('X-HTTP-Method-Override'))
  app.use(express.static(__dirname + '/../public'))

  require('./services/passport')(passport) // pass passport for configuration
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(User.middleware())
  app.use(cookieSlider.middleware());

  app.use('/admin', AdminRoutes())
  app.use('/admin/mongo', mongo_express(require('./config/mongo_express')))
  app.use('/api/v1/', APIRoutes())
  app.use(OpenRoutes())
}
