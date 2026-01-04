#include <Arduino_JSON.h>

/*
//arduino
const int Ptemp = A3;
const int Ppresa = A0;
const int Ppresb = A1;
const int Pcond = A2;
*/

//esp32 s3
//const int Ptemp = ;
const int Ppresa = 7;
const int Ppresb = 4;
const int Pcond = 8;

const int presaThresh = 3600;
const int presbThresh = 3600;
const int touchThresh = 3600;

JSONVar sData;
const float interval = 0.1;
const bool debug = false;

void setup() {
  Serial.begin(115200);

  //pinMode(Ptemp, INPUT);
  pinMode(Ppresa, INPUT);
  pinMode(Ppresb, INPUT);
  pinMode(Pcond, INPUT);
}

float i=0;

void loop() {
  sData["info"]["loop"] = i;
  sData["info"]["interval"] = interval;
  sData["info"]["time"] = round(i * interval * 1000)/1000;

  //sData["temp"]["raw"] = constrain(analogRead(Ptemp), 0, 1023);
  sData["presa"]["raw"] = constrain( analogRead(Ppresa) , 0, 4095);
  sData["presb"]["raw"] = constrain( analogRead(Ppresb) , 0, 4095);
  sData["cond"]["raw"] = constrain( analogRead(Pcond) , 0, 4095);

  //sData["temp"]["adjusted"] = constrain(map(sData["temp"]["raw"], 0, 1023, -500, 4500), 0, 1000)/10;    // calculated from datasheet, temp C = -50 + 100V
  sData["presa"]["adjusted"] = constrain(map(sData["presa"]["raw"], presaThresh, 20, 0, 4000), 0, 4000)/40;
  sData["presb"]["adjusted"] = constrain(map(sData["presb"]["raw"], presbThresh, 20, 0, 4000), 0, 4000)/40;
  sData["cond"]["adjusted"] = constrain(map(sData["cond"]["raw"], touchThresh, 0, 0, 4000), 0, 4000)/40;
  sData["cond"]["contact"] = (int(sData["cond"]["raw"]) > touchThresh) ? false : true;

  if (debug){
    //Serial.print(sData["temp"]["raw"]);
    //Serial.print(" ");
    Serial.print(sData["presa"]["raw"]);
    Serial.print(" ");
    Serial.print(sData["presb"]["raw"]);
    Serial.print(" ");
    Serial.print(sData["cond"]["raw"]);
    Serial.print(" ");
    //Serial.print(sData["temp"]["adjusted"]);
    //Serial.print(" ")
    Serial.print(sData["presa"]["adjusted"]);
    Serial.print(" ");
    Serial.print(sData["presb"]["adjusted"]);
    Serial.print(" ");
    Serial.print(sData["cond"]["adjusted"]);
    Serial.print(" ");
    Serial.print(sData["cond"]["contact"]);
    Serial.print(" ");
    Serial.println("");
  } else {
    Serial.println(sData);
  } 

  delay(int(interval * 1000));
  i++;
}
