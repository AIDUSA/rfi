/**
 * Created by mehsisil on 4/22/15.
 */
var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('./gulp.config.js')();
var plugins = require('gulp-load-plugins')({lazy: true});

var colors = plugins.util.colors;

gulp.task('help', plugins.taskListing);
gulp.task('default', ['serve-dev']);

gulp.task('wiredep', function() {
    log('wiring bower dependecies into index.html');
    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(plugins.inject(gulp.src(config.js, {read: false})))
        .pipe(plugins.inject(gulp.src(config.css, {read: false})))
        .pipe(gulp.dest(config.client));
});

gulp.task('serve-dev', ['wiredep'], function() {
    var env = config.env['development'];
    serve(env);
});

gulp.task('serve-prod', ['build'], function() {
    var env = config.env['production'];
    serve(env);
});
gulp.task('build', ['optimize'], function() {
    log('Building everything');

    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
        message: 'Running `gulp serve-build`'
    };
    log(msg);
});
gulp.task('optimize', ['wiredep'], function() {
    log('Optimizing the js, css, and html - Maybe someday. Nothing to optimize today.');
});
/////
function serve(env) {
    var options = {
        script: config.nodeServer,
        delayTime: 1,
        env: env,
        watch: [config.server]
    };
    return plugins.nodemon(options)
        .on('restart', function(files) {
            log('*** nodemon restarted.');
            log('files that changed:',files);
            browserSync.notify('reloading...');
            browserSync.reload({stream: false});
        })
        .on('start', function() {
            log('*** nodemon started.');
            startBrowserSync(env);
        })
        .on('crash', function() {
            log('*** nodemon crashed.');
        })
        .on('exit', function() {
            log('*** nodemon existed cleanly');
        });
}

function startBrowserSync(env) {
    gulp.watch([config.js, config.html], [browserSync.reload]);

    var options = {
        ui: false,
        proxy: 'localhost:' + env.PORT,
        port: 3000,
        files: env.NODE_ENV === 'development' ? [
            config.client + '**/*.*'
        ] : [],
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        notify: true,
        reloadDelay: config.browserReloadDelay
    };
    browserSync(options);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                plugins.util.log(plugins.util.colors.blue(msg[item]));
            }
        }
    } else {
        plugins.util.log(plugins.util.colors.blue(msg));
    }
}