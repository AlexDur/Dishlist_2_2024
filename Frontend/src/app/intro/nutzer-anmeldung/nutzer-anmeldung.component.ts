import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-nutzer-anmeldung',
  templateUrl: './nutzer-anmeldung.component.html',
  styleUrls: ['./nutzer-anmeldung.component.scss']
})
export class NutzerAnmeldungComponent {

  username: string = '';
  password: string = '';
  loginSuccess: boolean = false;
  loginError: boolean = false;


  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log('Login erfolgreich');
        this.router.navigate(['/listencontainer']);
        this.loginSuccess = true;
        this.loginError = false;
      },
      error => {
        console.error('Login fehlgeschlagen', error);
        this.loginError = true;
        this.loginSuccess = false;
      }
    );
  }

  navigateListe(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/listencontainer']);
  }
}
