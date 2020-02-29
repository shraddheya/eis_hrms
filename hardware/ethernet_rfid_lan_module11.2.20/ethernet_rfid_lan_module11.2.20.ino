#include <MFRC522.h>
#include <SPI.h>
#include <Ethernet.h>
#include "printall.h"
#define SS_PIN 8
#define RST_PIN 9
const int pinA = 3 , pinB = 4, pinC =5 , LED = 6;
String MODE;
String tagid = "";
bool DEBUGmode;
bool  W_Rmode;
String inData; String Tagdata = "";
MFRC522 mfrc522(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;
byte mac[] = {0x90, 0xA2, 0xDA, 0x0F, 0x8A, 0x42};
// numeric IP for Google (no DNS)
// Set the static IP address of Arduino to use if the DHCP fails to assign
IPAddress ip(192, 168, 0, 35);
IPAddress server(192, 168, 0, 36);
//char server[] = "5TH1N62";
// Initialize the Ethernet client library
// with the IP address and port of the server
// that you want to connect to (port 80 is default for HTTP):
EthernetClient client;
void readID()
{
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    tagid += String(mfrc522.uid.uidByte[i], HEX);
  }
}
void tagdata_read()
{
  byte trailerBlock = 7;
  byte sector = 1;
  byte blockAddr = 5;

  MFRC522::StatusCode status;
  byte buffer1[18];
  byte size1 = sizeof(buffer1);
  // Authenticate
  status = (MFRC522::StatusCode)mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, trailerBlock, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK)
  {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }
  // Read data from the block
  status = (MFRC522::StatusCode)mfrc522.MIFARE_Read(blockAddr, buffer1, &size1);
  if (status != MFRC522::STATUS_OK)
  {
    Serial.print(F("MIFARE_Read() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
  }
  int evn = 0; String datastr;
  for (byte i = 0; i < 14; i++)
    datastr += String(buffer1[i], HEX);

  for (int j = 0 ; j < 27 ; j++)
  {
    if (j % 2 == 1)
    {
      Tagdata +=   datastr.charAt(j);
    }
  }
  fprint("tagdata");
  fprint(Tagdata);
}
int writeBlock(int blockNumber, byte arrayAddress[])
{
  int largestModulo4Number = blockNumber / 4 * 4;
  int trailerBlock = largestModulo4Number + 3; //determine trailer block for the sector
  if (blockNumber > 2 && (blockNumber + 1) % 4 == 0)
  {
    Serial.print(blockNumber); //block number is a trailer block (modulo 4); quit and send error code 2
    Serial.println(" is a trailer block:");
    return 2;
  }
  Serial.print(blockNumber);
  Serial.println(" is a data block:");
  byte status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, trailerBlock, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK)
  {
    Serial.print("PCD_Authenticate() failed: ");
    Serial.println(mfrc522.GetStatusCodeName(status));
    return 3; //return "3" as error message
  }
  status = mfrc522.MIFARE_Write(blockNumber, arrayAddress, 16); //valueBlockA is the block number, MIFARE_Write(block number (0-15), byte array containing 16 values, number of bytes in block (=16))
  //status = mfrc522.MIFARE_Write(9, value1Block, 16);
  if (status != MFRC522::STATUS_OK)
  {
    Serial.print("MIFARE_Write() failed: ");
    Serial.println(mfrc522.GetStatusCodeName(status));
    return 4; //return "4" as error message
  }
  fprintln("block was written");
  return 0;
}

