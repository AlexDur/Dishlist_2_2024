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
  passwordInvalid = true;
  passwordTouched = false;
  confirmPassword: string | undefined;
  errorMessage: string = '';
  showPassword = false;
  inputType = 'password';
  passwordMismatch: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    // Überprüfen, ob die Passwörter übereinstimmen
    if (this.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;  // Beende die Registrierung, wenn die Passwörter nicht übereinstimmen
    }

    this.passwordMismatch = false;  // Setze das Mismatch zurück, wenn die Passwörter übereinstimmen

    // Registrierungsprozess aufrufen, wenn alles gültig ist
    this.authService.register(this.email, this.password).subscribe(
      response => {
        console.log('Weiterleitung Verfizierung', response);
        this.router.navigate(['/verifikation'], { queryParams: { email: this.email } });
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


  onPasswordFocus() {
    this.passwordTouched = true;
  }

  onPasswordChange() {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    this.passwordInvalid = !regex.test(this.password);
  }

  navigateAnmeldung(event: Event) {
    event.preventDefault();
    this.router.navigate(['/anmeldung']);
  }

/*  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.inputType = this.showPassword ? 'text' : 'password';
  }*/

  protected readonly event = event;
}


