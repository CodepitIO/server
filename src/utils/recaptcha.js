const https = require('https')

let SECRET = process.env.RECAPTCHA_SECRET

function verifyRecaptcha(key, callback) {
  https.get(`www.google.com/recaptcha/api/siteverify?secret=${SECRET}&response=${key}`, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk.toString();
    });
    res.on('end', () => {
      try {
        let parsedData = JSON.parse(data);
        return callback();
      } catch (e) {
        return callback(e);
      }
    });
  });
}

exports.middleware = function() {
  return (req, res, next) => {
    if (!SECRET) return next()
    if (!req.body || !req.body.recaptcha) return next()
    let recaptcha = req.body.recaptcha
    verifyRecaptcha(req.body.recaptcha, (err) => {
      if (err) return res.status(400).send()
      return next()
    })
  }
}
