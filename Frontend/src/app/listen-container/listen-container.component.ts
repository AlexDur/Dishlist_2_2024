import {Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import {Rezept} from "../models/rezepte";
import {RezeptService} from "../services/rezepte.service";
import { Router } from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Tag} from "../models/tag";
import {DEFAULT_TAGS} from "../models/default_tag";

@Component({
  selector: 'app-listen-container',
  templateUrl: './listen-container.component.html'
})

export class ListenContainerComponent implements OnInit{
  @Input() isMobile?: boolean;
  @Output() selectedTagsChange: EventEmitter<string[]> = new EventEmitter<string[]>(); // Output-EventEmitter

  rezepteGeladen: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  rezepte: Rezept[] = [];
  rezepteVerfuegbar = false
  gefilterteRezepte: Rezept[] = [];
  bildUrls: { [key: number]: string } = {};
  searchText: string = '';
  selectedTags: string[] = [];

  constructor(private rezepteService: RezeptService,   private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const abgerufeneBilder = new Set();

    this.rezepteService.getUserRezepte().subscribe(rezepte => {
      this.rezepte = rezepte.map(rezept => ({ ...rezept }));
      this.rezepteGeladen.emit(this.rezepte);
      this.gefilterteRezepte = [...this.rezepte];
      this.rezepteVerfuegbar = true;

      this.selectedTags = [...this.selectedTags];
      console.log('Rezepte geladen, selectedTags bleibt erhalten:', this.selectedTags);
      this.cdr.detectChanges();

      this.gefilterteRezepte.forEach(rezept => {
        if (rezept && rezept.bildUrl){
          const bildname = rezept.bildUrl.split('/').pop();
          if (bildname && !abgerufeneBilder.has(bildname)) {
            abgerufeneBilder.add(bildname);

            // Direkte S3-URL verwenden
            const imageUrl = `https://bonn-nov24.s3.eu-central-1.amazonaws.com/${bildname}`;
            this.bildUrls[rezept.id] = imageUrl;
          }
        }
      });
    });
  }

  applySearchFilter(): void {
    if (this.searchText && Array.isArray(this.gefilterteRezepte)) {
      // Filtere die bereits gefilterten Rezepte weiter nach dem Suchtext
      this.gefilterteRezepte = this.gefilterteRezepte.filter(rezept =>
        rezept.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }


  // Diese Methode wird von der Seitenleiste aufgerufen, wenn die Rezepte gefiltert wurden
  onRezepteFiltered(rezepte: Rezept[]): void {
    this.gefilterteRezepte = rezepte;
    this.applySearchFilter();
  }

  onSelectedTagsChange(selectedTags: string[]): void {
    this.selectedTags = selectedTags;
    console.log('selectedTags in Elternkomponente (onSelectedTagsChange)', selectedTags);
  }


}


