import { Component, HostListener, EventEmitter, Input, ViewChild, OnInit, Output, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
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
  @ViewChild('op') op!: OverlayPanel;
  selectedTags: string[] = [];
  rezeptGeladen: boolean = false;
  originalRezepte: Rezept[] = [];
  private subscription: Subscription;
  tags: Tag[] = [...DEFAULT_TAGS];
  isDropdownOpen: boolean = false;
  searchText: string = '';
  isSearchVisible: boolean = false;

  //Verwendung des aktuellen Werts von kategorieZaehlerSubject, um Tag-Zähler in Komponente zu aktualsieren
  constructor(private rezepteService: RezeptService, private cdr: ChangeDetectorRef) {
    this.subscription = this.rezepteService.onRezeptUpdated.subscribe(() => {
      this.updateTagCounts();
    });
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdownContent = document.querySelector('.dropdown-content');
    const filterButton = document.querySelector('.filter-button-container');
    const isInsideOverlay = this.op?.el.nativeElement.contains(target);

    // Prüft, ob der Klick auf eine Checkbox oder innerhalb des Dropdowns erfolgte
    const isClickInside = dropdownContent?.contains(target) || isInsideOverlay;

    if (this.isDropdownOpen && !isClickInside) {
      this.op.hide();
      this.isDropdownOpen = false;
    }
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

  loadRezept(): Promise<void> {
    return new Promise<void>(resolve => {
      this.rezeptGeladen = true;
      resolve();
    });
  }

  closeOverlay(): void {
    this.op.hide(); // Schließt das Overlay
    this.isDropdownOpen = false; // Setzt den Status auf "geschlossen"
  }

  toggleDropdown(event: MouseEvent): void {
    console.log('Dropdown toggled:', this.isDropdownOpen);
    if (this.isDropdownOpen) {
      this.op.hide(); // Schließt das Overlay
      this.isDropdownOpen = false;
      // Entferne die 'active' Klasse vom Button, wenn das Overlay geschlossen wird
      this.updateFilterButtonState(false);
    } else {
      this.op.show(event); // Öffnet das Overlay
      this.isDropdownOpen = true;
      // Füge die 'active' Klasse zum Button hinzu, wenn das Overlay geöffnet wird
      this.updateFilterButtonState(true);
    }
    event.stopPropagation(); // Verhindert das Schließen beim Klick
  }


  updateFilterButtonState(isActive: boolean): void {
    const filterButton = document.querySelector('.filter-button');
    if (filterButton) {
      if (isActive) {
        filterButton.classList.add('active');
      } else {
        filterButton.classList.remove('active');
      }
    }
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

  onSearch(): void {
    console.log('Sucheingabe:', this.searchText);
    let filteredRecipes = this.rezepte.filter(rezept =>
      rezept.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.gefilterteRezepte.emit(filteredRecipes); // Gibt die gefilterten Rezepte an das Elternteil weiter
  }

  toggleSearch() {
    console.log('toggleSearch aufgerufen,searchVisible', this.isSearchVisible)
    this.isSearchVisible = !this.isSearchVisible;
    this.cdr.detectChanges();
    console.log('Nach Toggle, isSearchVisible:', this.isSearchVisible);
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
    return this.tags.filter(tag => tag.type === 'Gänge');
  }

  getKuechenTags(): Tag[] {
    return this.tags.filter(tag => tag.type === 'Küche');
  }

  getNaehrwertTags(): Tag[] {
    return this.tags.filter(tag => tag.type == "Nährwert")
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
