'use strict';

var gulp       = require('gulp');
var babel      = require('gulp-babel');
var nodemon    = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');

var babelOpts = {
    blacklist: [
        'es6.blockScoping', 'es6.constants', 'es6.forOf', 'es6.literals',
        'es6.properties.shorthand', 'es6.regex.unicode', 'es6.spread', 'es6.templateLiterals'
    ],
    stage: 1
};
var filename = 'index.js';

// Transpile ES6+ to ES5 (Babel)
gulp.task('babel', function () {
    return gulp.src(filename)
        .pipe(sourcemaps.init())
        .pipe(babel(babelOpts))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

// Nodemon + convenience
gulp.task('nodemon', function () {
    var config = {
        script: 'dist/'+filename,
        ext: 'js',
        watch: ['dist/'+filename, 'gulpfile.js'],
        verbose: true,
        env: { 'NODE_ENV': 'development' }
    };

    nodemon(config).on('restart', function (file) {
        console.log('[nodemon] restarted by following watch file(s) changed');
        console.log(file);
    });
});

// Watch file changes
gulp.task('watch', function () {
    gulp.watch(filename, ['babel'], function(){
        console.log('Babel is watching ES6+ files and turn the code into ES5');
    }).on('change', function(file){
        console.log('[watch] '+file.type+': '+file.path);
    });
});


gulp.task('default', ['babel', 'nodemon', 'watch']);
