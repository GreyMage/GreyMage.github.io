var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
	less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch'),
    imagemin = require('gulp-imagemin');	
	
var fs = require('fs');
var path = require('path');

gulp.task('userscript',function(done){
	
	function getHeaders(pkg){
		var headers = {
			name:pkg.scriptname,
			namespace:pkg.namespace,
			include:pkg.include,
			version:pkg.version,
			grant:pkg.grant || "none",
		}
		
		var headerblock = [];
		headerblock.push('// ==UserScript==');
		for(var header in headers){
			if(Array.isArray(headers[header])){
				headers[header].forEach(function(sub){
					headerblock.push('// @'+header+" "+sub);
				});
				continue;
			}
			headerblock.push('// @'+header+" "+headers[header]);
		}
		headerblock.push('// ==/UserScript==');
		return headerblock.join("\n");
	}
	
	function getBootloader(pkg){
		return '(function(url){ var script = document.createElement("script"); script.type = "text/javascript"; script.src = url+"?"+(new Date().getTime()); document.body.appendChild(script); })("'+pkg.uriprefix+'/'+path.basename(__dirname)+'/dist/script.min.js");';
	}
	
	fs.readFile('./package.json',function(err,data){
		var pkg = JSON.parse(data);
		var content = [getHeaders(pkg),getBootloader(pkg)].join("\n\n");
		fs.writeFile('dist/script.user.js', content, function(err){
			done();
		});
	})
	
	

})
	
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
gulp.task('build', ['userscript','js','css']);
gulp.task('watch', function () { gulp.watch(['src/**/*.*','gulpfile.js','package.json'],['build']); });
gulp.task('default', ['build'], function() { gulp.start('watch'); });