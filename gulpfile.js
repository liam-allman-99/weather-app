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
const path = require('path');

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
    src: '*.html' // Assuming HTML files are in the root directory
  }
};

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

function scripts() {
  return browserify({
      entries: ['./js/src/global.js'], // Entry file(s)
      debug: true // Generate source maps
    })
    .transform('babelify', { presets: ['@babel/preset-env'] }) // Transform ES6 code to ES5
    .bundle() // Bundle all files
    .pipe(source('global.min.js')) // Convert bundle stream to vinyl stream
    .pipe(buffer()) // Convert to buffered vinyl stream for sourcemaps
    .pipe(sourcemaps.init({ loadMaps: true })) // Initialize sourcemaps
    .pipe(uglify()) // Minify JavaScript
    .pipe(sourcemaps.write('./')) // Write sourcemaps
    .pipe(gulp.dest(paths.scripts.dest)); // Output destination
}

function html() {
  return gulp.src(paths.html.src);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './', // Serve files from the root directory
      index: 'index.html' // Use index.html as the default file
    },
    port: 3000 // Proxy port
  });

  gulp.watch(paths.scripts.src, gulp.series(scripts, reload)); // Watch for changes in JS files
  gulp.watch(paths.styles.src, gulp.series(styles, reload)); // Watch for changes in SCSS files
  gulp.watch(paths.html.src, gulp.series(html, reload)); // Watch for changes in HTML files
}

function reload(done) {
  browserSync.reload(); // Reload the browser
  done(); // Signal completion
}

const build = gulp.parallel(styles, scripts);

exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.serve = gulp.series(build, serve);
exports.default = exports.serve;