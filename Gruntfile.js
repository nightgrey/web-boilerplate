module.exports = function(grunt) {

	// Load plugins
	require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		// Configuration
		pkg: grunt.file.readJSON('package.json'),
		dirs: {
			js: 'js',
			scss: 'scss',
			css: 'css',
			img: 'img',
			dist: 'dist',
			tmp: '.tmp'
		},
		banner: {
			default: '/*\n * <%= pkg.name %> v<%= pkg.version %>\n * <%= grunt.template.today("dd.mm.yyyy, HH:MM:ss") %>\n */\n'
		},

		useminPrepare: {
			options: {
				dest: '<%= dirs.dist %>/<%= dirs.js %>'
			},
			html: 'index.html'
		},

		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'<%= dirs.css %>/styles.css': '<%= dirs.scss %>/styles.scss'
				}
			}
		},

		cssmin: {
			dist: {
				options: {
					keepSpecialComments: 0
				},
				files: {
				'<%= dirs.css %>/styles.css': ['<%= dirs.css %>/styles.css']
				}
			}
		},

		favicons: {
			options: {
				trueColor: true,
				appleTouchPadding: 0,
				androidHomescreen: true,
				// windowsTiles: true is generating a bunch of blank files - needs to be fixed
				windowsTile: false
			},
			icons: {
				src: '<%= dirs.img %>/grunt-favicon.png',
				dest: '.'
			}
		},

		copy: {
			build: {
				files: [
					{src: 'index.html', dest: '<%= dirs.dist %>/index.html'},
					{src: '<%= dirs.css %>/styles.css', dest: '<%= dirs.dist %>/<%= dirs.css %>/styles.css'},
					{src: '<%= dirs.img %>', dest: '<%= dirs.dist %>/<%= dirs.img %>'},
					{src: ['./*.png', '*.ico'], dest: '<%= dirs.dist %>/'}
				]
			}
		},

		usemin: {
			html: ['<%= dirs.dist %>/index.html']
		},

		clean: {
			build: ['.tmp', ['./*.png', './*.ico']]
		},

		watch: {
			styles: {
				files: ['<%= dirs.scss %>/**/*'],
				tasks: ['watch-styles']
			},
			favicons: {
				files: ['<%= dirs.img/grunt-favicon.png'],
				tasks: ['watch-favicons']
			}
		}
	});

	// Tasks
	grunt.registerTask('default', [
		'sass',
		'cssmin',
	]);

	grunt.registerTask('build', [
		'useminPrepare',
		'sass',
		'cssmin',
		'favicons',
		'copy:build',
		'concat:generated',
		'uglify:generated',
		'usemin',
		'clean:build'
	]);

	// Watch tasks
	grunt.registerTask('dev', [
		'watch'
	]);

	grunt.registerTask('watch-styles', [
		'sass'
	]);

	grunt.registerTask('watch-favicons', [
		'favicons'
	]);
}