import { Component, ViewChild, Renderer2, ChangeDetectorRef, HostListener, ElementRef  } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import {filter, take } from 'rxjs/operators';
import {RezeptService} from "../../services/rezepte.service";
import { Subscription } from 'rxjs';
import {Rezept} from "../../models/rezepte";

@Component({
  selector: 'app-tableiste',
  templateUrl: './tableiste.component.html',
})
export class TableisteComponent {

  @ViewChild('dropdownContent', { static: false }) dropdownContent!: ElementRef;

  activeTab: HTMLElement | null = null;
  isOverlayVisible = false;
  private subscription: Subscription | undefined;
  rezepte: Rezept[] = [];
  isLoading = false;

  constructor(private rezeptService: RezeptService, private renderer: Renderer2, private router: Router, private authService: AuthService) {

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  navigateDatenschutz(event: Event): void {
    console.log('geklickt', event)
    this.router.navigate(['/datenschutzerklaerung']);
  }

  navigateListe(event: Event): void {
    this.router.navigate(['/listen-container']);
  }

  logoutUser(event: Event) {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.setIsAuthenticated(false);
        this.authService.isAuthenticated$.pipe(
          filter((isAuthenticated: any) => !isAuthenticated), // Warten, bis false ist
          take(1)
        ).subscribe(() => {
          this.router.navigate(['/anmeldung']);
        });
      },
      error: (err) => {
        console.error('Fehler beim Logout', err);
      }
    });
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
    event.stopPropagation();  // Verhindert, dass das Ereignis auch das Overlay schließt
  }

  loadRandomRecipes(): void {
    this.isLoading = true;

    this.rezeptService.fetchRandomSpoonacularRezepte().subscribe({
      next: (rezepte) => {
        this.rezepte = rezepte; // Rezepte setzen
        this.isLoading = false; // Ladeanzeige ausblenden
      },
      error: (error) => {
        console.error('Fehler beim Abrufen der Rezepte:', error);
        this.isLoading = false; // Fehlerfall behandeln
      }
    });
  }


  protected readonly event = event;
}
