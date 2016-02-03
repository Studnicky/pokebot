/*----------------- Initializers -----------------*/

// Include gulp
var gulp = require('gulp');

//  Include plugins
var coffeelint = require('gulp-coffeelint');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var shell = require('gulp-shell');

/*------------ Extended declarations -------------*/

// Lint all custom JS files with jshint
gulp.task('lint-js', function() {
    return gulp.src('scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//  Lint all custom coffee script files, too
gulp.task('lint-coffee', function() {
    return gulp.src('scripts/*.coffee')
        .pipe(coffeelint())
        .pipe(coffeelint.reporter())
});

//  
gulp.task('run-local', shell.task([
    //  Should start redis if not running
    'bin/hubot'
]));

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('scripts/*.js', ['lint-js']);
    gulp.watch('scripts/models/*.js', ['lint-js']);
    gulp.watch('scripts/*.coffee', ['lint-coffee']);
});


/*------------------ Invokations -----------------*/

// Default Task
gulp.task('default', ['lint-js', 'lint-coffee', 'watch']);

gulp.task('test', ['lint-js', 'lint-coffee']);