import { Component, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-tableiste',
  templateUrl: './tableiste.component.html',
})
export class TableisteComponent {
  activeTab: HTMLElement | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  navigateDatenschutz(event: Event): void {
    this.router.navigate(['/datenschutzerklaerung']);
  }

  logoutUser(event: Event) {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/anmeldung']);
      },
      error: (err) => {
        console.error('Fehler beim Logout', err);
      }
    });
  }

  toggleTooltip(event: MouseEvent): void {
    const button = event.currentTarget as HTMLElement;

    // Toggle 'active' Klasse auf dem aktuellen Button
    if (this.activeTab && this.activeTab !== button) {
      this.activeTab.classList.remove('active');
    }

    if (button.classList.contains('active')) {
      button.classList.remove('active');
      this.activeTab = null;
    } else {
      button.classList.add('active');
      this.activeTab = button;
    }
  }

  protected readonly event = event;
}
