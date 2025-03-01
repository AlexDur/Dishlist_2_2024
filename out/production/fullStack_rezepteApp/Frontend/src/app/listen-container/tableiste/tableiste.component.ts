import { Component, ViewChild, OnInit, OnDestroy, ElementRef  } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import {filter, take } from 'rxjs/operators';
import { TabService } from '../../services/tab.service';
import {Rezept} from "../../models/rezepte";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tableiste',
  templateUrl: './tableiste.component.html',
})
export class TableisteComponent implements OnInit, OnDestroy {
  @ViewChild('dropdownContent', { static: false }) dropdownContent!: ElementRef;
  private activeTabSubscription!: Subscription;

  activeTab: number = 2;
  rezepte: Rezept[] = [];


  constructor(private router: Router, private authService: AuthService, private tabService: TabService) { }

  ngOnInit() {
    this.activeTabSubscription = this.tabService.activeTab$.subscribe(tab => {
      this.activeTab = tab;
    });
  }

  ngOnDestroy(): void {
    if (this.activeTabSubscription) {
      this.activeTabSubscription.unsubscribe();
    }
  }

  navigateListe(event: Event): void {
    event.preventDefault();
    this.tabService.setActiveTab(2);
    this.router.navigate(['/listen-container']);
  }


  /*logoutUser(event: Event)  {
    console.log('Logout angestoßen in Komponente')
    event.preventDefault();
    this.tabService.setActiveTab(-1);
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
  }*/

}
