var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var through2 = require('through2');

function encodeUri(string) {
  return 'javascript:void' + string.replace(/\{/g, '%7B')
    .replace(/\}/g, '%7D').replace(/[\n ]/g, '');
}

function streamEncodeUri() {
  var data = '';
  return through2(function (chunk, enc, callback) {
    data += chunk;
    callback();
  }, function (callback) {
    this.push(encodeUri(data));
    callback();
  });
}

function gulpEncodeUri() {
  var data = '';
  return through2.obj(function (file, enc, callback) {
    if (!file.isNull()) {
      if (file.isBuffer()) {
        file.contents = new Buffer(encodeUri(file.contents.toString()));
      }
      if (file.isStream()) {
        file.contents = file.contents.pipe(streamEncodeUri());
      }
    }
    callback(null, file);
  });
}

gulp.task('build-snippet', function () {
  return gulp.src('./bookmarklet/snippet.js')
    .on('error', function (error) {
      console.error(error);
    })
    .pipe(gulpEncodeUri())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-js', function () {
  return gulp.src('./bookmarklet/projectlet.js')
    .on('error', function (error) {
      console.error(error);
    })
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-lib', function () {
  return gulp.src([
    './bower_components/underscore/underscore.js',
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/backbone/backbone.js',
  ]).pipe(concat('lib.min.js'))
  .pipe(gulp.dest('./extension'))
  .pipe(gulp.dest('./dist'));
});

gulp.task('build-conflate', ['build-js', 'build-lib'], function () {
  return gulp.src(['./dist/lib.min.js', './dist/projectlet.min.js'])
    .pipe(concat('projectlet.bundle.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  return gulp.watch('./bookmarklet/*.js', ['build-conflate', 'build-snippet']);
});

gulp.task('default', ['build-conflate', 'build-snippet', 'watch']);

