import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Rezept} from "../models/rezepte";
import {FilterService} from "primeng/api";
import {RezeptService} from "../services/rezepte.service";
import {Tag} from "../models/tag";
import {Gerichtart} from "../models/gerichtart";

@Component({
  selector: 'app-seitenleiste',
  templateUrl: './seitenleiste.component.html',
  styleUrls: ['./seitenleiste.component.scss']
})
export class SeitenleisteComponent implements OnInit {
  @Output() gefilterteRezepte: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  @Output() rezepteGefiltert: Rezept[] = [];
  selectedGerichtarten: string[] = [];
  rezeptGeladen: boolean = false;
  rezepte: Rezept[] = [];

  constructor(private filterService: FilterService, private rezepteService: RezeptService) {
  }
  ngOnInit(): void {
    this.rezepteService.getAlleRezepte().subscribe((rezepte) => {
      console.log('Geladene Rezepte:', rezepte);
      this.rezepte = rezepte.map((rezept) => {
        if (rezept.datum) {
          rezept.datum = new Date(rezept.datum);
        }
        return rezept;
      });

      // Annahme: Um das erste Rezept aus der Liste als currentRecipe setzen
      if (this.rezepte.length > 0) {
        const firstRezeptId = this.rezepte[0]?.id;
        if (firstRezeptId !== undefined) {
          // Nur wenn Rezepte vorhanden sind, loadRezept() aufrufen
          this.loadRezept();
        }
      }
      this.updateGerichtArtCount();
    });
  }

  loadRezept(): Promise<void> {
    // Hier wird das Rezept asynchron geladen
    // rezeptGeladen muss auf true gesetzt sein, wenn das Rezept vollständig geladen ist
    return new Promise<void>((resolve, reject) => {
      // Annahme: this.rezeptGeladen wird auf true gesetzt, wenn das Rezept erfolgreich geladen ist
      this.rezeptGeladen = true;
      resolve();

    });
  }

  /*  interKuechen = [
      { label: 'Deutsch', severity: 'deutsch', count: 3 },
      { label: 'Chinesisch', severity: 'chinesisch', count: 1 },
      { label: 'Japanisch', severity: 'japanisch', count: 0 },
      { label: 'Italienisch', severity: 'italienisch', count: 0 },
      { label: 'Indisch', severity: 'indisch', count: 4 },
    ];*/


  selectedFilters: string[] = [];
  selectedCategories: string[] = [];
  selectedKuechen: string[] = [];

  gerichtArten: Gerichtart[] = [
    {label: 'Vorspeise', severity: 'vorspeise', count: 0 },
    {label: 'Hauptgang', severity: 'hauptgang', count: 0 },
    {label: 'Nachtisch', severity: 'nachtisch', count: 0 },
  ];

  /*  gerichtEigenschaften = [
      { label: 'schnell', severity: 'schnell', count: 2 },
      { label: 'kalorienreich', severity: 'kalorienreich', count: 3 },
      { label: 'vegetarisch', severity: 'vegetarisch', count: 2 },
      { label: 'proteinreich', severity: 'preoteinreich', count: 0 },
    ];*/


  selectedGerichtEigenschaften: string[] = [];


  updateGerichtArtCount(): void {
    // Erhalt aller Rezepte
    this.rezepteService.getAlleRezepte().subscribe((rezepte: Rezept[]) => {
      // Zähler für jede Gerichtart auf 0 zurücksetzen
      this.gerichtArten.forEach((art) => {
        art.count = 0;
      });

      // Rezepte durchlaufen und die Anzahl für jede Gerichtart zählen
      rezepte.forEach((rezept) => {
        if (rezept.tags) {

          // Durch jede Tag-Instanz iterieren
          rezept.tags.forEach((tag:Tag) => {
            // Überprüfen, ob der Tag zu einer Gerichtart gehört
            const gerichtart = this.gerichtArten.find((g) => g.label === tag.label);
            if (gerichtart) {
              gerichtart.count++;
            }
          });
        }
      });
    });
  }

  filterRezepte(): void {
    if (!this.rezepte) {
      console.log('Keine Rezepte vorhanden.');
      return; // Beenden Sie die Funktion, da keine Rezepte vorhanden sind
    }
    console.log('Seitenleiste_rezepte', this.rezepte);
    if (this.selectedGerichtarten.length === 0) {
      // Wenn keine Gerichtsarten ausgewählt sind, sende alle Rezepte
      console.log('seitenliste_filterRezepte_nein:', this.selectedGerichtarten)
      this.gefilterteRezepte.emit(this.rezepte);
    } else {
      // Filtere die Rezepte basierend auf den ausgewählten Gerichtsarten
      console.log('seitenliste_selectedGerichtarten_ja:', this.selectedGerichtarten)
      const gefilterteRezepte: Rezept[] = this.rezepte.filter((rezepte) => {
        return rezepte.tags?.some((tag) => this.selectedGerichtarten.includes(tag.label));
      });

      // Sende die gefilterten Rezepte über den EventEmitter
      this.gefilterteRezepte.emit(gefilterteRezepte);
      console.log('Seitenleiste_filteredRezepte', gefilterteRezepte)
    }
  }

  toggleGerichtsart(label: string): void {
    // Überprüfe, ob die Gerichtsart bereits ausgewählt ist
    const index = this.selectedGerichtarten.indexOf(label);
    /*-1 wird std.mäßig zurückgegeben, wenn kein Element im Array ist*/
    if (index !== -1) {
      // Wenn die Gerichtsart bereits ausgewählt ist, entferne sie aus dem Array
      this.selectedGerichtarten.splice(index, 1);
    } else {
      // Wenn die Gerichtsart nicht ausgewählt ist, füge sie dem Array hinzu
      this.selectedGerichtarten.push(label);
    }
    this.filterRezepte(); // Filtere die Rezepte basierend auf den aktualisierten ausgewählten Gerichtsarten
  }


}
