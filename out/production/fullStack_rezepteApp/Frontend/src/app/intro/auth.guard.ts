/*
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
    console.log('AuthGuard instantiated');
  }

  canActivate(): boolean | UrlTree {
    console.log('AuthGuard is active');
    const token = localStorage.getItem('jwt_token');
    const lastVisitedRoute = localStorage.getItem('lastVisitedRoute');

    if (token) {
      if (lastVisitedRoute) {
        return this.router.parseUrl(lastVisitedRoute); // Auf zuletzt besuchte Route umleiten
      } else {
        return this.router.parseUrl('/landing'); // Auf Landing-Page umleiten, falls keine letzte Route gespeichert ist
      }
    } else {
      return this.router.parseUrl('/anmeldung'); // Auf Anmeldeseite umleiten, falls kein Token vorhanden ist
    }
  }
}
*/
