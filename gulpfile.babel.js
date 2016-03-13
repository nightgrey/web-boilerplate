import browserSync from 'browser-sync';
import del from 'del';
import gulp from 'gulp';
import path from 'path';
import plugin from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import sassModuleImporter from 'sass-module-importer';
import configuration from 'configuration';

/**
 * Lint (JavaScript)
 *
 * ESLint
 */
gulp.task('lint:javascript', () => {
  gulp.src(configuration.javascript.src)
    .pipe(plugin.eslint())
    .pipe(plugin.eslint.format())
    .pipe(plugin.if(!browserSync.active, plugin.eslint.failOnError()))
});


/**
 * Optimize Images
 *
 * Imagemin
 */
gulp.task('images', () =>
  gulp.src(configuration.images.src)
    .pipe(plugin.cache(plugin.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(configuration.images.dist))
    .pipe(plugin.size({title: 'images'}))
);


/**
 * Copy root-level files
 */
gulp.task('copy', () =>
  gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe(plugin.size({title: 'copy'}))
);


/**
 * Styles
 *
 * Sass
 * Source maps
 * cssnano
 */
gulp.task('styles', () => {
  // For better performance, don't add Sass partials to `gulp.src`
  return gulp.src([
      'src/styles/**/*.scss',
      'src/styles/**/*.css'
    ])
    .pipe(plugin.newer('.tmp/styles'))
    .pipe(plugin.sourcemaps.init())
    .pipe(plugin.sass({
      precision: 10,
      importer: sassModuleImporter()
    }).on('error', plugin.util.log))
    .pipe(plugin.autoprefixer([
      'ie >= 10',
      'ie_mob >= 10',
      'ff >= 30',
      'chrome >= 34',
      'safari >= 7',
      'opera >= 23',
      'ios >= 7',
      'android >= 4.4',
      'bb >= 10'
    ]))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(plugin.if('*.css', plugin.cssnano()))
    .pipe(plugin.size({title: 'styles'}))
    .pipe(plugin.sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

/**
 * JavaScript (main)
 *
 * Babel
 * Source maps
 * Uglify
 */
gulp.task('javascript:main', () =>
  gulp.src([
      './src/javascript/index.js'
    ])
    .pipe(plugin.newer('.tmp/javascript'))
    .pipe(plugin.sourcemaps.init())
    .pipe(plugin.babel())
    .pipe(plugin.sourcemaps.write())
    .pipe(gulp.dest('.tmp/javascript'))
    .pipe(plugin.concat('main.js'))
    .pipe(plugin.uglify({preserveComments: 'some'}))
    .pipe(plugin.size({title: 'javascript'}))
    .pipe(plugin.sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
);


/**
 * HTML
 *
 * EJS -> HTML conversion
 * Minifying
 * Use reference
 */
gulp.task('html', () => {
  return gulp.src('src/templates/*.ejs')
    .pipe(plugin.ejs().on('error', plugin.util.log))
    //.pipe(plugin.useref({searchPath: '{.tmp,app}'}))
    //// Remove any unused CSS
    //.pipe(plugin.if('*.css', plugin.uncss({
    //  html: [
    //    'app/index.html'
    //  ],
    //  // CSS Selectors for UnCSS to ignore
    //  ignore: []
    //})))

    // Concatenate and minify styles
    // In case you are still using useref build blocks
    //.pipe(plugin.if('*.css', plugin.cssnano()))

    // Minify any HTML
    .pipe(plugin.if('*.html', plugin.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    })))
    // Output files
    .pipe(plugin.if('*.html', plugin.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('dist'));
});


/**
 * Clean temp and output directory
 */
gulp.task('clean', () => {
  return del(['.tmp', 'dist/*', '!dist/.git'], {dot: true})
});


/**
 * Watch files for changes and reload
 */
gulp.task('serve', ['javascript:main', 'styles'], () => {
  browserSync({
    notify: false,
    scrollElementMapping: ['.page__main'],
    server: {
      baseDir: 'dist'
    },
    port: 3000
  });

  gulp.watch(['src/**/*.html'], browserSync.reload);
  gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', browserSync.reload]);
  gulp.watch(['app/scripts/**/*.js'], ['lint', 'scripts']);
  gulp.watch(['app/images/**/*'], browserSync.reload);
});
