#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include "WiFiManager.h"
#include <ESP8266HTTPClient.h>

WiFiClient espClient;

char* url = "http://stms.ml/stats";

int vehicleNo = 1, driverId = 1033;

static const int RXPin = D1, TXPin = D2;
static const uint32_t GPSBaud = 9600;

TinyGPSPlus gps;
SoftwareSerial ss(RXPin, TXPin);

void setup() {
  Serial.begin(115200);
  ss.begin(GPSBaud);

  pinMode(2,OUTPUT);

  digitalWrite(2,LOW);
  
  WiFiManager wifiManager;

  if(!wifiManager.autoConnect("ConnextESP","conn***")) {
    Serial.println("failed to connect and hit timeout");
    //reset and try again, or maybe put it to deep sleep
    ESP.reset();
    delay(1000);
  }

  Serial.print("Connected to ");
  Serial.println(WiFi.SSID());

  ArduinoOTA.setPort(8266);
  ArduinoOTA.setHostname("ConnextESPOTA");
  ArduinoOTA.setPassword("conn***");
  ArduinoOTA.onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH)
      type = "sketch";
    else
      type = "filesystem";
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
  long m = millis();
  while(WiFi.status()!= WL_CONNECTED) {
    if(millis() - m > 6000) {
      Serial.println("Connection Error.");
      break;
    }
  }
  if(WiFi.status()== WL_CONNECTED){
    HTTPClient http;

    char data[100];

    snprintf(data, 100, "{\"driverId\": %d, \"vehicleNo\": %d}", driverId, vehicleNo);

    http.begin("http://stms.ml/stats/begin");
    http.addHeader("Content-Type", "application/json");
    
    int httpCode = http.POST(data);
    String payload = http.getString();
    
    Serial.println(httpCode);
    Serial.println(payload);
    http.end();
  }else{
    Serial.println("Error in WiFi connection");
  }
}

void loop() {
  char data[200];
  sprintf(data, "{\"vehicleNo\": %d, \"data\": {\"sats\": %d, \"hdop\": %.3f, \"lat\": %.5f, \"lng\": %.5f, \"course\": %.3f, \"speed\": %.3f }}", vehicleNo, gps.satellites.value(), gps.hdop.value(), gps.location.lat(), gps.location.lng(), gps.course.deg(), gps.speed.kmph());
  Serial.println(data);
  if(WiFi.status()== WL_CONNECTED){
    HTTPClient http;
    
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    
    int httpCode = http.POST(data);
    String payload = http.getString();
    
    Serial.println(httpCode);
    Serial.println(payload);
    http.end();
  }else{
    Serial.println("Error in WiFi connection");
  }

  smartDelay(1000);
}

static void smartDelay(unsigned long ms)
{
  unsigned long start = millis();
  do 
  {
    while (ss.available())
      gps.encode(ss.read());
  } while (millis() - start < ms);
}
