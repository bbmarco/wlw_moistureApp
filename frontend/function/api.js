/**
 * @file      api.js
 * @author    Basil Dick
 * @project   wlw-Projektarbeit Frühlingssemester 2026
 * @brief     Netzwerkschicht: Übernimmt die gesamte API-Kommunikation mit dem Backend.
 */

// Ermittelt dynamisch die Server-Adresse (erlaubt den Betrieb auf PC und Raspberry Pi)
const serverUrl = window.location.origin;

/**
 * Holt die aktuellen Sensordaten für eine bestimmte Sensor-ID vom Express-Server.
 * * @param {string} sensorId - Die eindeutige ID des Feuchtigkeitssensors.
 * @returns {Promise<Object|null>} Objekt mit { moisture, battery, timestamp } oder null bei Fehler.
 */
export const fetchSensorData = async (sensorId) => {
  try {
    const response = await fetch(`${serverUrl}/get-data/${sensorId}`);

    // Validierung: Wenn der Sensor im Backend (noch) nicht existiert
    if (!response.ok) {
      throw new Error(`Sensor ${sensorId} nicht gefunden`);
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Fehler beim Abrufen der Daten für Sensor ${sensorId}:`,
      error,
    );
    return null;
  }
};
