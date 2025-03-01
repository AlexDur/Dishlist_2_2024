import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit{
  backgroundLoaded = false;

  constructor(private router: Router, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    const img = new Image();
    img.src = 'assets/landing3.webp';
    img.onload = () => {
      this.backgroundLoaded = true;
      this.cdRef.detectChanges();
    };
  }

  navigateAnmeldung(event: Event) {
    event.preventDefault();
    this.router.navigate(['/anmeldung']);
  }


  navigateReg(event: Event) {
    event.preventDefault();
    this.router.navigate(['/registrierung']);
  }
}
