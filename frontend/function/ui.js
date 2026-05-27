/**
 * @file      ui.js
 * @author    Basil Dick
 * @project   wlw-Projektarbeit Frühlingssemester 2026
 * @brief     UI-Schicht: Zuständig für DOM-Manipulationen und Erstellung von HTML-Strukturen.
 */

import { fetchSensorData } from "./api.js";

/**
 * Durchläuft alle registrierten Pflanzenkarten und aktualisiert deren Feuchtigkeitswerte.
 * Steuert zudem die visuelle Alarmierung (Klasse 'alert-threshold') bei Grenzwertunterschreitung.
 */
export const updateAllPlantsMoisture = async () => {
  const allPlants = document.querySelectorAll(".plant-item");

  for (const plant of allPlants) {
    const sensorId = plant.getAttribute("data-sensor-id");
    const borderValue = parseFloat(plant.getAttribute("data-border"));

    if (!sensorId) continue;

    // Live-Daten vom API-Modul anfordern
    const data = await fetchSensorData(sensorId);
    const moistTextElement = plant.querySelector(".plant-moist p");

    if (data && data.moisture !== undefined) {
      const currentMoisture = parseFloat(data.moisture);
      moistTextElement.innerText = `${currentMoisture}%`;

      // Grenzwert-Überprüfung für den visuellen Alarm (CSS-Trigger)
      if (currentMoisture < borderValue) {
        plant.classList.add("alert-threshold"); // Färbt die Karte rot
      } else {
        plant.classList.remove("alert-threshold");
      }
    } else {
      // Rückfalloption, falls der Sensor offline ist oder das JSON leer ist
      moistTextElement.innerText = "Offline";
    }
  }
};

/**
 * Liest das hochgeladene Bild aus dem File-Input aus und konvertiert es in eine Data-URL.
 * * @returns {Promise<string>} Versprechen, das die Bild-DataURL oder den Pfad zum Standardbild zurückgibt.
 */
export const getImageData = () => {
  const fileInput = document.querySelector("#plant-image");
  if (!fileInput || !fileInput.files)
    return Promise.resolve("../images/default-plant.gif");

  const file = fileInput.files[0];
  return new Promise((resolve) => {
    if (!file) {
      resolve("../images/default-plant.gif"); // Fallback-Bild
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

/**
 * Erstellt eine neue HTML-Struktur (Pflanzenkarte) und fügt sie dem Dashboard hinzu.
 * * @param {string} name - Name der Pflanze.
 * @param {number|string} border - Schwellenwert für Feuchtigkeitsalarm in %.
 * @param {string} water - Benötigte Wassermenge (z.B. "200ml").
 * @param {string} interval - Giessintervall (z.B. "7 Tage").
 * @param {string} imageData - Base64-codierte Bildquelle oder Bildpfad.
 * @param {string} sensorId - Verknüpfte ID des physikalischen Sensors.
 */
export const addPlant = (
  name,
  border,
  water,
  interval,
  imageData,
  sensorId,
) => {
  // Container für die Karte erstellen
  const neuePflanze = document.createElement("div");
  neuePflanze.className = "plant-item";

  // Wichtige Metadaten als Daten-Attribute für spätere Updates hinterlegen
  neuePflanze.setAttribute("data-sensor-id", sensorId);
  neuePflanze.setAttribute("data-border", border);

  // Header-Bereich erzeugen
  const header = document.createElement("header");
  header.className = "section-header";
  const heading = document.createElement("h4");
  heading.innerText = name;
  header.appendChild(heading);

  // Inhalts-Bereich erzeugen
  const plantContent = document.createElement("div");
  plantContent.className = "plant-content";

  const plantInfo = document.createElement("div");
  plantInfo.className = "plant-info";

  // Helper-Funktion zur Vermeidung von repetitivem Code bei den Infoboxen
  const createInfoBox = (label, value, className) => {
    const box = document.createElement("div");
    box.className = className;
    const h5 = document.createElement("h5");
    h5.innerText = label;
    const p = document.createElement("p");
    p.innerText = value;
    box.appendChild(h5);
    box.appendChild(p);
    return box;
  };

  // Infoboxen in die Karte einbetten
  plantInfo.appendChild(createInfoBox("Sensor ID:", sensorId, "plant-sensor"));
  plantInfo.appendChild(document.createElement("br"));
  plantInfo.appendChild(
    createInfoBox("Feuchtigkeit:", "Lade...", "plant-moist"),
  );
  plantInfo.appendChild(document.createElement("br"));
  plantInfo.appendChild(
    createInfoBox("Grenzwert:", `${border}%`, "plant-border"),
  );
  plantInfo.appendChild(document.createElement("br"));
  plantInfo.appendChild(createInfoBox("Wassermenge:", water, "plant-water"));
  plantInfo.appendChild(document.createElement("br"));
  plantInfo.appendChild(
    createInfoBox("Intervall:", interval, "plant-interval"),
  );

  // Bild-Bereich erzeugen
  const plantImage = document.createElement("figure");
  plantImage.className = "plant-picture";
  const img = document.createElement("img");
  img.src = imageData;
  img.alt = `Abbildung von ${name}`;
  plantImage.appendChild(img);

  // Elemente zusammenfügen
  plantContent.appendChild(plantInfo);
  plantContent.appendChild(plantImage);
  neuePflanze.appendChild(header);
  neuePflanze.appendChild(plantContent);

  // Delete-Event: Ermöglicht das Entfernen einer Karte per Klick nach Bestätigung
  neuePflanze.onclick = (ev) => {
    if (confirm(`Möchtest du die Pflanze "${name}" wirklich löschen?`)) {
      ev.currentTarget.remove();
    }
  };

  // Karte ins Dashboard einhängen
  const plantContainer = document.querySelector("#plant-container");
  plantContainer.appendChild(neuePflanze);

  // Sofortige Aktualisierung anstossen, damit die Feuchtigkeit nicht auf "Lade..." stehen bleibt
  updateAllPlantsMoisture();
};
