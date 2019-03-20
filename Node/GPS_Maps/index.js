var createError = require('http-errors');
var express = require('express');
var app = express();
//var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/';
var port = 80;
var port2 = 443

if(!process.argv[2]) {
  url += "STMS_test"
} else {
  url += process.argv[3];
}

var connect = mongoose.connect(url);

connect.then((db) => {
	console.log('Connected to Database Server.');
}, (err) => {
	console.log(err);
});

var statsRouter = require('./routes/statsRouter');
var passengerRouter = require('./routes/passengerRouter');
var driverRouter = require('./routes/driverRouter');
var vehicleRouter = require('./routes/vehicleRouter');

app.set('views', './views');
app.set('view engine', 'jade');

// SSL stuff
app.get('/.well-known/acme-challenge/R_0b-H1WtBv1433XJ3mVllDX7I3hwEBSDDSn8hLKjOM', function(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.sendFile(".well-known/acme-challenge/R_0b-H1WtBv1433XJ3mVllDX7I3hwEBSDDSn8hLKjOM");
});
app.get('/.well-known/acme-challenge/kjEx1h2b4j4UJhhrglZ2hGVXy9CdWzQgk4orS7KFzN8', function(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.sendFile(".well-known/acme-challenge/kjEx1h2b4j4UJhhrglZ2hGVXy9CdWzQgk4orS7KFzN8");
});

app.use(express.static('./static/'));
//app.use(morgan('dev'));
app.use(bodyParser.json())

app.get('/', function(req, res) {
	res.sendFile("index.html")
});

app.use('/stats', statsRouter);
app.use('/passengers', passengerRouter);
app.use('/drivers', driverRouter);
app.use('/vehicles', vehicleRouter);

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

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
});

var app2 = app;

var server2 = app2.listen(port2, function () {
   var host = server2.address().address
   var port2 = server2.address().port
   
   console.log("Example app listening at http://%s:%s", host, port2)
});
