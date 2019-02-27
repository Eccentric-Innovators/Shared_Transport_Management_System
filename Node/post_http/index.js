var express = require('express');
var app = express();
//var morgan = require('morgan');
var bodyParser = require('body-parser')

var msg = ""

app.use(express.static('./static/'));
//app.use(morgan('dev'));
app.use(bodyParser.json())

app.get('/', function(req, res) {
	console.log("Got Request.")
	res.sendFile(__dirname + "/static/index.html")
});

app.post('/locupdate', (req, res) => {
  console.log(req.body);
  msg = "<br>"+JSON.stringify(req.body);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Received data.');
});

var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
});

app.get('/get', function(req, res) {
	res.send(msg);
	msg = ""
});