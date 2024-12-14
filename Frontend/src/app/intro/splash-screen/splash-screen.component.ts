import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html'
})
export class SplashScreenComponent implements OnInit{

  constructor(private router: Router) {}

  ngOnInit() {
    const isFirstLaunch = localStorage.getItem('isFirstLaunch');
    console.log('isFirstLaunch:', isFirstLaunch);

    if (!isFirstLaunch) {
      console.log('Erster Start');
      localStorage.setItem('isFirstLaunch', 'false');
      this.router.navigate(['/intro']);
    } else {
      this.router.navigate(['/anmeldung']);
    }
  }

  navigateIntro(event: MouseEvent): void {
    event.preventDefault();

    // Füge die Fade-Out-Klasse hinzu, um die Animation zu starten
    const splashScreen = document.querySelector('.splash-screen');
    splashScreen?.classList.add('fade-out');

    // Navigiere nach Abschluss der Animation (3000ms)
    setTimeout(() => {
      this.router.navigate(['/intro']);
    }, 3000); // 3 Sekunden für das Verblassen
  }
}

