import CookieSlider from './services/cookie_slider';
import UserACL from './services/authorization';

const express = require(`express`);

const passport = require(`passport`);
const mongoExpress = require(`mongo-express/lib/middleware`);
const bodyParser = require(`body-parser`);
const expressValidator = require(`express-validator`);
const methodOverride = require(`method-override`);
const cookieParser = require(`cookie-parser`);
const cookieSession = require(`cookie-session`);
const compression = require(`compression`);
const favicon = require(`serve-favicon`);
const path = require(`path`);
const cors = require(`cors`);
const kue = require(`kue`);

const UserCtrl = require(`./controllers/user`);
const BlogCtrl = require(`./controllers/blog`);
const ContestListCtrl = require(`./controllers/contest_list`);
const ProblemsCtrl = require(`./controllers/problems`);
const ContestCtrl = require(`./controllers/contest`);
const SubmissionCtrl = require(`./controllers/submission`);
const TeamCtrl = require(`./controllers/team`);

const mongoExpressConfig = require(`./services/mongo_express`);
const configurePassport = require(`./services/passport`);

const Utils = require(`../common/lib/utils`);
const Recaptcha = require(`./utils/recaptcha`);

function APIRoutes() {
  const router = express.Router();

  // submissions
  router.get(`/submission/:id`, SubmissionCtrl.getById);

  // user
  router.get(`/user`, UserCtrl.tryGetByLoggedUser);
  router.get(`/user/status`, UserCtrl.status);
  router.post(`/user/login`, UserCtrl.login);
  router.get(`/user/logout`, UserACL.is(`logged`), UserCtrl.logout);
  router.post(`/user/edit`, UserACL.is(`logged`), UserCtrl.edit);
  router.post(`/user/changePassword`, UserCtrl.changePassword);
  router.post(`/user/register`, Recaptcha.check, UserCtrl.register);
  router.get(`/user/teams/invites`, UserACL.is(`logged`), TeamCtrl.getInvites);
  router.get(`/user/teams`, UserACL.is(`logged`), TeamCtrl.getByLoggedUser);
  router.get(
    `/user/check/:usernameOrEmail`,
    UserCtrl.checkAvailableUsernameOrEmail
  );
  router.post(
    `/user/recover`,
    UserACL.is(`logged-off`),
    Recaptcha.check,
    UserCtrl.recover
  );
  router.get(
    `/user/recover/:user`,
    UserACL.is(`logged-off`),
    UserCtrl.sendPasswordRecoveryEmail
  );
  router.get(`/user/posts`, UserACL.is(`logged`), BlogCtrl.getByUser);
  router.get(`/user/verify`, UserACL.is(`logged`), UserCtrl.sendValidationEmail);
  router.get(`/user/verify/:hash`, UserCtrl.validate);
  router.get(`/user/:id`, Utils.isValidId, UserCtrl.get);
  router.get(`/user/:id/teams`, Utils.isValidId, TeamCtrl.getByUser);

  // post
  router.post(`/blog/post`, UserACL.is(`logged`), BlogCtrl.post);
  router.get(`/blog/:name/posts`, BlogCtrl.getByBlog);

  // team
  router.post(`/team/create`, UserACL.is(`logged`), TeamCtrl.create);
  router.post(
    `/team/:id/edit`,
    Utils.isValidId,
    UserACL.is(`logged`),
    TeamCtrl.edit
  );
  router.post(
    `/team/:id/leave`,
    Utils.isValidId,
    UserACL.is(`logged`),
    TeamCtrl.leave
  );
  router.post(
    `/team/:id/invite`,
    Utils.isValidId,
    UserACL.is(`logged`),
    TeamCtrl.invite
  );
  router.post(
    `/team/:id/remove`,
    Utils.isValidId,
    UserACL.is(`logged`),
    TeamCtrl.remove
  );
  router.post(
    `/team/:id/accept`,
    Utils.isValidId,
    UserACL.is(`logged`),
    TeamCtrl.accept
  );
  router.post(
    `/team/:id/decline`,
    Utils.isValidId,
    UserACL.is(`logged`),
    TeamCtrl.decline
  );
  router.get(`/team/:id`, Utils.isValidId, TeamCtrl.getById);

  // contests
  router.get(`/contest/list/:type`, ContestListCtrl.getList);
  router.get(`/contest/:id/metadata`, Utils.isValidId, ContestCtrl.getMetadata);
  router.get(`/contest/:id/events`, Utils.isValidId, ContestCtrl.getEvents);
  router.get(
    `/contest/:id/submissions`,
    Utils.isValidId,
    UserACL.is(`logged`),
    SubmissionCtrl.getRepContestSubmissions
  );
  router.get(
    `/contest/:id/rep/:rid/problem/:pid`,
    Utils.isValidId,
    UserACL.is(`logged`),
    SubmissionCtrl.getRepProblemSubmissions
  );
  router.get(
    `/contest/:id/team/:teamId/users`,
    Utils.isValidId,
    UserACL.is(`logged`),
    TeamCtrl.getTeamMembersInContest
  );
  router.post(
    `/contest/:id/join`,
    Utils.isValidId,
    UserACL.is(`logged`),
    ContestCtrl.join
  );
  router.post(
    `/contest/:id/leave`,
    Utils.isValidId,
    UserACL.is(`logged`),
    ContestCtrl.leave
  );
  router.post(
    `/contest/:id/submit`,
    Utils.isValidId,
    UserACL.is(`logged`),
    SubmissionCtrl.tryExtractFile,
    SubmissionCtrl.submit
  );
  router.post(
    `/contest/:id/edit`,
    Utils.isValidId,
    UserACL.is(`logged`),
    Recaptcha.check,
    ContestCtrl.validateContest,
    ContestCtrl.createOrEdit
  );
  router.post(
    `/contest/create`,
    UserACL.is(`logged`),
    Recaptcha.check,
    ContestCtrl.validateContest,
    ContestCtrl.createOrEdit
  );

  // problems
  router.post(`/problems/find/:query`, ProblemsCtrl.searchProblems);
  router.get(`/problems/:id`, Utils.isValidId, ProblemsCtrl.get);

  return router;
}

