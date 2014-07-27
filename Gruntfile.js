module.exports = function(grunt) {

	grunt.initConfig({
		// Configuration
		pkg: grunt.file.readJSON('package.json'),
		banner: {
			default: '/*\n * <%= pkg.name %> v<%= pkg.version %>\n * <%= grunt.template.today("dd.mm.yyyy, HH:MM:ss") %>\n */\n'
		},

		useminPrepare: {
			options: {
				dest: 'dist/js'
			},
			html: 'index.html'
		},

		sass: {
			options: {
				style: 'compressed'
			},
			files: {
				'css/styles.css': 'sass/styles.scss'
			}
		},

		copy: {
			dist: {
				files: [
					{src: 'index.html', dest: 'dist/index.html'},
					{src: 'css/styles.css', dest: 'dist/css/styles.css'}
				]
			}
		},

		usemin: {
			html: ['dist/index.html']
		}
	});

	// Load plugins
	require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);

	// Tasks
	grunt.registerTask('default', [
		'sass:dev'
	]);

	grunt.registerTask('build', [
		'useminPrepare',
		'sass',
		'copy',
		'concat',
		'uglify',
		'usemin'
	]);
}