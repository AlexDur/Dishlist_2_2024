import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Rezept} from "../../../../models/rezepte";
import {RezeptService} from "../../../../services/rezepte.service";
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

  tags: Tag[] = [
    {label: 'Vorspeise', count: 0, selected: false },
    {label: 'Hauptgang', count: 0, selected: false },
    {label: 'Nachtisch', count: 0, selected: false },
  ];

  constructor(private rezepteService: RezeptService) {
    this.rezepteService.onRezeptUpdated.subscribe(() => {
      this.updateGerichtArtCount();
    });
  }

  ngOnInit(): void {
    this.rezepteService.rezepte$.pipe(
      map(rezepte => rezepte.map(rezept => ({
        ...rezept,
        datum: rezept.datum ? new Date(rezept.datum) : undefined
      }))),
      tap(rezepte => {
        this.originalRezepte = [...rezepte];
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





  trackById(index: number, item: Tag): any {
    return item.id || index; // Verwenden Sie item.id, wenn verfügbar, sonst index
  }



  resetRezepte():void{
    // [...] = Spread-Syntax, ermöglicht, die Elemente eines Arrays in ein anderes Array zu kopieren.
    this.rezepte = [...this.originalRezepte];
    /* this.filterRezepte();*/
    // Filtern der Rezepte basierend auf den aktualisierten ausgewählten Gerichtsarten
  }

  toggleGerichtsart(tag: Tag): void {
    tag.selected = !tag.selected;
    this.selectedGerichtarten = this.tags.filter(t => t.selected).map(t => t.label);
    this.filterRezepte(); // Direktes Aufrufen der Filtermethode
  }

  filterRezepte(): void {
    if (this.selectedGerichtarten.length === 0) {
      this.gefilterteRezepte.emit(this.originalRezepte);
    } else {
      const gefilterteRezepte = this.originalRezepte.filter(rezept =>
        rezept.tags?.some(tag => this.selectedGerichtarten.includes(tag.label))
      );
      this.gefilterteRezepte.emit(gefilterteRezepte);
    }
  }

  updateGerichtArtCount(): void {
    this.tags.forEach(tag => tag.count = 0);
    this.rezepte.forEach(rezept => {
      rezept.tags?.forEach(rezeptTag => {
        const foundTag = this.tags.find(tag => tag.label === rezeptTag.label);
        if (foundTag) {
          foundTag.count++;
        }
      });
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


  /*  gerichtEigenschaften = [
      { label: 'schnell', severity: 'schnell', count: 2 },
      { label: 'kalorienreich', severity: 'kalorienreich', count: 3 },
      { label: 'vegetarisch', severity: 'vegetarisch', count: 2 },
      { label: 'proteinreich', severity: 'preoteinreich', count: 0 },
    ];*/


}
