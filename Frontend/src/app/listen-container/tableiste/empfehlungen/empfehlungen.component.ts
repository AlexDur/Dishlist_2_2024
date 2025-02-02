import { Component,Input, HostListener, ChangeDetectorRef, OnChanges, OnInit } from '@angular/core';
import {RezeptService} from "../../../services/rezepte.service";
import {Rezept} from "../../../models/rezepte";
import {Router} from "@angular/router";
import { timeout } from 'rxjs';
import { Subscription } from 'rxjs';
import {TagService} from "../../../services/tags.service";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-empfehlungen',
  templateUrl: './empfehlungen.component.html'
})
export class EmpfehlungenComponent implements OnInit, OnChanges {
  @Input() rezepte: Rezept[] = [];

  private tagsSubscription: Subscription | undefined;

  gefilterteRezepte$: Observable<Rezept[]>;
  isOverlayVisible = false;
  isLoading = false;
  selectedTags: string[] = [];



  constructor(private rezeptService: RezeptService,  private cdr: ChangeDetectorRef, private tagService: TagService, private router: Router) {
    this.gefilterteRezepte$ = this.rezeptService.gefilterteRezepte$;
  }

  ngOnInit(): void {
    this.tagsSubscription = this.tagService.selectedTags$.subscribe(tags => {
      this.selectedTags = tags;
    });
    this.gefilterteRezepte$ = this.rezeptService.gefilterteRezepte$;
  }

  ngOnChanges(): void {
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  closeOverlay(event: Event): void {
    const content = document.querySelector('.overlay-content');
    if (content && !content.contains(event.target as Node)) {
      this.isOverlayVisible = false;
      this.isLoading = false;
    }
  }

  // Verhindert das Schließen des Overlays, wenn innerhalb des Overlays geklickt wird
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  // Öffnet oder schließt das Overlay
  toggleOverlay(event: Event) {
    event.stopPropagation();
    this.isOverlayVisible = !this.isOverlayVisible;

    if (this.isOverlayVisible) {
      this.loadRandomRecipes();
    }
  }

  // Schließt das Overlay, wenn der Schließen-Button geklickt wird
  closeOverlayButton(event: MouseEvent): void {
    this.isOverlayVisible = false;
    event.stopPropagation();
    this.router.navigate(['/listen-container']);
  }

  loadRandomRecipes(): void {
    this.isLoading = true;

    const TIMEOUT_DURATION = 5000;

    this.rezeptService.fetchRandomSpoonacularRezepte().pipe(
      timeout(TIMEOUT_DURATION) // Timeout nach der angegebenen Dauer
    ).subscribe({
      next: (rezepte) => {
        this.rezepte = rezepte.map((rezept) => {
          // Sicherstellen, dass jedes Rezept Tags hat
          if (!rezept.tags) {
            rezept.tags = [];
          }
          return rezept;
        });
        this.isLoading = false;
      },
      error: (error) => {
        if (error.name === 'TimeoutError') {
          console.error('Die Anfrage hat das Zeitlimit überschritten.');
        } else {
          console.error('Fehler beim Abrufen der Rezepte:', error);
        }
        this.isLoading = false;
      }
    });
  }

  openUrlSpoon(url: string): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.error('Ungültige URL: ', url);
    }
  }


  removeRecipe(rezept:Rezept) {

  }

  addRecipe(rezept:Rezept) {
    this.rezeptService.addRezeptToList(rezept);
  /*  this.updateGefilterteRezepte;*/
  }

/*  updateGefilterteRezepte(rezepte: Rezept[]): void {
    this.gefilterteRezepte$.next(rezepte);
  }*/

}
