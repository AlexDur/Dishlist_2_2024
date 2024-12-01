/*
import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-registrierung',
  templateUrl: './registrierung.component.html'
})
export class RegistrierungComponent {

  email:string = "";
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    this.authService.register(this.username, this.password).subscribe(
      response => {
        console.log('Registrierung erfolgreich');
        this.router.navigate(['/login']);  // Nach der Registrierung zum Login weiterleiten
      },
      error => {
        console.error('Registrierung fehlgeschlagen', error);
      }
    );
    this.navigateListe(event);
  }

  navigateAnmeldung(event: Event) {
    event.preventDefault();
    this.router.navigate(['/anmeldung']);
  }

  navigateListe(event: Event | undefined) {
    if(event){
      event.preventDefault();
    }
    this.router.navigate(['/listencontainer']);
  }
}


*/
