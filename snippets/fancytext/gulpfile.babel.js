// including plugins
var gulp = require('gulp')
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var insert = require('gulp-insert');
var pkg = require('./package.json');
  
function getFormattedDate() {
    var d = new Date();
    d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
    return d;
}  

function generateHeader() {
	var headers = [];
	headers.push(pkg.name);
	headers.push('Author: '+pkg.author);
	headers.push('Built On: '+getFormattedDate());
	return '/* ' + headers.join(" ; ") + ' */';
}
  
// task
gulp.task('default', function () {
    gulp.src('./src/**/*.js') // path to your files
	.pipe(jshint())
    .pipe(jshint.reporter()) // Dump results
    .pipe(uglify())
	.pipe(insert.prepend(generateHeader()))
    .pipe(gulp.dest('./build'));
});