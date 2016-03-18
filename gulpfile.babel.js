import browserSync from 'browser-sync';
import del from 'del';
import gulp from 'gulp';
import path from 'path';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import sassModuleImporter from 'sass-module-importer';

/**
 * Constants
 */
const plugin = gulpLoadPlugins();


/**
 * Lint (JavaScript)
 *
 * ESLint
 */
gulp.task('lint:javascript', () => {
  gulp.src('src/javascript/**/*.js')
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
  gulp.src('src/images/**/*')
    .pipe(plugin.cache(plugin.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images/'))
    .pipe(plugin.size({title: 'images'}))
);


/**
 * Copy root-level files
 */
gulp.task('copy', () =>
  gulp.src([
    'src/*.*'
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
  return gulp.src('src/styles/index.scss')
    .pipe(plugin.rename('main.scss'))
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
    .pipe(plugin.rename(path => {
      path.extname = '.html'
    }))
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
  gulp.watch(['src/styles/**/*.{scss,css}'], ['styles', browserSync.reload]);
  gulp.watch(['src/javascript/**/*.js'], ['lint', 'scripts']);
  gulp.watch(['src/images/**/*'], browserSync.reload);
});


/**
 * Default
 */
gulp.task('default', ['clean'], cb =>
  runSequence(
    'styles',
    ['lint:javascript', 'html', 'javascript:main', 'images', 'copy'],
    cb
  )
);
