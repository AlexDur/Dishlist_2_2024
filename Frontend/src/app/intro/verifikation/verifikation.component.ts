import { Component, OnInit} from '@angular/core';
import { catchError } from 'rxjs/operators';
import {Router} from "@angular/router";
import { of } from 'rxjs';
import {AuthService} from "../../services/auth.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verifikation',
  templateUrl: './verifikation.component.html'
})
export class VerifikationComponent implements OnInit{
  verifikationCode: string = '';  // Variable für den eingegebenen Code
  email: string = '';  // Variable für den eingegebenen Code
  errorMessage: string = '';  // Fehlernachricht, die angezeigt wird
  successMessage: string = '';  // Erfolgsnachricht nach erfolgreicher Verifikation

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {}


  ngOnInit() {
    // E-Mail aus den Query-Parametern holen
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  // Methode zum Verifizieren des Codes
 /* verifyCode(event:Event) {
    event.preventDefault();
    // Überprüfen, ob der Code 6 Zeichen lang ist
    if (this.verifikationCode.length !== 6) {
      this.errorMessage = 'Der Code muss genau 6 Stellen haben.';
      return;
    }

    // Anfrage an das Backend senden, um den Code zu verifizieren
    this.authService.verifyCodeBackend(this.verifikationCode, this.email)

      .pipe(
        catchError(err => {
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message; // Backend-Fehlermeldung anzeigen
          } else {
            this.errorMessage = 'Fehler bei der Verifizierung. Bitte versuchen Sie es später erneut.';
          }
          return of(null);
        })
      )

      .subscribe(response => {
        console.log('response:', response)
        if (response && response.success) {
          // Wenn die Verifizierung erfolgreich ist, weiterleiten
          this.successMessage = 'Code erfolgreich verifiziert!';
          this.errorMessage = ''; // Fehlernachricht zurücksetzen

          this.navigateAnmeldung();
        } else {
          // Wenn der Code ungültig ist, Fehlermeldung anzeigen
          this.errorMessage = 'Ungültiger Code. Bitte versuchen Sie es erneut.';
          this.successMessage = '';
        }
      });
  }*/

  navigateRegistrierung(event: Event) {
    event.preventDefault();
    this.router.navigate(['/registrierung']);
  }

  navigateAnmeldung() {
    this.router.navigate(['/anmeldung']);
  }
}
