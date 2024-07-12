import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-nutzer-anmeldung',
  templateUrl: './nutzer-anmeldung.component.html',
  styleUrls: ['./nutzer-anmeldung.component.scss']
})
export class NutzerAnmeldungComponent {

  constructor(private router:Router) {
  }

  navigateListe(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/listencontainer']);
  }
}
