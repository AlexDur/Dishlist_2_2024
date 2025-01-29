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
  private subscription: Subscription | undefined;
  rezepte: Rezept[] = [];


  constructor(private router: Router, private authService: AuthService) {

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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

  protected readonly event = event;
}
