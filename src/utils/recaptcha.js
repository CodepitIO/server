"use strict";

const https = require("https");

let SECRET = process.env.RECAPTCHA_SECRET;

function verifyRecaptcha(key, callback) {
  https.get(
    `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET}&response=${key}`,
    (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk.toString();
      });
      res.on("end", () => {
        try {
          let parsedData = JSON.parse(data);
          if (parsedData.success) return callback();
          else return callback(new Error());
        } catch (e) {
          return callback(e);
        }
      });
    }
  );
}

exports.check = (req, res, next) => {
  if (!SECRET) return next();
  if (!req.body || !req.body.recaptcha) return res.sendStatus(400);
  let recaptcha = req.body.recaptcha;
  verifyRecaptcha(recaptcha, (err) => {
    if (err) return res.sendStatus(400);
    return next();
  });
};
