import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-registrierung',
  templateUrl: './registrierung.component.html',
  styleUrls: ['./registrierung.component.scss']
})
export class RegistrierungComponent {

  constructor(private router:Router) {
  }

  navigateListe(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/listencontainer']);
  }
}
