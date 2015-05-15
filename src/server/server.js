/**
 * Created by mehsisil on 4/22/15.
 */
var express = require('express');
var app = express();
var compress = require('compression');
var logger = require('morgan');
var favicon = require('serve-favicon');
var mandrill = require('node-mandrill')('wiZcvIHn5HjZTAfAN2LY8A');
var bodyParser = require('body-parser');

var environment = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 8088;


app.disable('x-powered-by');
app.use(favicon(process.cwd() + '/src/client/favicon.jpeg'));
app.use(compress());

app.get('/ping', function(req, res) {
    res.status(200).send();
});

//TODO: handle body parser errors
var urlencodedParser = bodyParser.urlencoded({ extended: false, limit: '1mb' })
app.post('/contact-us/email', urlencodedParser, function(req, res) {
    var _name = req.body.name;
    var _email = req.body.email;
    var _subject = req.body.subject;
    var _message = req.body.message;

    //TODO: spam protection + data checks
    sendEmail ( _name, _email, _subject, _message , function(error, response) {
        if (error) {
            res.status(500).send(response);
        } else {
            res.status(200).send(response);
        }
    });
});

function sendEmail ( _name, _email, _subject, _message, callback) {
    mandrill('/messages/send', {
        message: {
            type: 'POST',
            to: [{email: 'rfi@aidindia.org' , name: 'rfi', type: 'to'}],
            from_email: _email,
            from_name: _name,
            subject: _subject,
            html: _message,
            autotext: true
        }
    }, function(error, response){
        if (error) {
            console.log( error );
            callback({message: "Unable to send email"});
        } else {
            console.log(response);
            callback(null, {message: "Email sent"});
        }
    });
}

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