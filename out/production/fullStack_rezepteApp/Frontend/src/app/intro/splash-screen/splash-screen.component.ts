import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html'
})
export class SplashScreenComponent {

constructor(private router:Router) {
}

  navigateIntro(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/intro']);
  }
}
