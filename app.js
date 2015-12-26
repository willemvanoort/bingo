/**
 * Created by willem on 26-12-15.
 */
// Load config file
var config = require('./config');

// Load modules to handle requests
var http = require('http');
var express = require('express');
var path = require('path');

// Initiate debugger
var debug = require('debug')('Bingo:server');

// Create express instance
var app = express();

// Setup what views to use and how to interpret them
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var router = express.Router();
router.get('/', function(req, res, next) {
    res.render('index', { config: config });
});

app.use(express.static(path.join(__dirname, 'public')));

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

// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || config.AppPort);
app.set('port', port);

// Create HTTP server.
var server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Initiate socket.io
var socketio = require('socket.io');
var io = socketio.listen(server);
var sockets = [];

io.on('connect', function(socket){
    sockets.push(socket);
});





















/**
 * Normalize a port into a number, string, or false.
 * @param val the value to normalize
 * @returns {*}
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 * @param error
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}