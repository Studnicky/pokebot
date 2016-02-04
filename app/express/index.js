var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressServer = express();

// View rendering...
expressServer.set('views', path.join(__dirname, 'views'));
expressServer.set('view engine', 'ejs');
//  Public stuff
expressServer.use(favicon(__dirname + '/../../public/favicon.ico'));
expressServer.use(express.static(path.join(__dirname, '/../../public')));
//  Cookie and body parsing...
expressServer.use(cookieParser());
expressServer.use(bodyParser.json());
expressServer.use(bodyParser.urlencoded({ extended: false }));
//  Routing...
var routes = require('./routes/index');
expressServer.use('/', routes);

// What to do on 404?
expressServer.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
//  What to do on other errors?
expressServer.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = expressServer;
