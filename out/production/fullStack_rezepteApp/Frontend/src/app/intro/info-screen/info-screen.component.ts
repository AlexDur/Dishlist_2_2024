import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-info-screen',
  templateUrl: './info-screen.component.html'
})
export class InfoScreenComponent implements OnInit {

  constructor(private router:Router) {
  }

  ngOnInit() {
    // Prüfe, ob der Info-Screen schon einmal angezeigt wurde
    const isFirstLaunch = localStorage.getItem('isFirstLaunch');

    // Wenn nicht der erste Start, direkt zur Anmeldung weiterleiten
    if (isFirstLaunch) {
      this.router.navigate(['/anmeldung']);
    }
  }

  navigateAnmeldung(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/anmeldung']);
  }
}
