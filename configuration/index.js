import nconf from 'nconf';

/**
 * Paths
 */
nconf.defaults({
  paths: {
    root: {
      source: 'src',
      dist: 'dist'
    },
    styles: {
      src: [
        'src/styles/**/*.scss',
        'src/styles/**/*.css'
      ],
      tmp: '.tmp/styles'
    },
    lint: {
      javascript: 'src/javascript/**/*.js'
    },
    javascriptMain: {
      src: 'src/javascript/index.js',
      tmp: '.tmp/javascript',
      dist: 'dist/main.js'
    },
    html: {
      src: 'src/templates/*.ejs'
    },
    images: {
      src: 'src/images/**/*',
      dist: 'dist/images/'
    }
  }
});

export default nconf;
