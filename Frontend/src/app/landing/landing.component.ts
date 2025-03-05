import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserInterfaceService} from "../services/userInterface.service";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit{
  backgroundLoaded = false;
  isMobile: boolean = false;

  constructor(private router: Router, private cdRef: ChangeDetectorRef, private uiService: UserInterfaceService) {
  }

  ngOnInit() {
    if (this.router.url === '/') {
      this.router.navigate(['/landing']);
    }

    this.uiService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });


    if (this.isMobile) {
      const img = new Image();
      img.src = 'assets/landing3.webp';
      img.onload = () => {
        this.backgroundLoaded = true;
        this.cdRef.detectChanges();
      };
    }
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
