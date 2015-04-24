/**
 * Created by mehsisil on 4/22/15.
 */
var express = require('express');
var app = express();
var compress = require('compression');
var logger = require('morgan');
var favicon = require('serve-favicon');

var environment = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 8088;

app.disable('x-powered-by');
app.use(favicon(process.cwd() + '/src/client/favicon.jpeg'));
app.use(compress());

app.get('/ping', function(req, res) {
    res.status(200).send();
});

switch(environment) {
    case 'production':
        break;
    case 'development':
        console.log('**DEVELOPMENT**');
        app.use(logger('combined'));
        app.use(express.static('./'));
        app.use(express.static('./src/client/'));
        app.use(express.static('./src/client/html/'));
        app.use('*', function(req, res) {
            res.sendFile(process.cwd() + '/src/client/html/index.html');
        });
        break;
}

var server = app.listen(port, '127.0.0.1', function() {
    console.log('Express server listening on port:'+port);
    console.log('App in '+environment+' mode.');
});