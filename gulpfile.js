const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');

// Sets the paths of the files location and where the .min files should go in the repo
const paths = {
  styles: {
    src: 'scss/src/*.scss',
    dest: 'scss/dist/'
  },
  scripts: {
    src: 'js/src/*.js',
    dest: 'js/dist/'
  },
  html: {
    src: '*.html'
  }
};

// function for compiling the SCSS in global.scss into a global.min.css file
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'global',
      suffix: '.min'
  }))

  .pipe(gulp.dest(paths.styles.dest));
}

// function for compiling the jQuery in global.js into a global.min.js file
function scripts() {
  return browserify({
    // Grabs the directory of the main js file
    entries: ['./js/src/global.js'],
    debug: true
  })

  // Transform ES6 code to ES5
  .transform('babelify', { presets: ['@babel/preset-env'] })
  .bundle()
  .pipe(source('global.min.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  // Minify JavaScript
  .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(paths.scripts.dest));
}

function html() {
  return gulp.src(paths.html.src);
}

// Function to serve files from the root and use the index.html as the default
function serve() {
  browserSync.init({
    server: {
      baseDir: './',
      index: 'index.html'
    },
    port: 3000
  });

  // Watch for changes in JS, SCSS, and HTML files
  gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
  gulp.watch(paths.styles.src, gulp.series(styles, reload));
  gulp.watch(paths.html.src, gulp.series(html, reload));
}

// Reloads browser and signals completion fo the reload
function reload(done) {
  browserSync.reload();
  done();
}

const build = gulp.parallel(styles, scripts);

exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.serve = gulp.series(build, serve);
exports.default = exports.serve;