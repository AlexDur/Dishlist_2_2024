/*
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gradlePath = path.join(__dirname, '../android/capacitor.build.gradle');

fs.readFile(gradlePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Fehler beim Lesen der Datei:', err);
    return;
  }

  const updatedData = data.replace(/JavaVersion.VERSION_21/g, 'JavaVersion.VERSION_17');

  fs.writeFile(gradlePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Fehler beim Schreiben der Datei:', err);
      return;
    }
    console.log('Datei erfolgreich aktualisiert.');
  });
});
*/
