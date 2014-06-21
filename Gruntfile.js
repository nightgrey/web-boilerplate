module.exports = function(grunt) {
	/*
	 * Project configuration
	 */
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		dirs: {
			js: 'js',
			scss: 'scss',
			css: 'css',
			tmp: 'tmp'
		},
		concat: {
			dist: {
				src: ['<%= dirs.js %>/plugins.js', '<%= dirs.js %>/main.js'],
				dest: '<%= dirs.tmp %>/main.js'
			}
		},
		uglify: {
			dist: {
				options: {
					except: ['jQuery']
				},
				files: {
					'<%= dirs.js %>/main.min.js': ['<%= dirs.tmp %>/main.js']
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
					'<%= dirs.tmp %>/style.css': '<%= dirs.scss %>/style.scss'
				}
			},
		},
		autoprefixer: {
			dist: {
				options: {
					browsers: ['last 2 version']
				},
				src: '<%= dirs.tmp %>/style.css'
			}
		},
		cssmin: {
			dist: {
				options: {
					keepSpecialComments: 0
				},
				files: {
					'<%= dirs.css %>/style.css': '<%= dirs.tmp %>/style.css'
				}
			}
		},
		clean: ['<%= dirs.tmp %>'],
		watch: {
			styles: {
				files: ['<%= dirs.scss %>/*.scss'],
				tasks: ['styles']
			},
			scripts: {
				files: ['<%= dirs.js %>/*.js', '!<%= dirs.js %>/*.min.js'],
				tasks: ['scripts']
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Tasks
	grunt.registerTask('default', ['concat', 'uglify', 'sass', 'autoprefixer', 'cssmin', 'clean']);
	grunt.registerTask('styles', ['sass', 'autoprefixer', 'cssmin', 'clean']);
	grunt.registerTask('scripts', ['concat', 'uglify', 'clean']);
	grunt.registerTask('live', ['watch']);
}