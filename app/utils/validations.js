var titleCase = function(input) {
  input = input || '';
  return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var isBlacklisted = function(value) {
  var invalids = ":god,:gm,:admin,:adm,:tutor,:gamemaster,:owner,fuck,penis,bicha,viado,vagina";
  var blacklist = invalids.split(',');

  value = value.toLowerCase();

  for (var i in blacklist) {
    if (blacklist[i][0] == ':') {
      var txt = blacklist[i].substring(1);
      var x = value.indexOf(txt);

      var vl = value.length;
      var tl = txt.length;
      if ((x == 0 && (vl == tl || value[tl] == ' ')) ||
          (x > 0 && value[x-1] == ' ' && (vl == x+tl || value[x+tl] == ' '))) {
        return true;
      }
    } else {
      if (value.indexOf(blacklist[i]) != -1) {
        return true;
      }
    }
  }
  return false;
}

var isSeparator = function(c) {
  return c == "'" || c == "-";
}

var isWellFormatted = function(value) {
  var val = value;
  if (isSeparator(value[value.length-1])) {
    return false;
  }
  for (var i = 0; i < value.length-1; i++) {
    if (isSeparator(value[i])) {
      if (isSeparator(value[i+1]) || value[i+1] == " ") {
        return false;
      } else if (i == 0 || value[i-1] == " ") {
        return false;
      }
    }
  }
  return true;
}

exports.isGoodName = function(value) {
  value = titleCase(value);
  if (value.length < 2 || value.length > 18) return false;
  var patt = /^[a-zA-Z\s'-]*$/;
  if (!value.match(patt)) return false;
  if (isBlacklisted(value)) return false;
  if (!isWellFormatted(value)) return false;
  return true;
}