void readmodeRFID() {
  String readclient;
  while (client.available())
  {
    char c = client.read();
    readclient += c;
    // see if header http response has ended
    if (c == '\n')
    {
      fprint(readclient);
      fprint("");
      readclient = "";
    }

    // if the string is "true" then return message to client
    if (readclient == "true")
    {
      Serial.write("You got true!\n");
      readclient = "";
    }
  }
  // Look for new cards
  mfrc522.PCD_Init();
  if (!mfrc522.PICC_IsNewCardPresent())
    return;

  // Select one of the cards
  if (!mfrc522.PICC_ReadCardSerial())
    return;
  fprint(" READ MODE");
  readID();
  tagdata_read();
  mfrc522.PICC_HaltA();
  bool retryflag = 0;
  String UID = "1563431661";
  fprint("DATA id=");
  fprint(tagid); fprint("@@@"); fprint(UID); fprint("@@@"); fprint(MODE); fprint("@@@"); fprint(Tagdata);
  for (int index = 0; index < 5; index++) {
    fprint("\nTry Number : ");
    fprintln(index);
    fprintln("connecting...**");
    if (client.connect(server, 80))
    {
      Serial.println("connected**");
      client.print("GET /old_php_data/phpfuns.php?mode=REG_ATT&data=");
      client.print(tagid);
      tagid = "";
      client.print("@@@");
      client.print(UID);
      client.print("@@@");
      client.print(MODE);
      client.print("@@@");
      client.print(Tagdata);
      Tagdata = "";
      client.println(" HTTP/1.1");
      client.println("Host:desktop-4t5la3j");
      client.println("User-Agent: arduino-ethernet");
      client.println("Connection: close");
      client.println();
      retryflag = 0;
      break;
    }

    else
    {
      // if you couldn't make a connection:
      fprintln("connection failed");
      fprintln("disconnecting.");
      client.stop();
      retryflag = 1;
    }
  }
}
void writeModeRFID() {
  int block = 5; byte Array[15];
  client.find("[tagdata] => ");
  while (client.available())
  {
    char  c = client.read();
    inData += c;
    // see if header http response has ended
    if (c == '\n') break;
    // if the string is "true" then return message to client
  }
  inData.getBytes(Array, inData.length());
  mfrc522.PCD_Init();
  if (!mfrc522.PICC_IsNewCardPresent())
    return;

  // Select one of the cards
  if (!mfrc522.PICC_ReadCardSerial())
    return;
  if (inData == "")
  {
    fprint(" READ MODE tagid uid");
    readID();
    mfrc522.PICC_HaltA();
    bool retryflag = 0;
    String UID = "1563431661";
    fprint(" DATA id=\t");
    fprintln(tagid);
    fprint(" ");
    fprintln(UID);

    for (int index = 0; index < 5; index++) {
      fprint("\nTry Number : ");
      fprintln(index);
      fprintln("connecting...**");
      if (client.connect(server, 80))
      {
        fprintln("connectED**");
        client.print("GET /hrm-angular+php/phpfuns.php?mode=ALLOT_CARD&data=");
        client.print(tagid);
        tagid = "";
        client.print("@@@");
        client.print(UID);
        client.println(" HTTP/1.1");
        client.println("Host:5TH1N62");
        client.println("User-Agent: arduino-ethernet");
        client.println("Connection: close");
        client.println();
        retryflag = 0;
        break;
      }

      else
      {
        // if you couldn't make a connection:
        fprintln("connection failed");
        fprintln("disconnecting.");
        client.stop();
        retryflag = 1;
      }

    }
  }
  else
  {
    fprint("WRITE  MODE");
    writeBlock(block, Array);
    tagdata_read();
    digitalWrite(LED, HIGH);
    delay(1000);
    if (inData.toInt() == Tagdata.toInt())
    {
      Serial.print("Done");
      inData = ""; Tagdata = "";
    }
    else Serial.print("error");
  }
  digitalWrite(LED, LOW);

}

void setup()
{
  pinMode(pinA, INPUT_PULLUP);
  pinMode(pinB, INPUT_PULLUP);
  pinMode(pinC, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
  DEBUGmode = digitalRead(pinA) == HIGH;
  W_Rmode = digitalRead(pinB) == HIGH;
  SerialEnable = DEBUGmode || W_Rmode;
  Serial.begin(115200);
  SPI.begin(); // Init SPI bus
  mfrc522.PCD_Init();
  for (byte i = 0; i < 6; i++)
    key.keyByte[i] = 0xFF; // Init MFRC522 card
  Ethernet.begin(mac, ip);
  Serial.println(F("Scan PICC to get UID ..."));
  delay(1);
}
void loop()
{
  DEBUGmode = digitalRead(pinA) == HIGH;
  W_Rmode = digitalRead(pinB) == HIGH;
  bool I_O = digitalRead(pinC); MODE = I_O == HIGH ? "IN" : "OUT";
  if ( W_Rmode == HIGH)    writeModeRFID();

  else                 readmodeRFID();
}
