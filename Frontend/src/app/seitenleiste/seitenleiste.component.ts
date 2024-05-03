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
/*  @Output() rezepteGefiltert: Rezept[] = [];*/
  selectedGerichtarten: string[] = [];
  rezeptGeladen: boolean = false;
  rezepte: Rezept[] = [];
  originalRezepte: Rezept[] = [];

  constructor(private filterService: FilterService, private rezepteService: RezeptService) {  }
  ngOnInit(): void {
    this.rezepteService.rezepte$.subscribe(rezepte => {
      this.rezepte = rezepte.map(rezept => ({
        ...rezept,
        datum: rezept.datum ? new Date(rezept.datum) : undefined
      }));
      this.originalRezepte = [...this.rezepte];

      if (this.rezepte.length > 0) {
        this.loadRezept(); // Angenommen, Sie möchten hier eine spezielle Logik ausführen
      }
      console.log('Listeninhalt_originalRezepte', this.originalRezepte);
      this.updateGerichtArtCount();
    });

    // Stellen Sie sicher, dass die Rezeptdaten geladen sind
    this.rezepteService.getAlleRezepte();
  }

  loadRezept(): Promise<void> {
    // Asynchrone Logik zur Verarbeitung des geladenen Rezepts
    return new Promise<void>(resolve => {
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


/*  selectedFilters: string[] = [];
  selectedCategories: string[] = [];
  selectedKuechen: string[] = [];*/

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
    this.rezepteService.rezepte$.subscribe(rezepte => {
      // Zähler für jede Gerichtart auf 0 zurücksetzen
      this.gerichtArten.forEach((art) => {
        art.count = 0;
      });
/*      console.log('gerichtarten', this.gerichtArten)*/

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
      return; // Beenden, da keine Rezepte vorhanden sind
    }
    if (!Array.isArray(this.selectedGerichtarten)) {
      this.selectedGerichtarten = [];
    }

    console.log('Seitenleiste_rezepte', this.rezepte);
    if (this.selectedGerichtarten.length === 0) {
      // Wenn keine Gerichtsarten ausgewählt sind, sende alle Rezepte
      console.log('seitenliste_filterRezepte_nein:', this.selectedGerichtarten)
      this.gefilterteRezepte.emit(this.rezepte);
      this.resetRezepte();
    } else {
      // Filtere die Rezepte basierend auf den ausgewählten Gerichtsarten
      console.log('seitenliste_selectedGerichtarten_ja:', this.selectedGerichtarten)
      const gefilterteRezepte: Rezept[] = this.originalRezepte.filter((rezepte) => {
        return rezepte.tags?.some((tag) => this.selectedGerichtarten.includes(<string>tag.label));
      });
      // Sende die gefilterten Rezepte über den EventEmitter
      this.gefilterteRezepte.emit(gefilterteRezepte);
      console.log('Seitenleiste_filteredRezepte', gefilterteRezepte)
    }
  }

  resetRezepte():void{
    // [...] = Spread-Syntax, ermöglicht, die Elemente eines Arrays in ein anderes Array zu kopieren.
    console.log('SL:', this.originalRezepte)
    this.rezepte = [...this.originalRezepte];
   /* this.filterRezepte();*/
    // Filtern der Rezepte basierend auf den aktualisierten ausgewählten Gerichtsarten
  }

  toggleGerichtsart(label: string): void {
    console.log('Zustand VOR Toggle:', [...this.selectedGerichtarten]);
    if (!label || !Array.isArray(this.selectedGerichtarten)) return;

    // Filtert das Array, um nur Strings zu behalten.
    this.selectedGerichtarten = this.selectedGerichtarten
      .filter(item => typeof item === 'string');

    const index = this.selectedGerichtarten.indexOf(label);

    if (index !== -1) {
      // Entfernt das Label, wenn es bereits ausgewählt ist.
      this.selectedGerichtarten.splice(index, 1);
    } else {
      // Fügt das Label hinzu, wenn es noch nicht ausgewählt ist.
      this.selectedGerichtarten.push(label);
    }

    console.log('Zustand NACH Toggle:', [...this.selectedGerichtarten]);
    this.filterRezepte(); // Aktualisiert die Filterung der Rezepte.
  }



}
