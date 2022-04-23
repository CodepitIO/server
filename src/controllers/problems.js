const async = require(`async`);
const fs = require(`fs`);
const path = require(`path`);
const pindexer = require(`cpio-pindexer`);
const _ = require(`lodash`);
const { CronJob } = require(`cron`);

const Problem = require(`../../common/models/problem`);

const INDEX_PROBLEMS_CRON = `00 00 04 * * *`;
const INDEX_PROBLEMS_TZ = `America/Recife`;

const problems = {};

function runProblemsIndexer() {
  pindexer.setReturnSize(10);
  async.waterfall(
    [
      (next) => {
        Problem.find({}, next);
      },
      (_problems, next) => {
        async.eachSeries(
          _problems,
          (item, callback) => {
            if (!problems[item._id] && item.imported) {
              problems[item._id] = true;
              pindexer.addProblem(item);
            }
            return async.setImmediate(callback);
          },
          next
        );
      },
    ],
    () => {
      console.log(`Finished indexing problems.`);
    }
  );
}

const job = new CronJob({
  cronTime: INDEX_PROBLEMS_CRON,
  onTick: runProblemsIndexer,
  timeZone: INDEX_PROBLEMS_TZ,
  runOnInit: true,
});
job.start();

exports.searchProblems = (req, res) => {
  const substr = req.params.query;
  const insertedProblems = req.body.problems || [];
  if (!_.isString(substr) || !_.isArray(insertedProblems))
    return res.sendStatus(400);
  if (substr.length < 3 || substr.length > 50 || insertedProblems.length > 26)
    return res.sendStatus(400);
  const result = pindexer.match(substr, insertedProblems);
  return res.json({
    list: result,
  });
};

exports.get = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await Problem.findById(id).select(
      `name oj id url originalUrl source timelimit memorylimit inputFile outputFile imported isPdf`
    );
    if (!problem) {
      return res.sendStatus(404);
    }
    return res.json(problem);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

exports.isIndexed = (array) => {
  if (!_.isArray(array)) return false;
  for (let i = 0; i < array.length; i++) {
    const id = array[i];
    if (_.isString(id) && !problems[id]) return false;
  }
  return true;
};
