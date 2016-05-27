var app = angular.module('Util')

app.directive('mrtPdf', ['$window', function ($window) {
  PDFJS.disableWorker = true
  var renderTask = null
  var pdfLoaderTask = null
  var PX_TO_PT = 72.0 / 96.0

  return {
    restrict: 'E',
    templateUrl: function (element, attr) {
      return 'views/misc/pdf-viewer.html'
    },
    link: function (scope, element, attrs) {
      element.css('display', 'block')
      var pdfDoc = null
      var page = null
      var pdfPageView = null

      var url = null
      var pageToDisplay = attrs.page || 1
      var containerid = attrs.containerid
      var container = document.getElementById(containerid)
      var windowEl = angular.element($window)

      windowEl.on('resize.doResize', _.throttle(function () {
        renderPage(page)
      }, 500))

      scope.$on('$destroy', function () {
        windowEl.off('resize.doResize')
      })

      function getScaleToFit () {
        var viewport = page.getViewport(1)
        var clientRect = element[0].getBoundingClientRect()
        return Math.max(1.0, clientRect.width / viewport.width * PX_TO_PT)
      }

      function drawPage () {
        $(container).children().remove()

        var scale = getScaleToFit()
        var viewport = page.getViewport(scale)

        pdfPageView = new PDFJS.PDFPageView({
          container: container,
          id: pageToDisplay,
          scale: scale,
          defaultViewport: page.getViewport(scale),
          textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
          annotationLayerFactory: new PDFJS.DefaultAnnotationLayerFactory()
        })
        pdfPageView.setPdfPage(page)
        return pdfPageView.draw()
      }

      function renderPage (update) {
        if (renderTask) {
          renderTask._internalRenderTask.cancel()
        }

        if (update) {
          return drawPage()
        }

        pdfDoc.getPage(pageToDisplay).then(function (_page) {
          page = _page
          drawPage()
        })
      }

      function renderPDF () {
        var params = {
          'url': url
        }

        if (url && url.length) {
          pdfLoaderTask = PDFJS.getDocument(params)
          pdfLoaderTask.then(
            function (_pdfDoc) {
              pdfDoc = _pdfDoc
              renderPage()
            }
          )
        }
      }

      function start (newVal) {
        if (newVal !== '') {
          url = newVal
          if (pdfLoaderTask) {
            pdfLoaderTask.destroy().then(function () {
              renderPDF()
            })
          } else {
            renderPDF()
          }
        }
      }
      start(attrs.url)
    }
  }
}])
