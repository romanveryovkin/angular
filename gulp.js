var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    runSequence = require('gulp-run-sequence'),
    sass = require('gulp-sass'),
    stringify = require('stringify'),
    uglify = require('gulp-uglify'),
    lib    = require('bower-files')(),
    gulpif = require('gulp-if'),
    paths = {
        jsSrc: './js',
        dist: './dist/',
        sass: './sass',
        bowerDir: './bower_components/'
    },
    minify;

var compileFiles = function (done, watch) {
    minify = !watch;

    runSequence(
        'scripts',
        'styles',
        'libs',
        done
    );

    if (watch) {
        gulp.watch(paths.jsSrc + '/**', ['scripts']);
        gulp.watch(paths.sass + '/**', ['styles']);
    }
};

gulp.task('scripts', function () {
    gulp.src([paths.jsSrc + '/bootstrap.js'])
        .pipe(browserify({
            transform: stringify({
                extensions: ['.html']
            })
        }))
        .on('error', function(err){
            console.log(err.message);
            this.end();
        })
        .pipe(concat('freshly.js'))
        .pipe(gulpif(minify, uglify()))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('libs', function(){
    var src = lib.ext('js').files;
    src.push(paths.jsSrc + '/notification-fx/notification-fx.js');

    gulp.src(src)
        .pipe(concat('lib.min.js'))
        .pipe(gulpif(minify, uglify()))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('styles', function () {
    gulp.src([
            paths.sass + '/*.scss',
            paths.bowerDir + '**/dist/*.min.css',
            paths.bowerDir + 'ngprogress/ngProgress.css',
        ])
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [
                paths.sass,
                paths.bowerDir + 'bootstrap-sass/assets/stylesheets/',
                paths.bowerDir + 'modernizr-mixin/stylesheets/'
            ]
        }).on('error', sass.logError))
        .pipe(concat('freshly.css'))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('dev', function(done) {
    compileFiles(done, true);
});

gulp.task('dist', function (done) {
    compileFiles(done, false);
});
/**
 * Created by Roma on 19.03.2016.
 */
