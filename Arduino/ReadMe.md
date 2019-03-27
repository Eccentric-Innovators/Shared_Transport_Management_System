# Arduino files

This folder contains the ino files pertaining to the codes for the Arduino and NodeMCU boards.

* **lib**<br/>
  This folder contains all the required libraries for the Arduino codes.

* **TinyGPS_OTA_MQTT_WiFiMGR**<br/>
  Let's split this folder name into 4 parts:
	* *TinyGPS:*
    This refers to the `TinyGPSPlus` library that is used to read data from the GPS sensor (Ublox GY-Neo 6MV2).
  * *OTA:*
    OTA or Over-The-Air refers to the `ArduinoOTA` library that enables the developer to send OTA firmware updates.
  * *MQTT:*
    This is the core of the code. This code reads values from the GPS sensor using the `TinyGPSPlus` library, and sends the values through MQTT protocol using the PubSubClient library.
  * *WiFiMGR:*
    This is a healper library for the NodeMCU in order to ease the process of connecting it to a WiFi source. It also eliminates the need to enter the netword credentials in the code.

* **TinyGPS_OTA_HTTP_WiFiMGR**<br/>
  As you might've noticed, the name of this folder is very similar to the previous one. The only difference is the `HTTP` part. This code uses the HTTP protocol instead of MQTT to send the GPS values from the NodeMCU to the server. This transition was made since HTTP is faster than MQTT.

* **RFID_Access**<br/>
  This is a code downloaded from the internet for using the RFID sensor (MFRC522) to verify access.

* **RFID**<br/>
  This code has the required parts from *RFID_Access* in order to get the RFID code and send it via serial.

* **HTTP_POST_test**<br/>
  A test code made to check if the HTTP POST requests go to the Node.js server.