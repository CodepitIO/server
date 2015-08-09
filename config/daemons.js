module.exports = function() {
  var child = require('child_process').fork(
    'server',
    {
      cwd: './judger'
    }
  );
}
