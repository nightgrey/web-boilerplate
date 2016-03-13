import nconf from 'nconf';

/**
 * Paths
 */
nconf.defaults({
  paths: {
    javascript: {
      src: 'src/javascript/**/*.js'
      dist: 'dist/main.js'
    },
    images: {
      src: 'src/images/**/*',
      dist: 'dist/images/'
    }
  }
});

export default nconf;
