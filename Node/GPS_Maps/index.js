var express = require('express');
var app = express();
//var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/';
var port = 8080;

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

app.use(express.static('./static/'));
//app.use(morgan('dev'));
app.use(bodyParser.json())

app.get('/', function(req, res) {
	console.log("Got Request.")
	res.sendFile("index.html")
});

app.use('/stats', statsRouter);

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
});