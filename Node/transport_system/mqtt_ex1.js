var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')
 
client.on('connect', function () {
  client.subscribe('nodejsmqttex1', function (err) {
    if (!err) {
      client.publish('nodejsmqttex1', 'Hello mqtt')
	  console.log("Started Broker!")
    }
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic.toString()+": "+message.toString())
  if(message.toString() == "terminate") {
	  client.end()
  }
})