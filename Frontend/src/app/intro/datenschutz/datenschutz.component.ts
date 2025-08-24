import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import { Subscription } from 'rxjs';
import * as AWS from 'aws-sdk';
import {filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-datenschutz',
  templateUrl: './datenschutz.component.html',
})
export class DatenschutzComponent implements OnInit, OnDestroy{
  @Output() accountDeleted = new EventEmitter<boolean>();
  private subscription: Subscription | undefined;
  isAccountDeleted: boolean = false;
  username: string | null = '';
  cognito: AWS.CognitoIdentityServiceProvider | undefined;
  isDialogVisible: boolean = false;
  dialogMessage: string = 'Möchtest du dein Konto wirklich löschen?';

  constructor(private authService: AuthService, private router: Router) { }



  ngOnInit() {
      console.log('DatenschutzComponent aktiviert. Aktuelle URL:', this.router.url);

    const token = localStorage.getItem('jwt_token');
    console.log('Token im localStorage:', token);
/*    this.username = this.authService.getEmailFromJWT();*/
    console.log('Benutzer E-Mail:', this.username);
    this.subscription = this.authService.accountDeleted$.subscribe(
      (status) => {
        this.isAccountDeleted = status;
      }
    );
  }

  onDeleteAccount() {
    this.isDialogVisible = true;
  }

  onConfirmDelete(confirmed: boolean) {
    if (confirmed) {
      this.authService.logout().subscribe({
        next: () => {
          this.authService.setIsAuthenticated(false);
          this.router.navigate(['/anmeldung']);
          console.log('Konto wird gelöscht...');
        },
        error: (err) => {
          console.error('Fehler beim Logout:', err);
        }
      });
    } else {
      console.log('Löschung abgebrochen.');
    }
    this.isDialogVisible = false;
  }

  navigateLanding(event: Event) {
    event.preventDefault();
    this.router.navigate(['/landing']);
  }

 /* deleteUser() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      console.error('ds_Kein Token gefunden.');
      return;
    }

    // Den Benutzer löschen
    this.authService.deleteUser(token).subscribe(
      (response) => {
        console.log('Benutzer erfolgreich gelöscht:', response);

        // Token löschen, wenn der Benutzer erfolgreich gelöscht wurde
        localStorage.removeItem('jwt_token');

        // Benutzer zur Anmeldeseite weiterleiten
        this.router.navigate(['/anmeldung']);

        // Den Status der Benutzerkontolöschung aktualisieren
        this.authService.updateAccountDeletedStatus(true);

        // Optional: Erfolgsnachricht anzeigen oder Bestätigung ausgeben
        alert('Ihr Konto wurde erfolgreich gelöscht.');
      },
      (error) => {
        console.error('ds_Fehler beim Löschen des Benutzers:', error);

        // Optional: Benutzer benachrichtigen, dass ein Fehler aufgetreten ist
        alert('Beim Löschen Ihres Kontos ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    );
  }*/



  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
