import { Router, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {
    console.log('✅ NavigationService wurde instanziiert');

    // Verwende pipe und filter, um nur NavigationEnd-Events zu abonnieren
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      console.log('🔄 Router Event empfangen:', event);
      console.log('✅ NavigationEnd erkannt:', event.url);
      localStorage.setItem('lastVisitedRoute', event.url);
      console.log('lastVisitedRoute gespeichert:', event.url);
    });
  }
}
