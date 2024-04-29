import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Rezept} from "../models/rezepte";
import {FilterService} from "primeng/api";
import {RezeptService} from "../services/rezepte.service";
import {Tag} from "../models/tag";

@Component({
  selector: 'app-seitenleiste',
  templateUrl: './seitenleiste.component.html',
  styleUrls: ['./seitenleiste.component.scss']
})
export class SeitenleisteComponent implements OnInit {
  @Output() filteredRezepte: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  rezepte: Rezept[] = [];
  selectedGerichtarten: string[] = [];
/*  filteredRezepte: Rezept[] = [];*/

  constructor(private filterService: FilterService, private rezepteService: RezeptService) {
  }

  /*  interKuechen = [
      { label: 'Deutsch', value: 'deutsch', count: 3 },
      { label: 'Chinesisch', value: 'chinesisch', count: 1 },
      { label: 'Japanisch', value: 'japanisch', count: 0 },
      { label: 'Italienisch', value: 'italienisch', count: 0 },
      { label: 'Indisch', value: 'indisch', count: 4 },
    ];*/


  selectedFilters: string[] = [];
  selectedCategories: string[] = [];
  selectedKuechen: string[] = [];

  gerichtArten = [
    {label: 'Vorspeise', value: 'vorspeise', count: 1},
    {label: 'Hauptgang', value: 'hauptgang', count: 2},
    {label: 'Nachtisch', value: 'nachtisch', count: 3},
    /*{ label: 'Getränk', value: 'getränk', count: 2 },*/
  ];

  /*  gerichtEigenschaften = [
      { label: 'schnell', value: 'schnell', count: 2 },
      { label: 'kalorienreich', value: 'kalorienreich', count: 3 },
      { label: 'vegetarisch', value: 'vegetarisch', count: 2 },
      { label: 'proteinreich', value: 'preoteinreich', count: 0 },
    ];*/


  selectedGerichtEigenschaften: string[] = [];

  ngOnInit(): void {
    // Beim Initialisieren der Komponente die Zählung der Gerichtarten aktualisieren
    this.updateGerichtArtCount();
  }

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
    if (this.selectedGerichtarten.length === 0) {
      // Wenn keine Gerichtsarten ausgewählt sind, sende alle Rezepte
      console.log('seitenliste_filterRezepte_nein:', this.selectedGerichtarten)
      this.filteredRezepte.emit(this.rezepte);
    } else {
      console.log('seitenliste_filterRezepte_ja:', this.selectedGerichtarten)
      // Filtere die Rezepte basierend auf den ausgewählten Gerichtsarten
      const filteredRezepte: Rezept[] = this.rezepte.filter((rezept) => {
        return rezept.tags?.some((tag) => this.selectedGerichtarten.includes(tag.label));
      });

      // Sende die gefilterten Rezepte über den EventEmitter
      this.filteredRezepte.emit(filteredRezepte);
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
