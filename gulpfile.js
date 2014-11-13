'use strict';
// generated on 2014-06-18 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');
var jsdoc = require('gulp-jsdoc');

var static_files_root = 'app/client';
var static_bower_root = 'app/bower_components';
var static_bower_fontawsome_root = 'app/bower_components/font-awesome/fonts';

// load plugins
var $ = require('gulp-load-plugins')();

/* starting express server
*  see http://rhumaric.com/2014/01/livereload-magic-gulp-style/
*  TODO: Continue with tutorial
*/
function startExpress() {
    var express = require('express');
    var app = express();
    app.use(express.static(__dirname));
    app.listen(4000);
}

gulp.task('styles', function () {
    return gulp.src(static_files_root + '/styles/main.less')
        .pipe($.less())
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size());
});

gulp.task('copy-fonts', function () {
    return gulp.src(static_bower_root + '/font-awesome/fonts/*')
        .pipe(gulp.dest('.tmp/fonts'))
        .pipe($.size());
});

gulp.task('scripts', function () {
    return gulp.src(static_files_root + '/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('html', ['styles','copy-fonts', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src(static_files_root + '/*.html')
        .pipe($.useref.assets({searchPath: '{.tmp,' + static_files_root + '}'}))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src(static_files_root + '/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return $.bowerFiles()
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size());
});

gulp.task('extras', function () {
    return gulp.src([static_files_root + '/*.*', '!' + static_files_root + '/*.html'], { dot: true })
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'images', 'fonts', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static(static_files_root))
        .use('/bower_components', connect.static(static_bower_root))    // serve bower components from different root
        .use('/fonts', connect.static(static_bower_fontawsome_root))    // serve fonts needed because of font-awesome.css, gulp had done this before
        .use(connect.static('.tmp'))
        .use(connect.directory(static_files_root));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect'], function () {
    require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src(static_files_root + '/*.html')
        .pipe(wiredep({
            directory: static_bower_root
        }))
        .pipe(gulp.dest(static_files_root));
});

gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload();

    // watch for changes
    gulp.watch([
        static_files_root + '/*.html',
        '.tmp/styles/**/*.css',
        static_files_root + '/scripts/**/*.js',
        static_files_root + '/images/**/*'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch(static_files_root + '/styles/**/*.less', ['styles']);
    gulp.watch(static_files_root + '/scripts/**/*.js', ['scripts']);
    gulp.watch(static_files_root + '/images/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('jsdoc', function() {
    console.log('Executing jsdoc...');
    var infos = {
        name: '.lnk JSDoc'
    };
    gulp.src('./app/routes/*.js')
        .pipe(jsdoc.parser(infos, 'data.json'))
        .pipe(jsdoc.generator(
            './documentation',
            {
                path: 'ink-docstrap',
                systemName      : '.lnk',
                footer          : "CAS-FEE Project .lnk",
                copyright       : "Andy Hoegger, Holger Heymanns",
                navType         : "vertical",
                theme           : "Cerulean",
                linenums        : true,
                collapseSymbols : false,
                inverseNav      : false
            },
            {
                'private': false,
                monospaceLinks: false,
                cleverLinks: false,
                outputSourceFiles: true
            }
        )
    );
});
