var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
		less = require('gulp-less'),
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
	
gulp.task('css', function() {
  return gulp.src('style.less', { style: 'expanded' })
    .pipe(less())
    .pipe(autoprefixer('last 2 version'))
		.pipe(cssnano({zindex: false}))
		.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('.'))
});

gulp.task('default', [], function() {
  gulp.start('js');
  gulp.start('css');
});