import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  title = 'fullStack_rezepteApp';
  public isMobile: boolean = false;

  constructor() {
    this.checkScreenSize();
    const isFirstLaunch = localStorage.getItem('isFirstLaunch');
    if (!isFirstLaunch) {
      console.log('Erster Start');
      localStorage.setItem('isFirstLaunch', 'false');
    }
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  /*@HostListener für Reaktion auf native Ereignisse wie Klicks etc. und eben Größenänderungen des Fensters.*/
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }
}

