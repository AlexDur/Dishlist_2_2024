import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Rezept} from "../../../../models/rezepte";
import {FilterService} from "primeng/api";
import {RezeptService} from "../../../../services/rezepte.service";
import {Gerichtart} from "../../../../models/gerichtart";
import {Tag} from "../../../../models/tag";
import {map, tap} from "rxjs";

@Component({
  selector: 'app-seitenleiste-mobil',
  templateUrl: './seitenleiste-mobil.component.html',
  styleUrls: ['./seitenleiste-mobil.component.scss']
})
export class SeitenleisteMobilComponent implements OnInit{
  @Output() gefilterteRezepte: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  @Input() rezepte: Rezept[] = [];
  selectedGerichtarten: string[] = [];
  rezeptGeladen: boolean = false;
  originalRezepte: Rezept[] = [];

  constructor(private filterService: FilterService, private rezepteService: RezeptService) {  }
  ngOnInit(): void {
    this.rezepteService.rezepte$.pipe(
      map(rezepte => rezepte.map(rezept => ({
        ...rezept,
        datum: rezept.datum ? new Date(rezept.datum) : undefined
      }))),
      tap(rezepte => {
        this.originalRezepte = [...rezepte];
        console.log('Listeninhalt_originalRezepte', this.originalRezepte);
        this.resetRezepte();
        this.updateGerichtArtCount();
      })
    ).subscribe();
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

  tags: Tag[] = [
    {label: 'Vorspeise', count: 0, selected: false },
    {label: 'Hauptgang', count: 0, selected: false },
    {label: 'Nachtisch', count: 0, selected: false },
  ];

  trackById(index: number, item: Tag): any {
    return item.id || index; // Verwenden Sie item.id, wenn verfügbar, sonst index
  }


  /*  gerichtEigenschaften = [
      { label: 'schnell', severity: 'schnell', count: 2 },
      { label: 'kalorienreich', severity: 'kalorienreich', count: 3 },
      { label: 'vegetarisch', severity: 'vegetarisch', count: 2 },
      { label: 'proteinreich', severity: 'preoteinreich', count: 0 },
    ];*/


  selectedGerichtEigenschaften: string[] = [];


/*  updateGerichtArtCount(): void {
    this.tags.forEach((art) => {
      art.count = this.rezepte.filter(rezept => rezept.tags?.some(tag => tag.label === art.label)).length;
    });
  }*/

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
      console.log('Seitenleiste_gefilterteRezepte', gefilterteRezepte)
    }
  }

  resetRezepte():void{
    // [...] = Spread-Syntax, ermöglicht, die Elemente eines Arrays in ein anderes Array zu kopieren.
    console.log('SL:', this.originalRezepte)
    this.rezepte = [...this.originalRezepte];
    /* this.filterRezepte();*/
    // Filtern der Rezepte basierend auf den aktualisierten ausgewählten Gerichtsarten
  }

  toggleGerichtsart(label: "Vorspeise" | "Hauptgang" | "Nachtisch" | undefined): void {
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

  updateGerichtArtCount(): void {
    // Setze alle Zähler zurück, um eine korrekte Neuzählung zu gewährleisten
    this.tags.forEach(tag => tag.count = 0);

    // Gehe jedes Rezept durch
    this.rezepte.forEach(rezept => {
      // Gehe jedes Tag im Rezept durch
      rezept.tags?.forEach(rezeptTag => {
        // Finde das entsprechende Tag in der 'tags'-Liste und erhöhe den Zähler
        const foundTag = this.tags.find(tag => tag.label === rezeptTag.label);
        if (foundTag) {
          foundTag.count++;
        }
      });
    });
  }

}
