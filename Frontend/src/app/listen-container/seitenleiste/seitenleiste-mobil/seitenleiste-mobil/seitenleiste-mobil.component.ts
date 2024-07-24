import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Rezept } from '../../../../models/rezepte';
import { RezeptService } from '../../../../services/rezepte.service';
import { map, tap } from 'rxjs/operators';
import { Tag } from '../../../../models/tag';

@Component({
  selector: 'app-seitenleiste-mobil',
  templateUrl: './seitenleiste-mobil.component.html',
  styleUrls: ['./seitenleiste-mobil.component.scss']
})
export class SeitenleisteMobilComponent implements OnInit {
  @Output() gefilterteRezepte: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  @Input() rezepte: Rezept[] = [];
  selectedTags: string[] = [];
  rezeptGeladen: boolean = false;
  originalRezepte: Rezept[] = [];

  tags: Tag[] = [
    { label: 'Vorspeise', count: 0, selected: false, type: 'Gerichtart' },
    { label: 'Hauptgang', count: 0, selected: false, type: 'Gerichtart' },
    { label: 'Nachtisch', count: 0, selected: false, type: 'Gerichtart' },
    { label: 'Deutsch', count: 0, selected: false, type: 'Küche' },
    { label: 'Chinesisch', count: 0, selected: false, type: 'Küche' },
    { label: 'Italienisch', count: 0, selected: false, type: 'Küche' },
  ];

  constructor(private rezepteService: RezeptService) {
    this.rezepteService.onRezeptUpdated.subscribe(() => {
      this.updateTagCount();
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
        this.updateTagCount();
      })
    ).subscribe();
  }

  loadRezept(): Promise<void> {
    return new Promise<void>(resolve => {
      this.rezeptGeladen = true;
      resolve();
    });
  }

  trackById(index: number, item: Tag): any {
    return item.id || index;
  }

  resetRezepte(): void {
    this.rezepte = [...this.originalRezepte];
  }

  toggleTag(tag: Tag): void {
    this.updateSelectedTags();
    this.filterRezepte();
  }

  updateSelectedTags(): void {
    this.selectedTags = this.tags.filter(t => t.selected).map(t => t.label);
  }

  filterRezepte(): void {
    if (this.selectedTags.length === 0) {
      this.gefilterteRezepte.emit(this.originalRezepte);
    } else {
      const gefilterteRezepte = this.originalRezepte.filter(rezept =>
        rezept.tags?.some(tag => this.selectedTags.includes(tag.label))
      );
      this.gefilterteRezepte.emit(gefilterteRezepte);
    }
  }

  updateTagCount(): void {
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

  getGerichtartenTags(): Tag[] {
    return this.tags.filter(tag => tag.type === 'Gerichtart');
  }

  getKuechenTags(): Tag[] {
    return this.tags.filter(tag => tag.type === 'Küche');
  }
}
