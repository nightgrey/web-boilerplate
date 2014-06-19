module.exports = function(grunt) {
	/*
	 * Project configuration
	 */
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			files: {
				src: ['js/plugins.js', 'js/main.js'],
				dest: 'tmp/main.js'
			}
		},
		uglify: {
			dist: {
				options: {
				},
				files: {
					src: 'tmp/main.js',
					dest: 'js/main.min.js'
				}
			}
		},
		sass: {
			dist: {
				options: {
					style: 'expanded',
					precision: 3,
					trace: true
				},
				files: {
					'tmp/style.css': 'scss/style.scss'
				}
			},
		},
		cssmin: {
			dist: {
				options: {
					keepSpecialComments: 0
				},
				files: {
					'css/style.css': 'tmp/style.css'
				}
			}
		},
		clean: ['tmp']
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Tasks
	grunt.registerTask('default', ['concat', 'uglify', 'sass', 'cssmin', 'clean']);
}