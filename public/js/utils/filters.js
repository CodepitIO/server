var app = angular.module('General')

app.filter('formatTime', [function () {
  return function (seconds, trailingZero) {
    var str = ''
    var suffix = ''
    if (seconds < 0) {
      seconds = -seconds
      suffix = ' para começar'
    }
    var h = Math.floor(seconds / 60 / 60)
    var m = Math.floor(seconds / 60) % 60
    var s = seconds % 60
    if (h > 0) {
      str = h + 'hr'
      if (trailingZero !== false || m > 0) {
        str = h + 'hr e ' + m + 'min'
      }
    } else if (m >= 10) str = m + 'min'
    else if (m > 0) str = m + 'min e ' + s + 'seg'
    else str = s + 'seg'
    return str + suffix
  }
}])

app.filter('formatDuration', [function () {
  return function (minutes, noTrailingZero) {
    minutes = Math.round(minutes)
    var d = Math.floor(minutes / 1440)
    minutes -= d * 1440
    var h = Math.floor(minutes / 60)
    minutes -= h * 60
    var m = minutes

    var arr = []
    if (d > 0) arr.push(d + 'd')
    if (h > 0) arr.push(h + 'hr')
    if (m > 0 || arr.length === 0) arr.push(m + 'min')

    if (arr.length === 1) return arr[0]
    return _.join([_.join(_.initial(arr), ', '), _.last(arr)], ' e ')
  }
}])

app.filter('mrtProblemSubmitName', [function () {
  return function (problem, index) {
    return '(' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[index] + ') ' + problem.name
  }
}])

app.filter('mrtTimezoneStrap', function () {
  var regex = /^(Z|[+-])(2[0-3]|[01][0-9]):([0-5][0-9])$/
  return function (text) {
    if (typeof (text) !== 'string' || text.length === 0) {
      return ''
    }
    var arr = text.match(regex)
    return arr[1] + parseInt(arr[2], 10) + (arr[3] == '00' ? '' : arr[3])
  }
})

app.filter('mrtHasError', function () {
  return function (obj) {
    return obj.$dirty && !_.isEmpty(obj.$error)
  }
})

app.filter('mrtAlphabetize', function () {
  return function (index) {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[index]
  }
})

app.filter('mrtOjName', ['OJName', function (OJName) {
  return function (oj) {
    return OJName[oj]
  }
}])

app.filter('mrtFilterTime', [
  'amUtcFilter',
  'amLocalFilter',
  'amDateFormatFilter',
  'mrtTimezoneStrapFilter',
  function (amUtcFilter, amLocalFilter, amDateFormatFilter, mrtTimezoneStrapFilter) {
    return function(date) {
      date = new Date(date)
      var time = amUtcFilter(date)
      time = amLocalFilter(time)
      time = amDateFormatFilter(time, 'ddd, D/MMM/YYYY, HH:mm')

      var timeZone = amDateFormatFilter(date, 'Z')
      timeZone = mrtTimezoneStrapFilter(timeZone)

      var link = '<a target="_blank" href="http://www.timeanddate.com/worldclock/fixedtime.html?day=' + date.getUTCDate() + '&month=' + (date.getUTCMonth()+1) + '&year=' + date.getUTCFullYear() + '&hour=' + date.getUTCHours() + '&min=' + date.getUTCMinutes() + '&sec=' + date.getUTCSeconds() + '">' + time + ' <sup>UTC' + timeZone + '</sup></a>'
      return link
    }
  }
])
