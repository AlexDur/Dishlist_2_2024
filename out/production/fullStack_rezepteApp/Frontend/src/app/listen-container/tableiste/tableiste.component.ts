import { Component } from '@angular/core';
import { Router } from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {RezepteModule} from "../rezepte.module";

@Component({
  selector: 'app-tableiste',
  standalone: true,
  imports: [
    RezepteModule
  ],
  templateUrl: './tableiste.component.html',
})
export class TableisteComponent {


  constructor(private router: Router, private authService: AuthService) {
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logoutUser(event: Event){
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/anmeldung']);
      },
      error: (err) => {
        console.error('Fehler beim Logout', err);
      }
    });
  }

}
