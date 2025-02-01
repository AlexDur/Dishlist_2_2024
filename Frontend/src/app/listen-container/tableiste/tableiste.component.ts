import { Component, ViewChild, OnInit, Renderer2, ChangeDetectorRef, HostListener, ElementRef  } from '@angular/core';
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
export class TableisteComponent implements OnInit{
  @ViewChild('dropdownContent', { static: false }) dropdownContent!: ElementRef;

  activeTab: number = 2;
  rezepte: Rezept[] = [];


  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    const savedTab = localStorage.getItem('activeTab');
    this.activeTab = savedTab ? parseInt(savedTab, 10) : 2;
  }

  navigateListe(event: Event): void {
    event.preventDefault();
    this.setActiveTab(2);
    this.router.navigate(['/listen-container']);
  }

  setActiveTab(index: number) {
    this.activeTab = index;
    localStorage.setItem('activeTab', index.toString());
  }

  logoutUser(event: Event)  {
    event.preventDefault();
    this.setActiveTab(-1);
    localStorage.removeItem('activeTab');
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
