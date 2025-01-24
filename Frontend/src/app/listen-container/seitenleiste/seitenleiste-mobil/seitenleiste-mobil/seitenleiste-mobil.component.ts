import { Component, HostListener, EventEmitter, Renderer2, Input, ElementRef, ViewChild, OnInit, Output, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { Rezept } from '../../../../models/rezepte';
import { RezeptService } from '../../../../services/rezepte.service';
import { Tag } from '../../../../models/tag';
import { Subscription } from 'rxjs';
import {DEFAULT_TAGS} from "../../../../models/default_tag";
import { debounceTime, distinctUntilChanged  } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-seitenleiste-mobil',
  templateUrl: './seitenleiste-mobil.component.html'
})
export class SeitenleisteMobilComponent implements OnInit, OnDestroy {
  @Output() gefilterteRezepte: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  @Input() rezepte: Rezept[] = [];
  @Input() isMobile?: boolean;

  @ViewChild('dropdownContent', {static: false}) dropdownContent!: ElementRef;

  selectedTags: string[] = [];
  originalRezepte: Rezept[] = [];
  private subscription: Subscription | undefined;
  tags: Tag[] = [...DEFAULT_TAGS];
  searchText: string = '';
  isOverlayVisible = false;

  filteredRecipes: Rezept[] = [];

  private searchSubject = new Subject<string>();


  //Verwendung des aktuellen Werts von kategorieZaehlerSubject, um Tag-Zähler in Komponente zu aktualsieren
  constructor(private rezepteService: RezeptService, private cdRef: ChangeDetectorRef) {
    this.subscription = this.rezepteService.onRezeptUpdated.subscribe(() => {
      this.updateTagCounts();
    });
  }

  ngOnInit(): void {
    this.subscription = this.rezepteService.rezepte$.subscribe(rezepte => {
      this.originalRezepte = [...rezepte];
      this.tags = [...DEFAULT_TAGS.map(tag => ({...tag, selected: false, disabled: false}))];
      this.resetRezepte();
      this.updateTagCounts();
    });
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged() // Only emit if the search text actually changes
      )
      .subscribe(searchText => {
        this.applyFilters(); // Call a combined filtering function
      });

    this.rezepteService.rezepte$.subscribe(rezepte => {
      this.originalRezepte = rezepte;
      this.filteredRecipes = rezepte; // Initialize filteredRecipes
      this.updateTagCounts(); // Important to update counts initially
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

  closeOverlayButton(event: Event): void {
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


  updateSelectedTags(): void {
    this.selectedTags = this.tags
      .filter(tag => tag.selected)
      .map(tag => tag.label);
  }


  // originalRezepte = die ungefilterte Gesamtheit
  filterRezepte(): void {
    // Wenn keine Tags ausgewählt sind, zeige alle Rezepte
    if (this.selectedTags.length === 0) {
      this.gefilterteRezepte.emit(this.originalRezepte);
      this.updateDynamicTagCounts(this.originalRezepte);
      return;
    }

    // Gruppiere Tags nach Kategorien
    const selectedTagsByCategory = {
      'Gänge': this.getGerichtartenTags().filter(t => t.selected).map(t => t.label),
      'Küche': this.getKuechenTags().filter(t => t.selected).map(t => t.label),
      'Nährwert': this.getNaehrwertTags().filter(t => t.selected).map(t => t.label)
    };

    // Filtere Rezepte basierend auf ausgewählten Tags
    let gefilterteRezepte = this.originalRezepte.filter(rezept => {
      // Prüfe jede Kategorie
      for (const [category, selectedTags] of Object.entries(selectedTagsByCategory)) {
        if (selectedTags.length > 0) {
          // Wenn Tags in dieser Kategorie ausgewählt sind
          const matchingTag = rezept.tags?.find(tag =>
            selectedTags.includes(tag.label) && tag.type === category
          );

          // Wenn kein passender Tag gefunden wird, rausfiltern
          if (!matchingTag) {
            return false;
          }
        }
      }
      return true;
    });

    // Sende gefilterte Rezepte
    this.gefilterteRezepte.emit(gefilterteRezepte);

    // Aktualisiere dynamische Tag-Zähler
    this.updateDynamicTagCounts(gefilterteRezepte);
  }


  private updateDynamicTagCounts(filteredRecipes: Rezept[]): void {
    // Zähle Tag-Vorkommen in gefilterten Rezepten
    const zaehler: { [key: string]: number } = {};

    filteredRecipes.forEach(rezept => {
      rezept.tags?.forEach(tag => {
        if (tag && tag.label) {
          zaehler[tag.label] = (zaehler[tag.label] || 0) + 1;
        }
      });
    });

    // Aktualisiere Tag-Zähler und Verfügbarkeit für ALLE Tags
    [
      ...this.getGerichtartenTags(),
      ...this.getKuechenTags(),
      ...this.getNaehrwertTags()
    ].forEach(tag => {
      // Zähle nur Tags in den gefilterten Rezepten
      tag.count = zaehler[tag.label] || 0;

      // Deaktiviere Tags mit 0 Vorkommen, außer sie sind bereits ausgewählt
      tag.disabled = tag.count === 0 && !tag.selected;
    });
  }

  private updateTagCounts(): void {
    const zaehler: { [key: string]: number } = {};

    // Zähle Tags basierend auf den aktuell gefilterten Rezepten
    this.rezepte.forEach(rezept => {
      rezept.tags?.forEach(tag => {
        if (tag && tag.label) {
          zaehler[tag.label] = (zaehler[tag.label] || 0) + 1;
        }
      });
    });

    this.tags.forEach(tag => {
      tag.count = zaehler[tag.label] || 0;
      tag.disabled = tag.count === 0;
    });
  }

  toggleTag(tag: Tag): void {
    tag.selected = !tag.selected;
    this.applyFilters();
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


  onSearchTextChange(): void {
    this.searchSubject.next(this.searchText);
  }

  onCheckboxChange(tag: Tag, event: any): void {
    tag.selected = event.checked; // Manually update the tag's selected state
    this.applyFilters(); // Immediately apply filters
    // No need for cdRef.detectChanges() here
  }

  applyFilters(): void {
    const selectedTags = this.tags.filter(tag => tag.selected).map(tag => tag.label);

    this.filteredRecipes = this.originalRezepte.filter(rezept => {
      const matchesSearch = !this.searchText || rezept.name.toLowerCase().includes(this.searchText.toLowerCase());

      if (!matchesSearch) return false;

      // Wenn keine Tags ausgewählt sind, zeige das Rezept
      if (selectedTags.length === 0) return true;

      // Prüfe, ob das Rezept alle ausgewählten Tags enthält
      return selectedTags.every(selectedTag =>
        rezept.tags?.some(rTag => rTag.label === selectedTag)
      );
    });

    this.updateDynamicTagCounts(this.filteredRecipes);
    this.gefilterteRezepte.emit(this.filteredRecipes);
    this.cdRef.detectChanges(); // Erzwinge die Aktualisierung der Ansicht
  }


}
