/*
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import {JwtUtils} from "./jwt-utils/jwt-utils.component";
import {AuthService} from "../../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {


    const isAuthenticated =  this.authService.isAuthenticatedSubject.value;
    const token = localStorage.getItem('jwt_token');

    if (isAuthenticated && token && JwtUtils.isTokenValid(token)) {
      console.log('Benutzer ist authentifiziert und Token ist gültig.');
      return true;  // Zugriff gewähren
    } else {
      console.log('Ungültiger oder fehlender Token. Weiterleitung zur Anmeldung.');
      this.router.navigate(['/anmeldung']);
      return false;  // Zugriff verweigern
    }
  }
}
*/
