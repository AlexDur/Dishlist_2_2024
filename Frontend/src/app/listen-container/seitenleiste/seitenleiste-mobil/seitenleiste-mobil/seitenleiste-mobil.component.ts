import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
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
  constructor(private rezepteService: RezeptService,  private tagService: TagService, private uiService: UserInterfaceService, private listenAnsichtService: ListenansichtService) {
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
      this.updateTagsSelection();

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
    this.isProcessing = true;

    this.listenAnsichtService.verbergeButtons();

    setTimeout(() => {
      this.isProcessing = false;
    }, 300);
  }



  toggleTagInSidebar(tag: Tag): void {
    this.tagService.toggleTag(tag.label);
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

  resetRezepte(): void {
    this.rezepte = [...this.originalRezepte];
  }

  private updateTagCounts(rezepte: Rezept[]): void {
    const zaehler: { [key: string]: number } = {};

    rezepte.forEach(rezept => {
      rezept.tags?.forEach(tag => {
        if (tag && tag.label) {
          zaehler[tag.label] = (zaehler[tag.label] || 0) + 1;
        } else {
          console.warn(` Rezept "${rezept.name}" enthält einen ungültigen Tag:`, tag);
        }
      });
    });

    this.updateTagsWithCounts(zaehler);
  }



  private updateTagsWithCounts(zaehler: { [key: string]: number }): void {
    this.tags.forEach(tag => {
      tag.count = zaehler[tag.label] || 0;
    });
  }

  //Zur Filterung der Tags
  getGerichtartenTags(): Tag[] {
    return this.tags.filter(tag => tag.type === 'Mahlzeit');
  }
  getKuechenTags(): Tag[] {
    return this.tags.filter(tag => tag.type === 'Landesküche');
  }
  getErnaehrungsweiseTags(): Tag[] {
    return this.tags.filter(tag => tag.type == "Ernährungsweise")
  }



  applyFilters(): void {
    this.rezepteService.getFilteredRezepte(this.selectedTags, this.searchText).subscribe(filteredRecipes => {
      this.filteredRecipes = filteredRecipes;
      this.updateTagCounts(this.filteredRecipes);
    });

  }

  private updateTagsSelection(): void {
    this.tags.forEach(tag => {
      tag.selected = this.selectedTags.includes(tag.label);
    });
  }
}
