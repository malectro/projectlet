var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var through2 = require('through2');

function streamEncodeUri() {
  var data = '';
  return through2(function (chunk, enc, callback) {
    data += chunk;
    callback();
  }, function (callback) {
    this.push('javascript:' + encodeURIComponent(data));
    callback();
  });
}

function gulpEncodeUri() {
  var data = '';
  return through2.obj(function (file, enc, callback) {
    if (!file.isNull()) {
      if (file.isBuffer()) {
        file.contents = new Buffer('javascript:' + encodeURIComponent(file.contents.toString()));
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
    .pipe(uglify())
    .pipe(gulpEncodeUri())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist'));
});

