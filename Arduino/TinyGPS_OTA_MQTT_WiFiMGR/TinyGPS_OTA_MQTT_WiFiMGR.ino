#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>

#include <TinyGPS++.h>

#include<string.h>

#include<SoftwareSerial.h>

#include <PubSubClient.h>

#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include "WiFiManager.h"

const char* mqtt_server = "broker.mqtt-dashboard.com";
long lastMsg = 0;

WiFiClient espClient;
PubSubClient client(espClient);

TinyGPSPlus gps;
SoftwareSerial ss(D1,D2);

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  if (((char)payload[0]=='$') && ((char)payload[1]=='#')) {
    ArduinoOTA.handle();
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESPConnext-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("blahbus", "connected");
      // ... and resubscribe
      client.subscribe("blahbusin");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  ss.begin(9600);
  Serial.println("Booting");
  WiFiManager wifiManager;

  if(!wifiManager.autoConnect("ConnextESP","conn***")) {
    Serial.println("failed to connect and hit timeout");
    //reset and try again, or maybe put it to deep sleep
    ESP.reset();
    delay(1000);
  }

  Serial.print("Connected to ");
  Serial.println(WiFi.SSID());

  // Port defaults to 8266
  ArduinoOTA.setPort(8266);

  // Hostname defaults to esp8266-[ChipID]
  ArduinoOTA.setHostname("ConnextESPOTA");

  // No authentication by default
  ArduinoOTA.setPassword("conn***");

  // Password can be set with it's md5 value as well
  // MD5(admin) = 21232f297a57a5a743894a0e4a801fc3
  // ArduinoOTA.setPasswordHash("21232f297a57a5a743894a0e4a801fc3");

  ArduinoOTA.onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH)
      type = "sketch";
    else // U_SPIFFS
      type = "filesystem";

    // NOTE: if updating SPIFFS this would be the place to unmount SPIFFS using SPIFFS.end()
    Serial.println("Start updating " + type);
  });
  ArduinoOTA.onEnd([]() {
    Serial.println("\nEnd");
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
    else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
    else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
    else if (error == OTA_END_ERROR) Serial.println("End Failed");
  });
  ArduinoOTA.begin();
  Serial.println("Ready");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  digitalWrite(2,HIGH);
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;
    char* op="";
    sprintf(op,"%d,%d,%f,%d,%f,%f,%d,%d,%d,%f,%d,%f,%d,%f,%d",gps.satellites.value(),gps.satellites.isValid(),gps.hdop.value(),gps.hdop.isValid(),gps.location.lat(),gps.location.lng(),gps.location.isValid(),gps.date.value(),gps.time.value(),gps.altitude.meters(),gps.altitude.isValid(),gps.course.deg(),gps.course.isValid(),gps.speed.kmph(),gps.speed.isValid());
    Serial.println("Sending data...");
    client.publish("blahbus",op);
  }
}
