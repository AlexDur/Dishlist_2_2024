import { Component, HostListener, EventEmitter, OnChanges, SimpleChanges, Input, ElementRef, ViewChild, OnInit, Output, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { Rezept } from '../../../../models/rezepte';
import { RezeptService } from '../../../../services/rezepte.service';
import { Tag } from '../../../../models/tag';
import { Subscription } from 'rxjs';
import {DEFAULT_TAGS} from "../../../../models/default_tag";
import { debounceTime, distinctUntilChanged  } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {TagService} from "../../../../services/tags.service";

@Component({
  selector: 'app-seitenleiste-mobil',
  templateUrl: './seitenleiste-mobil.component.html'
})
export class SeitenleisteMobilComponent implements OnInit, OnDestroy, OnChanges {
  // 1. Eingabe- und Ausgabe-Properties
  @Input() rezepte: Rezept[] = [];
  @Input() isMobile?: boolean;
  @Output() gefilterteRezepte: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();

  // 2. ViewChild-Referenzen
  @ViewChild('dropdownContent', {static: false}) dropdownContent!: ElementRef;

  // 3. Private und geschützte Eigenschaften
  /*private subscription: Subscription | undefined;*/
  private searchSubject = new Subject<string>();

  // 4. Öffentliche Eigenschaften
  subscription: Subscription = new Subscription();
  originalRezepte: Rezept[] = [];
  tags: Tag[] = [...DEFAULT_TAGS];
  searchText: string = '';
  isOverlayVisible = false;
  filteredRecipes: Rezept[] = [];
  selectedTags: string[] = [];

  //Verwendung des aktuellen Werts von kategorieZaehlerSubject, um Tag-Zähler in Komponente zu aktualsieren
  constructor(private rezepteService: RezeptService,  private tagService: TagService, private cdRef: ChangeDetectorRef) {
    this.subscription = this.rezepteService.onRezeptUpdated.subscribe(() => {
      this.updateTagCounts(this.originalRezepte);
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.tagService.selectedTags$.subscribe(tags => {
        this.selectedTags = tags;  // Updates when selectedTags change
        console.log('Aktualisierte ausgewählte Tags:', this.selectedTags);
        this.applyFilters();
      })
    );


    this.subscription = this.rezepteService.rezepte$.subscribe(rezepte => {
      this.originalRezepte = [...rezepte];
      this.resetRezepte();
      this.updateTagCounts(this.originalRezepte);
    });


    // Debounce für Suchtext
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged() // Nur Emmission, wenn Suchtext sich ändert
      )
      .subscribe(searchText => {
        this.applyFilters();
      });

    this.tagService.setSelectedTags(this.tags.filter(tag => tag.selected).map(tag => tag.label));

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTags']) {
      // Update tags' selected state based on selectedTags
      this.updateTagsSelection();

    }
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

    if (this.isOverlayVisible) {
      // Update the selected state of tags when the overlay is opened
      this.tags.forEach(tag => {
        tag.selected = this.selectedTags.includes(tag.label);
      });
      console.log('Overlay geöffnet, selectedTags:', this.selectedTags);
    }
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


  private updateTagCounts(rezepte: Rezept[]): void {
    const zaehler: { [key: string]: number } = {};

    // Zähle Tags basierend auf den Rezepten
    rezepte.forEach(rezept => {
      rezept.tags?.forEach(tag => {
        if (tag && tag.label) {
          zaehler[tag.label] = (zaehler[tag.label] || 0) + 1;
        }
      });
    });

    // Update tags mit den gezählten Werten
    this.updateTagsWithCounts(zaehler);
  }

  private updateTagsWithCounts(zaehler: { [key: string]: number }): void {
    this.tags.forEach(tag => {
      tag.count = zaehler[tag.label] || 0;
      tag.disabled = tag.count === 0 && !tag.selected;
    });
  }

  //Zur Filterung der Tags
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


  toggleTagInSidebar(tag: Tag): void {
    this.tagService.toggleTag(tag.label);
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredRecipes = this.originalRezepte.filter(rezept => {
      const matchesSearch = !this.searchText || rezept.name.toLowerCase().includes(this.searchText.toLowerCase());

      if (!matchesSearch) return false;

      if (this.selectedTags.length === 0) return true;

      return this.selectedTags.every(selectedTag =>
        rezept.tags?.some(rTag => rTag.label === selectedTag)
      );
    });

    this.updateTagCounts(this.filteredRecipes);
    this.cdRef.detectChanges();
    this.gefilterteRezepte.emit(this.filteredRecipes);
  }

  private updateTagsSelection(): void {

    this.tags.forEach(tag => {
      tag.selected = this.selectedTags.includes(tag.label);
    });
  }
}
