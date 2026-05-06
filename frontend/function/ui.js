/**
 * @file      main.js
 * @author    Basil Dick
 * @project   wlw-Projektarbeit Frühlingssemester 2026
 * @brief     kümmert sich nur um das Dokument und weiss nur wie man HTML Strukturen baut
 */

export const getImageData = () => {
    const fileInput = document.querySelector('#plant-image');
    if (!fileInput || !fileInput.files) return Promise.resolve("../images/default-plant.gif");

    const file = fileInput.files[0];
    return new Promise((resolve) => {
        if (!file) {
            resolve("../images/default-plant.gif");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result); // Das ist der Base64-String
        reader.readAsDataURL(file);
    });
};

export const addPlant = (name, border, water, interval, imageData) => {
    /* neue Pflanze erstellen */
    const neuePflanze = document.createElement('div');
    neuePflanze.className = 'plant-item';

    /* Pflanzenname */
    const header = document.createElement('header');
    header.className = 'section-header';
    const heading = document.createElement('h4');
    heading.innerText = name;
    header.appendChild(heading);

    /* plantContent container */
    const plantContent = document.createElement('div');
    plantContent.className = 'plant-content';

    /* plantInfo container */
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

    /* Das Bild erstellen */
    const plantImage = document.createElement('figure');
    plantImage.className = 'plant-picture';
    const img = document.createElement('img');
    img.src = imageData;
    img.alt = `Abbildung von ${name}`;
    plantImage.appendChild(img);

    /* Zusammenbauen der Struktur */
    plantContent.appendChild(plantInfo);
    plantContent.appendChild(plantImage);

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