var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin');	
	
	
gulp.task('js', function() {
  return gulp.src('script.js', { style: 'expanded' })
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('.'))
});

gulp.task('default', [], function() {
    gulp.start('js');
});