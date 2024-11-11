import { Component, HostListener, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Rezept } from '../../../../models/rezepte';
import { RezeptService } from '../../../../services/rezepte.service';
import { Tag } from '../../../../models/tag';
import { Subscription } from 'rxjs';
import {DEFAULT_TAGS} from "../../../../models/default_tag.ts";

@Component({
  selector: 'app-seitenleiste-mobil',
  templateUrl: './seitenleiste-mobil.component.html'
})
export class SeitenleisteMobilComponent implements OnInit, OnDestroy {
  @Output() gefilterteRezepte: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  @Input() rezepte: Rezept[] = [];
  selectedTags: string[] = [];
  rezeptGeladen: boolean = false;
  originalRezepte: Rezept[] = [];
  private subscription: Subscription;
  tags: Tag[] = [...DEFAULT_TAGS];
  isDropdownOpen: boolean = false;

  //Verwendung des aktuellen Werts von kategorieZaehlerSubject, um Tag-Zähler in Komponente zu aktualsieren
  constructor(private rezepteService: RezeptService) {
    this.subscription = this.rezepteService.onRezeptUpdated.subscribe(() => {
      this.updateTagCounts();
    });
  }

  toggleDropdown(event: MouseEvent): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    event.stopPropagation(); // Verhindert das Schließen beim Klicken auf den Button
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdownContent = document.querySelector('.dropdown-content');

    // Überprüfen, ob der Klick außerhalb des Dropdowns erfolgt ist
    if (this.isDropdownOpen && dropdownContent && !dropdownContent.contains(target)) {
      this.isDropdownOpen = false;
    }
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
