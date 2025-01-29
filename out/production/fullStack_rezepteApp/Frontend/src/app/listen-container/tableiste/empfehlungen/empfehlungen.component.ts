import { Component, ViewChild, Renderer2, ChangeDetectorRef, HostListener, ElementRef  } from '@angular/core';
import {RezeptService} from "../../../services/rezepte.service";
import {Rezept} from "../../../models/rezepte";
import { timeout } from 'rxjs';

import {dishTypeMapping} from "../../../utils/dishTypeMapping";

@Component({
  selector: 'app-empfehlungen',
  templateUrl: './empfehlungen.component.html'
})
export class EmpfehlungenComponent {
  isOverlayVisible = false;
  isLoading = false;
  rezepte: Rezept[] = [];

  constructor(private rezeptService: RezeptService) { }




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
    event.stopPropagation();  // Verhindert, dass das Ereignis auch das Overlay schließt
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


}
