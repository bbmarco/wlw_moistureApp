/**
 * @file      main.js
 * @author    Basil Dick
 * @project   wlw-Projektarbeit Frühlingssemester 2026
 * @brief     Schnittstelle zu User und delegiert entsprechend.
 */

import { getImageData, addPlant } from "./ui.js";

document.addEventListener('DOMContentLoaded', () => {
    const meinButton = document.querySelector('#btn');
    
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
            document.querySelector('#plant-image').value = "";
        } else {
            alert("Bitte fülle alle Felder aus!");
        }
    });
});