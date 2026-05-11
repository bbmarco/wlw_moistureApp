#include <WiFi.h>
#include <HTTPClient.h>

// WLAN Zugangsdaten
const char* ssid = "DEIN_WLAN_NAME";
const char* password = "DEIN_PASSWORT";

// Server Konfiguration
const char* piUrl    = "http://192.168.0.52:3000/update-sensor";
const char* mySensorId = "Yucca";

// Pin Definitionen
const int sensorPin = D1; 
const int pwmPin    = D3; 

// Kalibrierung
const int TROCKEN = 2825;  
const int NASS    = 2150; 

// Zeitfaktor für Deep Sleep (in Mikrosekunden)
#define uS_TO_S_FACTOR 1000000  
#define TIME_TO_SLEEP  600      // 600 Sekunden = 10 Minuten

void setup() {
  Serial.begin(115200);
  // Wir warten nicht mehr 2 Sek, da wir im Deep Sleep Strom sparen wollen
  
  // 1. PWM sofort starten (für den Sensor)
  ledcAttach(pwmPin, 200000, 4); 
  ledcWrite(pwmPin, 10); 
  delay(100); // Kurz stabilisieren lassen

  // 2. Messung direkt im Setup (da loop im Deep Sleep nur 1x läuft)
  long rawSum = 0;
  for(int i = 0; i < 10; i++) {
    rawSum += analogRead(sensorPin);
    delay(10);
  }
  int rawValue = rawSum / 10;
  int moisture = map(rawValue, TROCKEN, NASS, 0, 100);
  moisture = constrain(moisture, 0, 100);

  // 3. WLAN verbinden mit Timeout
  WiFi.begin(ssid, password);
  unsigned long startAttemptTime = millis();
  
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 15000) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nVerbunden!");
    
    // 4. Daten senden
    HTTPClient http;
    http.begin(piUrl);
    http.setTimeout(5000); // 5 Sek Timeout für den Server
    http.addHeader("Content-Type", "application/json");
    
    String json = "{\"sensor_id\":\"" + String(mySensorId) + "\",\"moisture\":" + String(moisture) + ",\"battery\":100}";
    int httpResponseCode = http.POST(json);
    
    Serial.printf("Raw: %d | Feuchtigkeit: %d%% | Status: %d\n", rawValue, moisture, httpResponseCode);
    http.end();
  } else {
    Serial.println("\nWLAN Timeout - Gehe schlafen um Batterie zu retten.");
  }

  // 5. AB INS BETT (Deep Sleep)
  Serial.println("Schlafe für 10 Minuten...");
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  Serial.flush(); 
  esp_deep_sleep_start();
}

void loop() {
  // Bleibt leer, da der ESP32 nach dem Deep Sleep wieder beim setup() anfängt!
}
