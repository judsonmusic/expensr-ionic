var gulp = require('gulp');
var replace = require('gulp-string-replace');
var p = require('./package.json');
var version = p.version;
gulp.task('build:after', ['version']);
gulp.task('serve:after', ['version']);


gulp.task('version', function() {
  console.log('Running Gulp Version');
  gulp.src(["./www/index.html"])
  .pipe(replace(/VERSION/g, p.version))
    .pipe(gulp.dest('./www/'));
});
