import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-info-screen',
  templateUrl: './info-screen.component.html'
})
export class InfoScreenComponent {

  constructor(private router:Router) {
  }

  navigateAnmeldung(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/anmeldung']);
  }
}
