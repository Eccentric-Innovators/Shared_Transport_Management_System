var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');

var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var statsRouter = require('./routes/statsRouter');
var passengerRouter = require('./routes/passengerRouter');
var driverRouter = require('./routes/driverRouter');
var vehicleRouter = require('./routes/vehicleRouter');

var app = express();
var io = require('socket.io')();
sockets = [];
var ws = require('./websock')(io, sockets);
io.listen(3000);

app.use((req, res, next) => {
	req.io = io;
	req.sockets = sockets;
	next();
});

app.all('*', (req, res, next) => {
	if(req.secure) {
		return next();
	} else {
		res.redirect(307, 'https://'+req.hostname+':'+app.get('secPort')+req.url);
	}
});

var url = 'mongodb://localhost:27017/STMS';

var connect = mongoose.connect(url);

connect.then((db) => {
	console.log('Connected to Database Server.'+url);
}, (err) => {
	console.log(err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// SSL stuff
app.get('/.well-known/acme-challenge/R_0b-H1WtBv1433XJ3mVllDX7I3hwEBSDDSn8hLKjOM', function(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	fs.readFile(__dirname+"/public/.well-known/acme-challenge/R_0b-H1WtBv1433XJ3mVllDX7I3hwEBSDDSn8hLKjOM", (err, data) => {
		res.end(data);
	});
});
app.get('/.well-known/acme-challenge/kjEx1h2b4j4UJhhrglZ2hGVXy9CdWzQgk4orS7KFzN8', function(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	fs.readFile(__dirname+"/public/.well-known/acme-challenge/kjEx1h2b4j4UJhhrglZ2hGVXy9CdWzQgk4orS7KFzN8", (err, data) => {
		res.end(data);
	});
});

app.use(bodyParser.json())

app.get('/', function(req, res) {
	res.sendFile("index.html")
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/stats', statsRouter);
app.use('/passengers', passengerRouter);
app.use('/drivers', driverRouter);
app.use('/vehicles', vehicleRouter);

app.get('/key', (req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end(config.gcloudKey);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