function OpenRoutes() {
  let indexFile = `index.html`;
  if (process.env.NODE_ENV === `development`) {
    indexFile = `_index.html`;
  }
  const router = express.Router();
  router.get(`/`, (req: any, res: any) =>
    res.sendFile(indexFile, {
      root: path.join(__dirname, `../public/`),
    })
  );
  router.get(`*`, (req: any, res: any) => {
    res.redirect(`/`);
  });
  return router;
}

function AdminRoutes() {
  const router = express.Router();
  // router.use(UserACL.is("admin"));
  router.use(`/queue`, kue.app);
  return router;
}

export const configure = (app: any) => {
  const cookieSecret = `ub8yi3959nMtGYT52MJcMyepDF1vzd5q`;
  app.use(cookieParser());
  app.use(cookieSession({ secret: cookieSecret, maxAge: 24 * 60 * 60 * 1000 }));
  app.use(compression());
  app.use(favicon(path.join(__dirname, `../public/imgs/favicon.ico`)));
  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: `application/vnd.api+json` }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(expressValidator());
  app.use(methodOverride(`X-HTTP-Method-Override`));
  app.use(express.static(`${__dirname}/../public`));
  app.use(
    cors({
      credentials: true,
      origin:
        process.env.NODE_ENV === `development`
          ? `http://localhost`
          : `https://www.codepit.io`,
    })
  );
  // www.codepit.io
  configurePassport(passport); // pass passport for configuration
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(CookieSlider.middleware());
  app.use(`/admin`, AdminRoutes());
  app.use(`/admin/mongo`, mongoExpress(mongoExpressConfig));
  app.use(`/api/`, APIRoutes());
  app.use(OpenRoutes());
};
