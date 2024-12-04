import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-registrierung',
  templateUrl: './registrierung.component.html'
})
export class RegistrierungComponent {

  email:string = "";
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    this.authService.register(this.email, this.password).subscribe(
      response => {
        console.log('Weiterleitung Verfizierung', response);
        this.router.navigate(['/verifikation']);
      },
      error => {
        console.error('Registrierung fehlgeschlagen', error);
        console.error('Grund für: Registrierung fehlgeschlagen', error.status);


        if (error.status === 409) { // Statuscode für "Conflict"
          // Hinweis ausgeben, dass der Nutzer bereits registriert ist
          this.errorMessage = 'Diese E-Mail-Adresse ist bereits registriert. Bitte melden Sie sich an.';
        } else if (error.error instanceof ErrorEvent) {
          console.error('Client-side error:', error.error.message);
        } else {
          console.error(`Server-side error: ${error.status} ${error.error}`);
        }
      }
    );
  }

  navigateAnmeldung(event: Event) {
    event.preventDefault();
    this.router.navigate(['/anmeldung']);
  }

  navigateVerfikation(event: Event | undefined) {
    if(event){
      event.preventDefault();
    }
    this.router.navigate(['/verfikation']);
  }

  protected readonly event = event;
}


