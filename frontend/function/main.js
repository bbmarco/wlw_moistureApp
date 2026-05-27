/**
 * @file      main.js
 * @author    Basil Dick
 * @project   wlw-Projektarbeit Frühlingssemester 2026
 * @brief     Controller-Schicht: Verbindet UI-Events mit der Applikationslogik.
 */

import { getImageData, addPlant, updateAllPlantsMoisture } from "./ui.js";

// Wartet, bis das gesamte HTML-Dokument vollständig geladen und analysiert wurde
document.addEventListener("DOMContentLoaded", () => {
  const meinButton = document.querySelector("#btn");
  const refreshButton = document.querySelector("#btn-refresh");

  // Initialer Datenabruf beim Laden der Webseite
  updateAllPlantsMoisture();

  // Polling-Mechanismus: Alle 10 Sekunden automatisch die Werte aktualisieren
  setInterval(updateAllPlantsMoisture, 10000);

  // Event-Listener für den manuellen Aktualisierungs-Button (Refresh)
  if (refreshButton) {
    refreshButton.addEventListener("click", async () => {
      // Visuelles Feedback für den User aktivieren
      refreshButton.innerText = "⏳ Lädt...";
      refreshButton.disabled = true;

      // Daten frisch vom Server fetchen
      await updateAllPlantsMoisture();

      // UI in den Normalzustand zurücksetzen
      refreshButton.innerText = "🔄 Aktualisieren";
      refreshButton.disabled = false;
    });
  }

  // Event-Listener für das Erstellen einer neuen Pflanze (Formular-Submit)
  meinButton.addEventListener("click", async () => {
    // Formulardaten auslesen
    const plantName = document.querySelector("#plant-name").value;
    const plantSensorId = document.querySelector("#plant-sensor-id").value;
    const plantBorder = document.querySelector("#plant-border").value;
    const plantWater = document.querySelector("#plant-water").value;
    const plantInterval = document.querySelector("#plant-interval").value;

    // Validierung: Prüfen, ob alle Textfelder ausgefüllt sind
    if (
      plantName !== "" &&
      plantSensorId !== "" &&
      plantBorder !== "" &&
      plantInterval !== "" &&
      plantWater !== ""
    ) {
      // Bild verarbeiten (Base64-String generieren)
      const imageData = await getImageData();

      // Neue Pflanzenkarte generieren und hinzufügen
      addPlant(
        plantName,
        plantBorder,
        plantWater,
        plantInterval,
        imageData,
        plantSensorId,
      );

      // Formularfelder nach erfolgreichem Eintrag leeren
      document.querySelector("#plant-name").value = "";
      document.querySelector("#plant-sensor-id").value = "";
      document.querySelector("#plant-border").value = "";
      document.querySelector("#plant-water").value = "";
      document.querySelector("#plant-interval").value = "";
      document.querySelector("#plant-image").value = "";
    } else {
      // Warnung ausgeben, falls Eingaben unvollständig sind
      alert("Bitte fülle alle Felder aus!");
    }
  });
});
