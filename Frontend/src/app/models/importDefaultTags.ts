/*// Beispiel einer Funktion, um die DEFAULT_TAGS an das Backend zu senden
import axios from 'axios';
import { DEFAULT_TAGS} from "../models/default_tag";

const importDefaultTags = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/rezepte/import', DEFAULT_TAGS);
    console.log('Default tags successfully imported:', response.data);
  } catch (error: any) { // Fehler als any typisieren
    console.error('Error importing default tags:', error.response ? error.response.data : error.message);
  }
};


// Funktion aufrufen, wenn du die Tags importieren möchtest
importDefaultTags();*/
