/**
 * Created by mehsisil on 4/22/15.
 */
module.exports = function() {
    var config = {
        alljs: [
            './src/client/**/*.js',
            './src/server/**/*.js',
            './*.js'
        ],
        temp: './.tmp/',
        build: './compiled/',
        client: './src/client/',
        css: './src/client/css/*.css',
        index: './src/client/html/index.html',
        html: './src/client/html/',
        js: [
            './src/client/js/*.js'
        ],
        root: './',
        server: './src/server/',
        source: './src/',
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },
        packages: [
            './package.json',
            './bower.json'
        ],
        nodeServer: './src/server/server.js',
        env: {
            production: {
                PORT: 8001,
                NODE_ENV: 'production'
            },
            development: {
                PORT: 8088,
                NODE_ENV: 'development'
            }
        },
        browserReloadDelay: 1000
    };

    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};
