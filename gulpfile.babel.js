import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import runSequence from 'run-sequence';
import webpackConfiguration from './webpack.config.babel';

/**
 * Constants
 */
const plugin = gulpLoadPlugins();


/**
 * Clean temp and output directory
 */
gulp.task('clean', () => del(['dist/*'], {dot: true}));


/**
 * Run webpack
 */
gulp.task('webpack', (callback) => {
  webpack(webpackConfiguration(false)).run((fatalError, stats) => {
    const jsonStats = stats.toJson();

    // To save the JSON statistics, uncomment the two lines below.
    // These JSON statistics can be analyzed by:
    // * http://webpack.github.io/analyse
    // * https://github.com/robertknight/webpack-bundle-size-analyzer.

    // const fs = require('fs');
    // fs.writeFileSync('./bundle-stats.json', JSON.stringify(jsonStats));

    const buildError = fatalError || jsonStats.errors[0] || jsonStats.warnings[0];

    if (buildError) {
      throw new plugin.util.PluginError('webpack', buildError);
    }

    plugin.util.log('[webpack]', stats.toString({
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }));

    callback();
  });
});


/**
 * Run webpack (watch)
 */
gulp.task('webpack:watch', (callback) => {
  const server = new WebpackDevServer(webpack(webpackConfiguration(true)), {
    contentBase: './dist',
    hot: true
  });

  server.listen(8080, 'localhost', callback());
});


/**
 * Build
 */
gulp.task('build', () => runSequence('clean', 'webpack'));


/**
 * Build (watch)
 */
gulp.task('build:watch', () => runSequence('clean', 'webpack:watch'));


/**
 * Default
 */
gulp.task('default', ['build']);
