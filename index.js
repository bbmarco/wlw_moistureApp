const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// Ordnerpfad für Sensordaten definieren
const DATA_DIR = path.join(__dirname, 'sensor_data');

// Endpunkt 1: Sensor schickt daten
app.post('/update-sensor', (req,res) => {
    const { sensor_id, moisture, battery } = req.body;

    if (!sensor_id) {
        return res.status(400).send("Fehler: keine sensor_id gesendet!")
    }

    const newData = {
        moisture: moisture,
        battery: battery,
        timestamp: new Date().toISOString()
    };

    // pfad erzeugt: /home/pi/plant-monitor/sensor_data/{sensor_id}.json
    const filePath = path.join(DATA_DIR, `${sensor_id}.json`);

    // Daten in File Speichern
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

    console.log(`[${new Date().toLocaleTimeString()}] Daten für ${sensor_id} gespeichert`);

    // Antwort an Sensor: 200 = i.O.
    res.status(200).send("Daten erfolgreich empfangen")
});

// Endpunkt 2: GET Request von WebAPP
app.get('/get-data/:id', (req,res) => {
    const sensorId = req.params.id;
    const filePath = path.join(DATA_DIR, `${sensorId}.json`)

    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath);
        res.json(JSON.parse(fileContent));
    } else {
        res.status(404).json({ error: "Sensor-Daten nicht gefunden"});
    }
});

app.use(express.static(path.join(__dirname, 'frontend/structure')));
app.use('/stylesheets', express.static(path.join(__dirname, 'frontend/stylesheets')));
app.use('/images', express.static(path.join(__dirname, 'frontend/images')));
app.use('/main.js', express.static(path.join(__dirname, 'frontend/main.js')));

app.listen(PORT, () => {
    console.log(`Server läuft. Erreichbar unter http://192.168.0.52:${PORT}`);
})