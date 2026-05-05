/**
 * @file      main.js
 * @author    Basil Dick
 * @project   wlw-Projektarbeit Frühlingssemester 2026
 * @brief     Handle fetch requests to the server and DOM updates.
 */

const serverUrl = "http://localhost:8000";

const getImageData = () => {
    const fileInput = document.querySelector('#plant-image');
    // Sicherstellen, dass das Element existiert
    if (!fileInput || !fileInput.files) return Promise.resolve("../images/default-plant.gif");
    
    const file = fileInput.files[0];
    return new Promise((resolve) => {
        if (!file) {
            // Falls kein Bild gewählt wurde, ein Standardbild nehmen
            resolve("../images/default-plant.gif");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result); // Das ist der Base64-String
        reader.readAsDataURL(file);
    });
};

const addPlant = (name, border, water, interval, imageData) => {
    /* neue Pflanze erstellen */
    const neuePflanze = document.createElement('div');
    neuePflanze.className = 'plant-item';

    /* Pflanzenname hinzufügen (Header) */
    const header = document.createElement('header');
    header.className = 'section-header';
    const heading = document.createElement('h4');
    heading.innerText = name;
    header.appendChild(heading);

    /* plantContent container (Hält Infos + Bild nebeneinander) */
    const plantContent = document.createElement('div');
    plantContent.className = 'plant-content';

    /* plantInfo container (Links) */
    const plantInfo = document.createElement('div');
    plantInfo.className = 'plant-info';

    const createInfoBox = (label, value, className) => {
        const box = document.createElement('div');
        box.className = className;
        const h5 = document.createElement('h5');
        h5.innerText = label;
        const p = document.createElement('p');
        p.innerText = value;
        box.appendChild(h5);
        box.appendChild(p);
        return box;
    };

    plantInfo.appendChild(createInfoBox('Feuchtigkeit:', 'von Raspi', 'plant-moist'));
    plantInfo.appendChild(document.createElement('br'));
    plantInfo.appendChild(createInfoBox('Grenzwert:', border, 'plant-border'));
    plantInfo.appendChild(document.createElement('br'));
    plantInfo.appendChild(createInfoBox('Wassermenge:', water, 'plant-water'));
    plantInfo.appendChild(document.createElement('br'));
    plantInfo.appendChild(createInfoBox('Intervall:', interval, 'plant-interval'));

    /* Das Bild erstellen (Rechts) */
    const img = document.createElement('img');
    img.className = 'plant-picture';
    img.src = imageData; // Hier werden die Daten eingefügt
    img.alt = `Abbildung von ${name}`;

    /* Zusammenbauen der Struktur */
    plantContent.appendChild(plantInfo);
    plantContent.appendChild(img);

    neuePflanze.appendChild(header);
    neuePflanze.appendChild(plantContent);

    neuePflanze.onclick = (ev) => {
        if (confirm("Pflanze wirklich löschen?")) {
            ev.currentTarget.remove();
        }
    };

    const plantContainer = document.querySelector('#plant-container');
    plantContainer.appendChild(neuePflanze);
};

document.addEventListener('DOMContentLoaded', () => {
    const meinButton = document.querySelector('#btn');
    
    // WICHTIG: Die Funktion muss 'async' sein
    meinButton.addEventListener('click', async () => {

        const plantName = document.querySelector('#plant-name').value;
        const plantBorder = document.querySelector('#plant-border').value;
        const plantWater = document.querySelector('#plant-water').value;
        const plantInterval = document.querySelector('#plant-interval').value;

        if (plantName !== "" && plantBorder !== "" && plantInterval !== "" && plantWater !== "") {
            
            // 1. Warten, bis die Bilddaten geladen sind
            const imageData = await getImageData();

            // 2. addPlant mit den Bilddaten aufrufen
            addPlant(plantName, plantBorder, plantWater, plantInterval, imageData);

            // 3. Felder leeren
            document.querySelector('#plant-name').value = "";
            document.querySelector('#plant-border').value = "";
            document.querySelector('#plant-water').value = "";
            document.querySelector('#plant-interval').value = "";
            document.querySelector('#plant-image').value = ""; // Bild-Input zurücksetzen
        } else {
            alert("Bitte fülle alle Felder aus!");
        }
    });
});