/*jslint node: true */
"use strict";

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		nodemon: {
			dev: {
				script: 'server.js'
			}
		},

		uglify: {
			dist: {
				files: {
					'public/dist/app.min.js': ['public/dist/app.min.js']
				},
				options: {
					mangle: true
				}
			}
		},

		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			dist: {
				files: {
					'public/dist/app.min.css': ['public/css/*.css']
				}
			}
		},

		html2js: {
			dist: {
				src: ['public/views/**/*.html'],
				dest: 'tmp/templates.js'
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

		clean: {
			temp: {
				src: ['tmp']
			},
			dottemp: {
				src: ['.tmp']
			},
			dist: {
				src: ['public/dist']
			},
			fonts: {
				src: ['public/fonts']
			}
		},

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['public/js/**/*.js', 'tmp/*.js'],
				dest: 'public/dist/app.min.js'
			},
		},

		jshint: {
			all: ['Gruntfile.js', 'public/js/**/*.js']
		},

		watch: {
			dev: {
				files: ['Gruntfile.js', 'public/js/**/*.js', 'public/css/*.css', 'public/views/**/*.html', 'public/_index.html'],
				tasks: [
					'jshint',
					'html2js:dist',
					'concat:dist',
					'clean:temp',
					'uglify:dist',
					'cssmin:dist',
					'clean:dottemp',
					'copy:index',
					'useminPrepare',
					'usemin',
				],
				options: {
					atBegin: false
				}
			}
		},

		jsbeautifier: {
			files: ["public/js/**/*.js", "Gruntfile.js"],
			options: {
				js: {
					braceStyle: "collapse",
					breakChainedMethods: false,
					e4x: false,
					evalCode: false,
					indentChar: " ",
					indentLevel: 0,
					indentSize: 2,
					indentWithTabs: true,
					jslintHappy: false,
					keepArrayIndentation: false,
					keepFunctionIndentation: false,
					maxPreserveNewlines: 10,
					preserveNewlines: true,
					spaceBeforeConditional: true,
					spaceInParen: false,
					unescapeStrings: false,
					wrapLineLength: 0,
					endWithNewline: true
				}
			}
		},

		express: {
			options: {
				background: true,
				port: 3000,
			},
			dev: {
				options: {
					script: 'server.js'
				}
			},
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
					dest: 'public/fonts',
				}, ]
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("grunt-jsbeautifier");
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-nodemon');

	grunt.registerTask('test', [
		'html2js:dist',
	]);
	grunt.registerTask('build', [
		'clean:fonts',
		'copy:index',
		'useminPrepare',
		'concat:generated',
		'cssmin:generated',
		'copy:fonts',
		'uglify:generated',
		'usemin',
		'clean:dottemp',
	]);
	grunt.registerTask('htmlfix', [
		'copy:index',
		'useminPrepare',
		'usemin',
	]);
	grunt.registerTask('min', [
		'clean:dist',
		'jsbeautifier',
		'jshint',
		'html2js:dist',
		'concat:dist',
		'clean:temp',
		'uglify:dist',
		'cssmin:dist',
		//'express:dev',
		//'watch:dev'
	]);
	grunt.registerTask('all', [
		'clean:dist',
		'jsbeautifier',
		'jshint',
		'html2js:dist',
		'concat:dist',
		'clean:temp',
		'uglify:dist',
		'cssmin:dist',
		'clean:fonts',
		'copy:index',
		'useminPrepare',
		'concat:generated',
		'cssmin:generated',
		'copy:fonts',
		'uglify:generated',
		'usemin',
		'clean:dottemp',
		//'nodemon:dev',
		//'watch:dev'
	]);
};
