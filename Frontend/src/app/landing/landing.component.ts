import { Component, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit{
  @Input() isMobile?: boolean;
  backgroundLoaded = false;
 /* isMobile: boolean = false;*/

  constructor(private router: Router, private cdRef: ChangeDetectorRef,) {
  }

  ngOnInit() {

/*
    this.uiService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });*/



      const img = new Image();
      img.src = 'assets/Group-20.webp';
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
