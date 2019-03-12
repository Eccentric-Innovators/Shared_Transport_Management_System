#include <SPI.h>
#include <MFRC522.h>
#define RST_PIN 5
#define SS_PIN  4
MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup()
{
    Serial.begin(115200);
    SPI.begin();
    mfrc522.PCD_Init();
    Serial.println("Service starting...");
}

void loop()
{
    if ( ! mfrc522.PICC_IsNewCardPresent()) return;
    if ( ! mfrc522.PICC_ReadCardSerial()) return;
    uint32_t _uid;
    Serial.print("Card UID: ");
    for (char i=0;i<4;i++) _uid=(_uid<<8)+(mfrc522.uid.uidByte[i]);
    Serial.println(_uid);
    Serial.println(_uid,HEX);
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
}
