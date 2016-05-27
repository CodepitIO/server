$(document).click(function (e) {
  var elem = $('.popover-inner').parent()
  if ($(e.target).is('.join-contest-icon')) {
    if (elem.hasClass('in')) {
      elem.removeClass('in')
    }
  } else if ( (elem.has(e.target).length === 0)) {
    elem.removeClass('in')
  }
})
