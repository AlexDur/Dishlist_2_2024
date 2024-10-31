import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Rezept } from '../../../../models/rezepte';
import { RezeptService } from '../../../../services/rezepte.service';
import { Tag } from '../../../../models/tag';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seitenleiste-mobil',
  templateUrl: './seitenleiste-mobil.component.html',
  styleUrls: ['./seitenleiste-mobil.component.scss']
})
export class SeitenleisteMobilComponent implements OnInit, OnDestroy {
  @Output() gefilterteRezepte: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  @Input() rezepte: Rezept[] = [];
  selectedTags: string[] = [];
  rezeptGeladen: boolean = false;
  originalRezepte: Rezept[] = [];
  private subscription: Subscription;

  tags: Tag[] = [
    { label: 'Vorspeise', count: 0, selected: false, type: 'Gerichtart' },
    { label: 'Hauptgang', count: 0, selected: false, type: 'Gerichtart' },
    { label: 'Nachtisch', count: 0, selected: false, type: 'Gerichtart' },
    { label: 'Deutsch', count: 0, selected: false, type: 'Küche' },
    { label: 'Chinesisch', count: 0, selected: false, type: 'Küche' },
    { label: 'Italienisch', count: 0, selected: false, type: 'Küche' },
  ];

  //Verwendung des aktuellen Werts von kategorieZaehlerSubject, um Tag-Zähler in Komponente zu aktualsieren
  constructor(private rezepteService: RezeptService) {
    this.subscription = this.rezepteService.onRezeptUpdated.subscribe(() => {
      this.updateTagCounts();
    });
  }

  ngOnInit(): void {
    this.subscription = this.rezepteService.rezepte$.subscribe(rezepte  => {
      this.originalRezepte = [...rezepte];
      this.resetRezepte();
      this.updateTagCounts();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
    // Wenn keine Tags ausgewählt sind, alle Rezepte zurückgeben
    if (this.selectedTags.length === 0) {
      this.gefilterteRezepte.emit(this.originalRezepte);
      return;
    }

    // Beginne mit den originalen Rezepten als Ausgangspunkt
    let gefilterteRezepte = [...this.originalRezepte];

    // Filtere basierend auf jedem ausgewählten Tag
    this.selectedTags.forEach(selectedTag => {
      gefilterteRezepte = gefilterteRezepte.filter(rezept =>
        rezept.tags?.some(tag => tag.label === selectedTag)
      );
    });

    // Gebe die gefilterten Rezepte aus
    this.gefilterteRezepte.emit(gefilterteRezepte);
  }


  private updateTagCounts(): void {
    const zaehler: { [key: string]: number } = {};
    this.originalRezepte.forEach(rezept => {
      rezept.tags?.forEach(tag => {
        if (tag && tag.label) {
          const kategorieName = tag.label;
          zaehler[kategorieName] = (zaehler[kategorieName] || 0) + 1;
        }
      });
    });

    this.tags.forEach(tag => {
      tag.count = zaehler[tag.label] || 0;
    });
  }

  getGerichtartenTags(): Tag[] {
    return this.tags.filter(tag => tag.type === 'Gerichtart');
  }

  getKuechenTags(): Tag[] {
    return this.tags.filter(tag => tag.type === 'Küche');
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
}
