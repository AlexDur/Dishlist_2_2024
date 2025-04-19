import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {Rezept} from '../../../../models/rezepte';
import {RezeptService} from '../../../../services/rezepte.service';
import {Tag} from '../../../../models/tag';
import {Subject, Subscription} from 'rxjs';
import {DEFAULT_TAGS} from "../../../../models/default_tag";
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {TagService} from "../../../../services/tags.service";
import { ListenansichtService} from "../../../../services/listenansicht.service";
import {UserInterfaceService} from "../../../../services/userInterface.service";
import { SimpleChanges, OnChanges, ChangeDetectorRef  } from '@angular/core';

@Component({
  selector: 'app-seitenleiste-mobil',
  templateUrl: './seitenleiste-mobil.component.html'
})
export class SeitenleisteMobilComponent implements OnInit, OnDestroy, OnChanges {
  // 1. Eingabe- und Ausgabe-Properties
  @Input() rezepte: Rezept[] = [];

  // 2. ViewChild-Referenzen
  @ViewChild('dropdownContent', {static: false}) dropdownContent!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;

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
  isMobile: boolean = false;
  isSearchFieldVisible: boolean = false;
  isProcessing: boolean = false;
  isGridActive = false;
  seletedTagInSidebar: boolean = false


  //Verwendung des aktuellen Werts von kategorieZaehlerSubject, um Tag-Zähler in Komponente zu aktualsieren
  constructor(private rezepteService: RezeptService,  private tagService: TagService, private uiService: UserInterfaceService, private listenAnsichtService: ListenansichtService, private cdr: ChangeDetectorRef) {
    this.subscription = this.rezepteService.onRezeptUpdated.subscribe(() => {
      this.updateTagCounts(this.originalRezepte);
    });
  }

  ngOnInit(): void {
      this.subscription.add(
      this.tagService.selectedTags$.subscribe(tags => {
        this.selectedTags = tags;
        this.applyFilters();
      })
    );

    this.listenAnsichtService.spaltenAnzahl$.subscribe(spaltenAnzahl => {
      if (spaltenAnzahl === 4) {
        this.listenAnsichtService.setzeButtonsVerbergen(true);
      }
    });

    this.uiService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
      console.log('isMobile geändert:', isMobile);
    });

    this.subscription.add(
      this.rezepteService.rezepte$.subscribe(rezepte => {
        this.originalRezepte = [...rezepte];
        this.resetFilteredRezepte();
        this.updateTagCounts(this.originalRezepte);
        this.cdr.detectChanges();
      })
    );

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
    if (changes['tags']) {
      this.updateTagCounts(this.rezepte); // Tags und Zähler aktualisieren
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleSearchField() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.isSearchFieldVisible = !this.isSearchFieldVisible;

    setTimeout(() => {
      if (this.isSearchFieldVisible && this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
      this.isProcessing = false;
    }, 300); // 300ms Verzögerung
  }

  toggleGrid() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.isGridActive = !this.isGridActive;
    this.listenAnsichtService.wechselSpaltenanzahl();

    setTimeout(() => {
      this.isProcessing = false;
    }, 300);
  }

  onSearchTextChange(): void {
    this.searchSubject.next(this.searchText);
  }

  toggleCardView() {
    if (this.isProcessing || this.isGridActive) return;
    this.isProcessing = true;

    this.listenAnsichtService.verbergeButtons();

    setTimeout(() => {
      this.isProcessing = false;
    }, 300);
  }

  toggleTagInSidebar(tag: Tag) {
    tag.selected = !tag.selected;
    console.log(`Tag "${tag.label}" ausgewählt: ${tag.selected}`);


    if (tag.selected) {
      this.selectedTags.push(tag.label);
    } else {
      this.selectedTags = this.selectedTags.filter(t => t !== tag.label);
    }

    this.tagService.setSelectedTags(this.selectedTags);

    this.updateTagCounts(this.rezepte);
    this.applyFilters();
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
      this.updateTagsSelection();
    }
  }


  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  trackById(index: number, item: Tag): any {
    return item.id || index;
  }

  resetFilteredRezepte(): void {
    this.rezepte = [...this.originalRezepte];
  }

  private updateTagCounts(rezepte: Rezept[]): void {
    const zaehler: { [key: string]: number } = {};

    rezepte.forEach(rezept => {
      rezept.tags?.forEach(tag => {
        if (tag?.id != null) {
          zaehler[tag.id] = (zaehler[tag.id] || 0) + 1;
        }
      });
    });

    this.tags.forEach(tag => {
      tag.count = zaehler[tag.id] || 0;
    });


  }


 /* private updateTagsWithCounts(rezepte: Rezept[]): void {
    // Definiert einen Zähler mit einem Index-Typ für Strings und Werten vom Typ Number
    const zaehler: { [key: string]: number } = {};

    // Alle Rezepte durchgehen und Tag-Zähler erhöhen
    rezepte.forEach(rezept => {
      rezept.tags?.forEach(tag => {
        if (tag && tag.label) {
          // Loggt die Tags, um zu sehen, ob sie richtig durchlaufen werden
          console.log('Tag gefunden:', tag.label);

          // Erhöht die Zählung des Tags
          zaehler[tag.label] = (zaehler[tag.label] || 0) + 1;
        }
      });
    });

    // Tags mit den neuen Zählwerten aktualisieren
    this.tags.forEach(tag => {
      tag.count = zaehler[tag.label] || 0;
    });

  }*/


  //Zur Filterung der Tags
  getGerichtartenTags() {
    const tags = this.tags.filter(tag => tag.type === 'Mahlzeit');
    return tags;
  }


  getKuechenTags() {
    return this.tags.filter(tag => tag.type === 'Landesküche');
  }

  getErnaehrungsweiseTags() {
    return this.tags.filter(tag => tag.type === 'Ernährungsweise');
  }

  applyFilters(): void {
    this.rezepteService.getFilteredRezepte(this.selectedTags, this.searchText).subscribe({
      next: (filteredRecipes) => {
        this.filteredRecipes = filteredRecipes;
        this.updateTagCounts(filteredRecipes); // Hier muss der Zähler angewendet werden
      },
      error: (err) => {
        console.error("Fehler beim Filtern der Rezepte:", err);
      }
    });
  }


  private updateTagsSelection(): void {
    this.tags.forEach(tag => {
      tag.selected = this.selectedTags.includes(String(tag.id));
    });
  }
}
