module.exports = function (grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-browserify');
		grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.initConfig({
        browserify: {
            'dev': {
                'src': './index.js',
                'dest': 'app/js/bundle.js',
                'options': {
                    'debug': true,
                    'watch': true,
                    'verbose': true,
                    'open': true
                }
            },
            'release': {
                'src': './index.js',
                'dest': 'app/js/bundle.js',
                'options': {
                    'debug': false,
                    'verbose': false
                }
            }
        },
				cssmin: {
  				options: {
    				shorthandCompacting: false,
    				roundingPrecision: -1
  				},
  				target: {
    				files: {
      				'app/output.css': ['app/styles/*.css', 'main.css']
    				}
  				}
				},
        connect: {
            'devServer': {
                'options': {
                    'base': 'app/',
                    'keepalive': true
                }
            }
        }
    });
    grunt.registerTask('default', [
        'browserify:dev',
			  'cssmin',
        'connect'
    ]);
    grunt.registerTask('release', ['browserify:release']);
};