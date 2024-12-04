import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-nutzer-anmeldung',
  templateUrl: './nutzer-anmeldung.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginSuccess: boolean = false;
  loginError: boolean = false;
  isAuthenticated: boolean = false;
  userName: string = '';
  oidcProperties: string = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  onLogin() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.loginSuccess = true;
        this.loginError = false;
        this.isAuthenticated = true;
        this.email = response.email
        this.oidcProperties = JSON.stringify(response.oidcProperties);  // Beispiel für OIDC-Daten
      },
      (error) => {
        this.loginSuccess = false;
        this.loginError = true;
      }
    );
  }

  // Logout-Logik
  onLogout() {
    this.authService.logout().subscribe(() => {
      this.isAuthenticated = false;
      this.email = '';
      this.oidcProperties = '';
    });
  }

  navigateListe(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/listencontainer']);
  }
}
