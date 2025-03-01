import { Router, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {
    // Verwende pipe und filter, um nur NavigationEnd-Events zu abonnieren
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      localStorage.setItem('lastVisitedRoute', event.url);
    });
  }
}
