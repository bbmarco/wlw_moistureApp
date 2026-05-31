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
  try {
    const response = await fetch('/get-data');
    if (!response.ok) throw new Error('Fehler beim Laden der Serverdaten');
    const serverPlants = await response.json();

    serverPlants.forEach(plantData => {
      let plantElement = document.querySelector(`[data-sensor-id="${plantData.name}"]`);

      const savedSettings = JSON.parse(localStorage.getItem(`plant_${plantData.name}`)) || {
        name: plantData.name,
        border: 20,
        water: "200ml",
        interval: "7T",
        image: "../images/default-plant.gif"
      };

      if (!plantElement) {
        addPlant(
          savedSettings.name,
          savedSettings.border, 
          savedSettings.water, 
          savedSettings.interval, 
          savedSettings.image, 
          plantData.name
        );
        plantElement = document.querySelector(`[data-sensor-id="${plantData.name}"]`);
      }

      if (plantElement) {
        const borderValue = parseFloat(plantElement.getAttribute("data-border")) || savedSettings.border;
        const moistTextElement = plantElement.querySelector(".plant-moist p");
        
        if (moistTextElement && plantData.moisture !== undefined) {
          const currentMoisture = parseFloat(plantData.moisture);
          moistTextElement.innerText = `${currentMoisture}%`;

          if (currentMoisture < borderValue) {
            plantElement.classList.add("alert-threshold");
          } else {
            plantElement.classList.remove("alert-threshold");
          }
        }
      }
    });

    const allUiPlants = document.querySelectorAll(".plant-item");
    for (const uiPlant of allUiPlants) {
      const sensorId = uiPlant.getAttribute("data-sensor-id");
      const existsOnServer = serverPlants.some(p => p.name === sensorId);
      if (!existsOnServer) {
        uiPlant.remove();
      }
    }

  } catch (error) {
    console.error("Fehler beim Aktualisieren der Pflanzen:", error);
    
    const allPlants = document.querySelectorAll(".plant-item");
    for (const plant of allPlants) {
      const moistTextElement = plant.querySelector(".plant-moist p");
      if (moistTextElement) {
        moistTextElement.innerText = "Offline";
      }
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
  const neuePflanze = document.createElement("div");
  neuePflanze.className = "plant-item";
  neuePflanze.style.position = "relative"; // Zwingt absolute Elemente (wie das X), sich an der Karte auszurichten
  neuePflanze.setAttribute("data-sensor-id", sensorId);
  neuePflanze.setAttribute("data-border", border);

  const header = document.createElement("header");
  header.className = "section-header";
  header.style.paddingRight = "30px"; // Platzhalter für das X schaffen

  const heading = document.createElement("h4");
  heading.innerText = name;
  heading.contentEditable = true;
  header.appendChild(heading);

  // Positioniert das X unauffällig und präzise oben rechts in der Ecke
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "❌";
  deleteBtn.style.position = "absolute";
  deleteBtn.style.top = "10px";
  deleteBtn.style.right = "10px";
  deleteBtn.style.background = "none";
  deleteBtn.style.border = "none";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.fontSize = "0.9rem";
  deleteBtn.style.zIndex = "10";

  const plantContent = document.createElement("div");
  plantContent.className = "plant-content";

  const plantInfo = document.createElement("div");
  plantInfo.className = "plant-info";

  // Bereinigt Eingaben sofort beim Tippen, um Zeilenumbrüche und CSS-Verschiebungen zu blockieren
  const createEditableInfoBox = (label, value, className) => {
    const box = document.createElement("div");
    box.className = className;
    const h5 = document.createElement("h5");
    h5.innerText = label;
    const p = document.createElement("p");
    p.innerText = value;
    p.contentEditable = true;
    
    // Verhindert, dass die "Enter"-Taste das Layout zerreißt
    p.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        p.blur();
      }
    });

    box.appendChild(h5);
    box.appendChild(p);
    return box;
  };

  const createInfoBoxStatic = (label, value, className) => {
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

  plantInfo.appendChild(createInfoBoxStatic("Sensor ID:", sensorId, "plant-sensor"));
  plantInfo.appendChild(document.createElement("br"));
  plantInfo.appendChild(createInfoBoxStatic("Feuchtigkeit:", "Lade...", "plant-moist"));
  plantInfo.appendChild(document.createElement("br"));
  
  const borderBox = createEditableInfoBox("Grenzwert:", `${border}%`, "plant-border");
  plantInfo.appendChild(borderBox);
  plantInfo.appendChild(document.createElement("br"));
  
  const waterBox = createEditableInfoBox("Wassermenge:", water, "plant-water");
  plantInfo.appendChild(waterBox);
  plantInfo.appendChild(document.createElement("br"));
  
  const intervalBox = createEditableInfoBox("Intervall:", interval, "plant-interval");
  plantInfo.appendChild(intervalBox);

  const plantImageContainer = document.createElement("figure");
  plantImageContainer.className = "plant-picture";
  plantImageContainer.style.cursor = "pointer";
  
  const img = document.createElement("img");
  img.src = imageData;
  img.alt = `Abbildung von ${name}`;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.display = "block";
  plantImageContainer.appendChild(img);

  // Unsichtbares Datei-Input-Feld direkt auf das Bild legen
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  plantImageContainer.appendChild(fileInput);

  plantContent.appendChild(plantInfo);
  plantContent.appendChild(plantImageContainer);
  neuePflanze.appendChild(deleteBtn);
  neuePflanze.appendChild(header);
  neuePflanze.appendChild(plantContent);

  const saveSettings = () => {
    // Sichert nur reinen Text ohne HTML-Überreste
    const rawBorder = borderBox.querySelector("p").innerText.trim();
    const cleanBorder = parseFloat(rawBorder.replace("%", "")) || 20;
    
    neuePflanze.setAttribute("data-border", cleanBorder);

    const settings = {
      name: heading.innerText.trim(),
      border: cleanBorder,
      water: waterBox.querySelector("p").innerText.trim(),
      interval: intervalBox.querySelector("p").innerText.trim(),
      image: img.src
    };
    localStorage.setItem(`plant_${sensorId}`, JSON.stringify(settings));
  };

  // Event-Listener für automatische Speicherung
  heading.onblur = saveSettings;
  borderBox.querySelector("p").onblur = () => {
    const p = borderBox.querySelector("p");
    let txt = p.innerText.trim();
    if (txt && !txt.endsWith("%")) {
      p.innerText = txt + "%";
    }
    saveSettings();
  };
  waterBox.querySelector("p").onblur = saveSettings;
  intervalBox.querySelector("p").onblur = saveSettings;

  // Macht das gesamte Bild klickbar und leitet den Klick an das Datei-System weiter
  plantImageContainer.onclick = (e) => {
    if (e.target !== fileInput) {
      fileInput.click();
    }
  };

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target.result;
        saveSettings();
      };
      reader.readAsDataURL(file);
    }
  };

  deleteBtn.onclick = (e) => {
    e.stopPropagation(); // Verhindert ungewollte Klicks auf andere Kartenelemente
    if (confirm(`Möchtest du die Pflanze "${heading.innerText.trim()}" wirklich löschen?`)) {
      localStorage.removeItem(`plant_${sensorId}`);
      neuePflanze.remove();
    }
  };

  const plantContainer = document.querySelector("#plant-container");
  plantContainer.appendChild(neuePflanze);
};