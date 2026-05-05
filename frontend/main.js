/**
 * @file      main.js
 * @author    Basil Dick
 * @project   wlw-Projektarbeit Frühlingssemester 2026
 * @brief     Handle fetch requests to the server and DOM updates.
 */

const serverUrl = "http://localhost:8000";

const addPlant = (name, border, water, interval) => {

    /* neue Pflanze erstellen */
    const neuePflanze = document.createElement('div');
    neuePflanze.className = 'plant-item';

    /* Pflanzenname hinzufügen */
    const header = document.createElement('header');
    header.className = 'section-header'
    const heading = document.createElement('h4');
    heading.innerText = name;
    header.appendChild(heading);

    /* plantContent container (Infos + Bild) */
    const plantContent = document.createElement('div');
    plantContent.className = 'plant-content';

    /* plantInfo container */
    const plantInfo = document.createElement('div');
    plantInfo.className = 'plant-info'

    /* aktuelle Moisture hinzufügen */
    /* wird via fetch() von Raspi gezogen */
    const plantMoisture = document.createElement('div');
    plantMoisture.className = 'plant-moist';
    const hMoist = document.createElement('h5');
    hMoist.innerText = 'Feuchtigkeit:';
    const pMoist = document.createElement('p');
    pMoist.innerText = 'von Raspi';
    plantMoisture.appendChild(hMoist);
    plantMoisture.appendChild(pMoist);

    plantInfo.appendChild(plantMoisture);

    /* Grenzwert hinzufügen */
    const plantBorder = document.createElement('div');
    plantBorder.className = 'plant-border';
    const hBorder = document.createElement('h5');
    hBorder.innerText = 'Grenzwert:';
    const pBorder = document.createElement('p');
    pBorder.innerText = border;
    plantBorder.appendChild(hBorder);
    plantBorder.appendChild(pBorder);

    plantInfo.appendChild(plantBorder);

    /* Wassermenge hinzufügen */
    const plantWater = document.createElement('div');
    plantWater.className = 'plant-water';
    const hWater = document.createElement('h5');
    hWater.innerText = 'Wassermenge:';
    const pWater = document.createElement('p');
    pWater.innerText = water;
    plantWater.appendChild(hWater);
    plantWater.appendChild(pWater);

    plantInfo.appendChild(plantWater);

    /* Grenzwert hinzufügen */
    const plantInterval = document.createElement('div');
    plantInterval.className = 'plant-interval';
    const hInterval = document.createElement('h5');
    hInterval.innerText = 'Intervall';
    const pInterval = document.createElement('p');
    pInterval.innerText = interval;
    plantInterval.appendChild(hInterval);
    plantInterval.appendChild(pInterval);

    plantInfo.appendChild(plantInterval);

    /* alle an newplant hängen */

    neuePflanze.appendChild(header);
    neuePflanze.appendChild(plantInfo);

    neuePflanze.onclick = (ev) => {
        ev.currentTarget.remove();
    }

    const plantContainer = document.querySelector('#plant-container');
    plantContainer.appendChild(neuePflanze);
}


document.addEventListener('DOMContentLoaded', () => {
    const meinButton = document.querySelector('#btn');
    meinButton.addEventListener('click', () => {

        const plantName = document.querySelector('#plant-name').value;
        const plantBorder = document.querySelector('#plant-border').value;
        const plantWater = document.querySelector('#plant-water').value;
        const plantInterval = document.querySelector('#plant-interval').value;
        if (plantName !== "" && plantBorder !== "" && plantInterval !== "" && plantWater !== "") {
            addPlant(plantName, plantBorder, plantWater, plantInterval);

            document.querySelector('#plant-name').value = "";
            document.querySelector('#plant-border').value = "";
            document.querySelector('#plant-water').value = "";
            document.querySelector('#plant-interval').value = "";
        } else {
            alert("Bitte fülle beide Felder aus!");
        }
    });

});