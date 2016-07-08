/*jslint node: true */
'use strict'

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    nodemon: {
      all: {
        script: 'main.js',
        options: {
          cwd: __dirname,
          args: ['--cache'],
          ignore: ['node_modules/**', 'public/**', '**/*.json', 'Gruntfile.js']
        }
      }
    },

    html2js: {
      prod: {
        src: ['public/views/**/*.html'],
        dest: 'public/dist/templates.js'
      },
      dev: {
        src: [],
        dest: 'public/dist/templates.js'
      },
      options: {
        base: 'public/',
        module: 'mrtApp.templates',
        singleModule: true,
        useStrict: true,
        htmlmin: {
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        }
      }
    },

    filerev: {
      options: {
        algorithm: 'md5',
        length: 6
      },
      prod: {
        src: ['public/dist/*']
      }
    },

    clean: {
      dist: {
        src: ['public/dist']
      },
      fonts: {
        src: ['public/fonts']
      }
    },

    useminPrepare: {
      html: 'public/index.html',
      options: {
        dest: 'public'
      }
    },

    usemin: {
      html: 'public/index.html'
    },

    copy: {
      index: {
        src: 'public/_index.html',
        dest: 'public/index.html'
      },
      fonts: {
        files: [{
          cwd: 'public/bower_components/font-awesome/fonts/',
          expand: true,
          src: ['**/*'],
          dest: 'public/fonts'
        }]
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-html2js')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-filerev')
  grunt.loadNpmTasks('grunt-usemin')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-nodemon')

  grunt.registerTask('prod', [
    'clean:dist',
    'html2js:prod',
    'clean:fonts',
    'copy:fonts',
    'copy:index',
    'useminPrepare',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated',
    'filerev:prod',
    'usemin'
  ])
  grunt.registerTask('dev', [
    'clean:dist',
    'html2js:dev',
    'clean:fonts',
    'copy:fonts',
    'nodemon'
  ])
}
