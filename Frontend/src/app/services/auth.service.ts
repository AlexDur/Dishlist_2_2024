import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import {environment} from "../../environments/environment";
import { of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';  // Importiere 'map' hier



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private backendUrl = environment.apiUrl;
  private tokenKey = 'cognitoToken';
  private body: { email: string; password: string; } | undefined;
  private accountDeletedSubject = new BehaviorSubject<boolean>(false);
  accountDeleted$ = this.accountDeletedSubject.asObservable();


  constructor(private http: HttpClient) {
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    this.isAuthenticatedSubject.next(storedAuth);
  }

  login(email: string, password: string): Observable<any> {
    this.body = { email, password };

    return this.http.post(`${this.backendUrl}/api/auth/login`, this.body, { responseType: 'json' }).pipe(
      map((response: any) => {
        const token = response.token;

        if (token) {
          localStorage.setItem('jwt_token', token);
          localStorage.setItem('isAuthenticated', 'true');
          this.isAuthenticatedSubject.next(true);
        } else {
          console.error('Kein Token in der Antwort vorhanden');
          this.isAuthenticatedSubject.next(false);
        }

        return response; // Antwort weitergeben
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Fehler im HTTP-Aufruf:', error);
        this.isAuthenticatedSubject.next(false); // Auth-Status bei Fehler setzen
        return throwError(() => new Error('Anmeldefehler: ' + error.message));
      })
    );
  }


  logout(): Observable<any> {
    const authToken = localStorage.getItem('authToken');

    if (authToken && /^[A-Za-z0-9-_=.]+$/.test(authToken)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      this.isAuthenticatedSubject.next(false);
      return this.http.post(`${this.backendUrl}/api/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${authToken}` }
      }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Fehler bei der Abmeldung:', error.message, 'Status:', error.status, 'URL:', error.url);
          return throwError(() => new Error('Logout fehlgeschlagen: ' + error.message));
        })
      );
    } else {
      console.error('Ungültiger Token oder Token fehlt');
      return of(null);
    }
  }


  /**
   * Sendet Registrierungsdaten des Nutzers an das Backend
   * @param email
   * @param password
   * @returns Ein Observable mit der Antwort des Servers
   */
  register(email: string, password: string): Observable<any> {
    this.body = { email, password };

    return this.http.post(`${this.backendUrl}/api/auth/register`, this.body, { responseType: 'text'}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Fehler im HTTP-Aufruf:', error);
        return throwError(() => new Error('Registrierungsfehler: ' + error.message));
      })
    );
  }


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  checkAuthentication() {
    const token = localStorage.getItem('jwt_token');
    const isCurrentlyAuthenticated = this.isAuthenticatedSubject.value; // Aktueller Zustand aus BehaviorSubject
    const newAuthStatus = !!token; // Neuer Zustand basierend auf localStorage

    // Nur updaten, wenn sich der Zustand geändert hat
    if (isCurrentlyAuthenticated !== newAuthStatus) {
      this.isAuthenticatedSubject.next(newAuthStatus);
    }
  }


  // Token speichern (z. B. nach Anmeldung)
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }


  verifyCodeBackend(verifikationCode: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/api/auth/verify-code`, { verifikationCode, email });
  }

  setAccountDeleted(status: boolean) {
    this.accountDeletedSubject.next(status);
  }

}
