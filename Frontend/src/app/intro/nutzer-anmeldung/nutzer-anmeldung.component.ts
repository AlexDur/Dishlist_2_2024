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

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log('Login erfolgreich');
        this.router.navigate(['/listencontainer']);
      },
      error => {
        console.error('Login fehlgeschlagen', error);
      }
    );
  }

  navigateListe(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/listencontainer']);
  }
}
