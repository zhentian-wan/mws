const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minifyCss = require('gulp-minify-css');
const runSequence = require('run-sequence');
const del = require('del');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const responsive = require('gulp-responsive');
const inlineStyle = require('gulp-inline-style');
const gConfig = require('./gulp.config.js');
const workbox = require('workbox-build');

//Default task
gulp.task('default', function(callback) {
  runSequence('start', ['watch'], callback);
});

gulp.task('start', function(callback) {
  runSequence(
    'clean',
    'copy-build',
    'inline-css',
    'sw',
    callback
  ); //run clean first, then copy-build
});

gulp.task('clean', function(callback) {
  return del([gConfig.build.dir], { force: true }, callback);
});

gulp.task('copy-build', ['html', 'styles', 'libs', 'images', 'assets', 'scripts', 'sw-copy']);

gulp.task('images', function() {
  return gulp
    .src('img_src/*.{jpg,png}')
    .pipe(
      responsive(
        {
          // Resize all JPG images to three different sizes: 200, 500, and 630 pixels
          '*': [
            {
              width: 320,
              rename: { suffix: '-320_small' }
            },
            {
              width: 640,
              rename: { suffix: '-640_medium' }
            },
            {
              // Compress, strip metadata, and rename original image
              rename: { suffix: '-800_large' }
            },
            {
              width: 320,
              rename: { suffix: '-320_small', extname: '.webp' }
            },
            {
              width: 640,
              rename: { suffix: '-640_medium', extname: '.webp' }
            },
            {
              // Compress, strip metadata, and rename original image
              rename: { suffix: '-800_large', extname: '.webp' }
            }
          ]
        },
        {
          // Global configuration for all images
          // The output quality for JPEG, WebP and TIFF output formats
          quality: 70,
          // Use progressive (interlace) scan for JPEG and PNG output
          progressive: true,
          // Strip all metadata
          withMetadata: false
        }
      )
    )
    .pipe(gulp.dest('dist/img'));
});

gulp.task('assets', () => {
  gulp.src(gConfig.app_file.assets)
    .pipe(gulp.dest(gConfig.build.assets))
});

gulp.task('html', function() {
  gulp
    .src(gConfig.app_file.html_src)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('inline-css', function() {
  return gulp
    .src(gConfig.build.dir + '/*.html')
    .pipe(inlineStyle('dist'))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
  gulp
    .src(gConfig.app_file.scss_src)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(minifyCss())
    .pipe(gulp.dest(gConfig.build.build_css));
});

gulp.task('lint', () => {
  return gulp
    .src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('scripts', function() {
  gulp
    .src(gConfig.app_file.js_src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['env']
      })
    )
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(gConfig.build.build_js));
});

gulp.task('libs', function() {
  gulp
    .src(gConfig.app_file.libs)
    .pipe(plumber())
    .pipe(concat('vender.js'))
    .pipe(uglify())
    .pipe(gulp.dest(gConfig.build.build_libs));
});

gulp.task('sw-copy', () => {
  gulp.src('manifest.json').pipe(gulp.dest(gConfig.build.dir));
})

gulp.task('sw', () => {
  return workbox.injectManifest({
    globDirectory: `${gConfig.build.dir}`,
    globPatterns: ['**/*.{html,js,css,json,png}'],
    swDest: `dist/sw.js`,
    swSrc: 'src-sw.js'
  });
});


gulp.task('watch', function() {
  gulp.watch(gConfig.app_file.img_src, ['images', 'sw']);
  gulp.watch(gConfig.app_file.html_src, ['html', 'sw']);
  gulp.watch(gConfig.app_file.scss_src, ['styles', 'inline-css', 'sw']);
  gulp.watch(gConfig.app_file.js_src, ['scripts', 'sw']);
});
