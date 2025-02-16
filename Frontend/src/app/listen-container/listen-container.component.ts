import {Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import {Rezept} from "../models/rezepte";
import {RezeptService} from "../services/rezepte.service";
import { Subscription } from 'rxjs';
import {TagService} from "../services/tags.service";

@Component({
  selector: 'app-listen-container',
  templateUrl: './listen-container.component.html'
})

export class ListenContainerComponent implements OnInit{
  @Input() isMobile?: boolean;
  @Output() selectedTagsChange: EventEmitter<string[]> = new EventEmitter<string[]>(); // Output-EventEmitter

  //wird verwendet (obwohl ausgegraut)
  private tagsSubscription: Subscription | undefined;

  rezepteGeladen: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  rezepte: Rezept[] = [];
  rezepteVerfuegbar = false
  gefilterteRezepte: Rezept[] = [];
  bildUrls: { [key: number]: string } = {};
  searchText: string = '';
  selectedTags: string[] = [];
  selectedTagsInSidebar: boolean = false;


  constructor(private rezepteService: RezeptService, private tagService: TagService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    const abgerufeneBilder = new Set();

    // Abonniere die ausgewählten Tags
    this.tagsSubscription = this.tagService.selectedTags$.subscribe(tags => {
      this.selectedTags = tags;
      // Sobald die Tags geändert werden, wende die Filter an
      this.applyFilters(); // Filter anwenden, wenn Tags sich ändern
    });

    // Abrufen der Rezepte
    this.rezepteService.getUserRezepte().subscribe(rezepte => {
      this.rezepte = rezepte.map(rezept => ({ ...rezept }));
      this.rezepteGeladen.emit(this.rezepte);

      // Anfangswerte für gefilterte Rezepte setzen
      this.gefilterteRezepte = [...this.rezepte];
      this.rezepteVerfuegbar = true;

      this.selectedTags = [...this.selectedTags];
      this.cdr.detectChanges();

      // Bilder für die Rezepte laden
      this.gefilterteRezepte.forEach(rezept => {
        if (rezept && rezept.bildUrl) {
          const bildname = rezept.bildUrl.split('/').pop();
          if (bildname && !abgerufeneBilder.has(bildname)) {
            abgerufeneBilder.add(bildname);

            // Direkte S3-URL verwenden
            const imageUrl = `https://bonn-nov24.s3.eu-central-1.amazonaws.com/${bildname}`;
            this.bildUrls[rezept.id] = imageUrl;
          }
        }
      });

      // Wende Filter direkt nach dem Abrufen der Rezepte an
      this.applyFilters();
    });
  }

// Filter anwenden
  applyFilters(): void {
    this.applySearchFilter();
    this.applyTagFilter();
  }

// Filter nach Suchtext anwenden
  applySearchFilter(): void {
    if (this.searchText && Array.isArray(this.gefilterteRezepte)) {
      // Filtere die bereits gefilterten Rezepte weiter nach dem Suchtext
      this.gefilterteRezepte = this.gefilterteRezepte.filter(rezept =>
        rezept.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

// Filter nach Tags anwenden
  applyTagFilter(): void {
    if (Array.isArray(this.selectedTags) && this.selectedTags.length > 0) {
      // Filtere die Rezepte basierend auf den Tags
      this.gefilterteRezepte = this.gefilterteRezepte.filter(rezept =>
        this.selectedTags.every(tag => rezept.tags?.some(rTag => rTag.label === tag))
      );
    }
  }

  onSelectedTagsInSidebarChange(isInSidebar: boolean): void {
    console.log('selectedTagsInSidebar geändert:', isInSidebar);
    // Weitere Logik basierend auf dem Wert von isInSidebar
  }

}


