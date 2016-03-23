var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
	less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch'),
	header = require('gulp-header'),
    imagemin = require('gulp-imagemin');	
	
var fs = require('fs');
var path = require('path');
var pkg = require('./package.json');
var fileBanner = [ '/**',
	'Last Build: <%= now %>',
'*/\n'].join("\n");

gulp.task('userscript',function(done){
	
	function getHeaders(pkg){
		
		var headers = pkg.headers;
		
		//Auto padder
		var pad = (function(headers){
			var maxlen = 0;
			for(var x in headers){
				if(x.length > maxlen){
					maxlen = x.length;
				}
			}
			return function(x){
				while(x.length < maxlen + 1){
					x += " ";
				}
				return x;
			}
		})(headers);
		
		var headerblock = [];
		headerblock.push('// ==UserScript==');
		for(var header in headers){
			if(Array.isArray(headers[header])){
				headers[header].forEach(function(sub){
					headerblock.push('// @'+pad(header)+" "+sub);
				});
				continue;
			}
			headerblock.push('// @'+pad(header)+" "+headers[header]);
		}
		headerblock.push('// ==/UserScript==');
		return headerblock.join("\n");
	}
	
	function getBootloader(pkg){
		return '(function(url){ var script = document.createElement("script"); script.type = "text/javascript"; script.src = url+"?"+(new Date().getTime()); document.body.appendChild(script); })("'+pkg.uriprefix+'/'+path.basename(__dirname)+'/dist/'+pkg.main+'");';
	}
	
	fs.readFile('./package.json',function(err,data){
		var fresh_pkg = JSON.parse(data).userscript;
		var content = [getHeaders(fresh_pkg),getBootloader(fresh_pkg)].join("\n\n");
		fs.writeFile('dist/script.user.js', content, function(err){
			done();
		});
	})

})
	
gulp.task('js', function() {
	return gulp.src('src/**/*.js', { style: 'expanded' })
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(gulp.dest('dist'))
		.pipe(uglify())
		.pipe(header(fileBanner, { pkg : pkg, now: (new Date()+"") } ))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'))
});
	
// Shorthand 
gulp.task('css', ['css:less','css:css']);

gulp.task('css:css', function() {
	return gulp.src('src/**/*.css', { style: 'expanded' })
		.pipe(autoprefixer('last 2 version'))
		.pipe(gulp.dest('dist'))
		.pipe(cssnano({zindex: false})) 
		.pipe(header(fileBanner, { pkg : pkg, now: (new Date()+"") } ))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'))
});

gulp.task('css:less', function() {
	return gulp.src('src/**/*.less', { style: 'expanded' })
		.pipe(less())
		.pipe(autoprefixer('last 2 version'))
		.pipe(gulp.dest('dist'))
		.pipe(cssnano({zindex: false}))
		.pipe(header(fileBanner, { pkg : pkg, now: (new Date()+"") } ))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'))
});

// Done, core tasks.
gulp.task('build', ['userscript','js','css']);
gulp.task('watch', function () { gulp.watch(['src/**/*.*','gulpfile.js','package.json'],['build']); });
gulp.task('default', ['build'], function() { gulp.start('watch'); });