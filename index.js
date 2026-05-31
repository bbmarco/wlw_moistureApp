const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: http://192.168.0.52:3000;"
    );
    next();
});

const DATA_DIR = path.join(__dirname, 'sensor_data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

app.use(cors());
app.use(express.json());

// Statische Dateien direkt aus dem frontend-Ordner bereitstellen
app.use(express.static(path.join(__dirname, 'frontend')));

// Die index.html aus dem richtigen Unterordner ausliefern
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'structure', 'index.html'));
});

app.post('/update-sensor', (req, res) => {
    const { sensor_id, moisture, battery } = req.body;

    if (!sensor_id) {
        return res.status(400).json({ error: 'sensor_id ist erforderlich' });
    }

    const filePath = path.join(DATA_DIR, `${sensor_id}.json`);
    const data = {
        moisture: moisture,
        battery: battery || 100,
        timestamp: new Date().toISOString()
    };

    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Fehler beim Speichern:', err);
            return res.status(500).json({ error: 'Fehler beim Speichern der Daten' });
        }
        console.log(`[${new Date().toLocaleTimeString()}] Daten für ${sensor_id} gespeichert`);
        res.status(200).json({ message: 'Daten erfolgreich gespeichert' });
    });
});

app.get('/get-data', (req, res) => {
    fs.readdir(DATA_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Ordner konnte nicht gelesen werden' });
        }

        const jsonFiles = files.filter(file => file.endsWith('.json'));
        const allData = [];

        if (jsonFiles.length === 0) {
            return res.json([]);
        }

        let processed = 0;
        jsonFiles.forEach(file => {
            const filePath = path.join(DATA_DIR, file);
            fs.readFile(filePath, 'utf8', (err, content) => {
                processed++;
                if (!err) {
                    try {
                        const parsed = JSON.parse(content);
                        parsed.name = path.basename(file, '.json');
                        allData.push(parsed);
                    } catch (e) {
                        console.error("Fehler beim Parsen von", file);
                    }
                }

                if (processed === jsonFiles.length) {
                    res.json(allData);
                }
            });
        });
    });
});

app.post('/api/plants', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name fehlt' });

    const filePath = path.join(DATA_DIR, `${name}.json`);
    
    if (!fs.existsSync(filePath)) {
        const initialData = { moisture: 0, battery: 100, timestamp: new Date().toISOString() };
        fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
    }
    res.status(201).json({ message: 'Pflanze erfolgreich registriert!' });
});

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});