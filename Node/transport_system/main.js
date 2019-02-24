var express = require('express');
var app = express();
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://broker.mqtt-dashboard.com')

var msg = ""

client.on('connect', function () {
  client.subscribe('blahbus', function (err) {
    if (!err) {
	  console.log("Started Broker!")
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic.toString()+": "+message.toString())
  msg = "<br>" + topic.toString()+": "+message.toString()
  if(message.toString() == "terminate") {
	  client.end()
  }
})

app.use(express.static('.'));

app.get('/', function(req, res) {
	console.log("Got Request.")
	res.sendFile(__dirname + "/ex.html")
});

var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

app.get('/get', function(req, res) {
	res.send(msg);
	msg = ""
})