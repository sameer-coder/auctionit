var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var db = require('./db.js');

var auction = require('./auction.js');
var dbusers = require('./models/users.js');

var app = express();

var io = require('./io');

console.log("Set socket");


//================== log4js config =====
var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/debug.log'), 'debug');
global.logger = log4js.getLogger();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

io.on('connection', function(socket) {
    //sends the current auction details
    dbusers.getCurrentAuction(function(res) {
        console.log(res);
        socket.emit('init_message', res);
    })

    socket.on('SendcurrentAuctionDetails', function() {
        console.log("Received request for currentAuctionDetails");
        dbusers.getCurrentAuction(function(res) {
            socket.emit('currentAuctionDetails', res);
        })
    });

    setInterval(function() {
        dbusers.getCurrentAuction(function(res) {
            socket.emit('currentAuctionDetails', res);
        })
    }, 500);

});



io.on('error', function() {
    console.log("errr");
});


setInterval(function() {
    dbusers.updateCurrentAuction(function(status) {

    })
}, 500);

module.exports = app;