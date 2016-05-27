'use strict'

const express = require('express'),
  passport = require('passport'),
  mongo_express = require('mongo-express/lib/middleware'),
  mustbe = require('mustbe').routeHelpers()

const UserCtrl = require('./controllers/user'),
  BlogCtrl = require('./controllers/blog'),
  CatalogCtrl = require('./controllers/catalog'),
  ContestsCtrl = require('./controllers/contests'),
  ProblemsCtrl = require('./controllers/problems'),
  SingleContestCtrl = require('./controllers/single_contest'),
  SubmissionCtrl = require('./controllers/submission'),
  TagCtrl = require('./controllers/tag'),
  TeamCtrl = require('./controllers/team')

const Utils = require('./utils/utils')

// Route validators
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next()
  return res.status(400).send()
}

function APIRoutes () {
  let router = express.Router()

  router.param('id', Utils.isValidId)

  // utils
  router.get('/server/time', Utils.getTime)

  // user
  router.post('/user/register', UserCtrl.register)
  router.post('/user/edit', isLoggedIn, UserCtrl.edit)
  router.post('/user/login', UserCtrl.login)
  router.get('/user/logout', isLoggedIn, UserCtrl.logout)

  // blog
  router.post('/blog/post', isLoggedIn, BlogCtrl.post)
  router.post('/blog/filter', BlogCtrl.getByFilter)
  router.post('/blog/count', BlogCtrl.getCountByFilter)

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
  // router.post('/contests/get/filter/:filter', ContestsCtrl.getByFilter)
  // router.post('/contests/create', isLoggedIn, SingleContestCtrl.prevalidation, ContestsCtrl.create)
  // router.post('/contest/:id/edit', isLoggedIn, SingleContestCtrl.prevalidation, SingleContestCtrl.edit)
  // router.post('/contest/:id/join', isLoggedIn, SingleContestCtrl.join)
  // router.post('/contest/:id/leave', isLoggedIn, SingleContestCtrl.leave)
  // router.get('/contest/:id/remove', isLoggedIn, SingleContestCtrl.remove)
  // router.get('/contest/:id/get/full', isLoggedIn, SingleContestCtrl.getFullData)
  // router.get('/contest/:id/scoreboard/dynamic', SingleContestCtrl.getDynamicScoreboard)
  // router.get('/contest/:id/scoreboard', SingleContestCtrl.getScoreboard)

  // problems
  // router.post('/problems/fetch', ProblemsCtrl.fetchProblems)
  // router.get('/problems/:id', ProblemsCtrl.getProblemMetadata)

  // submissions
  // router.post('/submission/send', isLoggedIn, SubmissionCtrl.send)
  // router.post('/submission/sendfile', isLoggedIn, SubmissionCtrl.extractFile, SubmissionCtrl.send)
  // router.get('/submission/:id', SubmissionCtrl.getById)

  // tags
  // router.get('/tags/create/:name', isLoggedIn, TagCtrl.createTag)
  // router.get('/tags', TagCtrl.getTags)

  // catalog
  // router.post('/catalog/update', isLoggedIn, CatalogCtrl.update)
  // router.post('/catalog/get', isLoggedIn, CatalogCtrl.get)

  return router
}

function AdminRoutes () {
  const kue = require('kue')

  let router = express.Router()

  // router.use(isLoggedIn)
  // router.use(IsAdmin)
  router.use('/queue', kue.app)

  return router
}

function OpenRoutes () {
  let indexFile = './public/index.html'
  if (process.env.NODE_ENV === 'development') {
    indexFile = './public/_index.html'
  }

  let router = express.Router()

  router.get('/problems/:id', ProblemsCtrl.getProblemContent)

  router.get('*', function (req, res) {
    res.sendfile(indexFile)
  })

  return router
}

exports.configure = function (app) {
  require('./services/passport')(passport) // pass passport for configuration
  app.use(passport.initialize())
  app.use(passport.session())

  app.use('/admin', AdminRoutes())
  app.use('/admin/mongo', mongo_express(require('./config/mongo_express')))
  app.use('/api/v1/', APIRoutes())
  app.use(OpenRoutes())
}
