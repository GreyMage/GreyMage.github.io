var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
	less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch'),
    imagemin = require('gulp-imagemin');	
	
	
gulp.task('js', function() {
	return gulp.src('src/**/*.js', { style: 'expanded' })
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'))
});
	
// Shorthand 
gulp.task('css', ['css:less','css:css']);

gulp.task('css:css', function() {
	return gulp.src('src/**/*.css', { style: 'expanded' })
		.pipe(autoprefixer('last 2 version'))
		.pipe(cssnano({zindex: false}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'))
});

gulp.task('css:less', function() {
	return gulp.src('src/**/*.less', { style: 'expanded' })
		.pipe(less())
		.pipe(autoprefixer('last 2 version'))
		.pipe(cssnano({zindex: false}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'))
});

// Done, core tasks.
gulp.task('build', ['js','css']);
gulp.task('watch', function () { gulp.watch('src/**/*.*',['build']); });
gulp.task('default', ['build'], function() { gulp.start('watch'); });