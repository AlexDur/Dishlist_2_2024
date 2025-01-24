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
  // 1. Eingabe- und Ausgabe-Properties
  @Input() rezepte: Rezept[] = [];
  @Input() isMobile?: boolean;
  @Output() gefilterteRezepte: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();

  // 2. ViewChild-Referenzen
  @ViewChild('dropdownContent', {static: false}) dropdownContent!: ElementRef;

  // 3. Private und geschützte Eigenschaften
  private subscription: Subscription | undefined;
  private searchSubject = new Subject<string>();

  // 4. Öffentliche Eigenschaften
  originalRezepte: Rezept[] = [];
  tags: Tag[] = [...DEFAULT_TAGS];
  searchText: string = '';
  isOverlayVisible = false;
  filteredRecipes: Rezept[] = [];


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


  private updateDynamicTagCounts(rezepte: Rezept[]): void {
    // Zähle Tag-Vorkommen in gefilterten Rezepten
    const zaehler: { [key: string]: number } = {};

    rezepte.forEach(rezept => {
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


  toggleTag(tag: Tag): void {
    tag.selected = !tag.selected;
    this.applyFilters();
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
    this.cdRef.detectChanges();
    this.gefilterteRezepte.emit(this.filteredRecipes);
  }


}
