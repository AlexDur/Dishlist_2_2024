import { Component, HostListener, EventEmitter, Renderer2, Input, ElementRef, ViewChild, OnInit, Output, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { Rezept } from '../../../../models/rezepte';
import { RezeptService } from '../../../../services/rezepte.service';
import { Tag } from '../../../../models/tag';
import { Subscription } from 'rxjs';
import {DEFAULT_TAGS} from "../../../../models/default_tag";

@Component({
  selector: 'app-seitenleiste-mobil',
  templateUrl: './seitenleiste-mobil.component.html'
})
export class SeitenleisteMobilComponent implements OnInit, OnDestroy {
  @Output() gefilterteRezepte: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  @Input() rezepte: Rezept[] = [];
  @Input() isMobile?: boolean;

  @ViewChild('dropdownContent', { static: false }) dropdownContent!: ElementRef;

  selectedTags: string[] = [];
  originalRezepte: Rezept[] = [];
  private subscription: Subscription | undefined;
  tags: Tag[] = [...DEFAULT_TAGS];
  searchText: string = '';
  isOverlayVisible = false;


  //Verwendung des aktuellen Werts von kategorieZaehlerSubject, um Tag-Zähler in Komponente zu aktualsieren
  constructor(private rezepteService: RezeptService, private renderer: Renderer2) {
    this.subscription = this.rezepteService.onRezeptUpdated.subscribe(() => {
      this.updateTagCounts();
    });
  }

  ngOnInit(): void {
    this.subscription = this.rezepteService.rezepte$.subscribe(rezepte  => {
      this.originalRezepte = [...rezepte];
      this.tags= [...DEFAULT_TAGS.map(tag => ({ ...tag, selected: false }))];
      this.resetRezepte();
      this.updateTagCounts();
    });
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  closeOverlay(event: Event): void {
    const content = document.querySelector('.overlay-content');
    if (content && !content.contains(event.target as Node)) {
      this.isOverlayVisible = false;
    }

  }

  closeOverlayButton(event:Event): void {
    this.isOverlayVisible = false;
  }



  toggleOverlay(event: Event): void {
    event.stopPropagation();
    this.isOverlayVisible = !this.isOverlayVisible;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  trackById(index: number, item: Tag): any {
    return item.id || index;
  }

  resetRezepte(): void {
    this.rezepte = [...this.originalRezepte];
  }

  toggleTag(tag: Tag): void {
    this.updateSelectedTags();
    console.log('Selected Tags:', this.selectedTags);
    this.filterRezepte();

  }

  updateSelectedTags(): void {
    this.selectedTags = this.tags.filter(t => t.selected).map(t => t.label);
  }

  onSearchTextChange(): void {
    console.log('Sucheingabe:', this.searchText);

    // Filtere die Rezepte basierend auf dem Suchtext
    let filteredRecipes = this.rezepte.filter(rezept =>
      rezept.name.toLowerCase().includes(this.searchText.toLowerCase())
    );

    // Gib die gefilterten Rezepte zurück
    this.gefilterteRezepte.emit(filteredRecipes);
  }


  filterRezepte(): void {
    // Wenn keine Tags ausgewählt sind, alle Rezepte zurückgeben
    if (this.selectedTags.length === 0) {
      this.gefilterteRezepte.emit(this.originalRezepte);
      return;
    }

    let gefilterteRezepte = [...this.originalRezepte];

    this.selectedTags.forEach(selectedTag => {
      gefilterteRezepte = gefilterteRezepte.filter(rezept =>
        rezept.tags?.some(tag => tag.label === selectedTag)
      );
    });

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
    return this.tags.filter(tag => tag.type === 'Gänge');
  }

  getKuechenTags(): Tag[] {
    return this.tags.filter(tag => tag.type === 'Küche');
  }

  getNaehrwertTags(): Tag[] {
    return this.tags.filter(tag => tag.type == "Nährwert")
  }

}
