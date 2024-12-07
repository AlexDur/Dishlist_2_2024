import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import {environment} from "../../environments/environment";
import { of } from 'rxjs';
import { map } from 'rxjs/operators';  // Importiere 'map' hier



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private backendUrl = environment.apiUrl;
  private tokenKey = 'cognitoToken';
  private body: { email: string; password: string; } | undefined;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    this.body = { email, password };

    return this.http.post(`${this.backendUrl}/api/auth/login`, this.body, { responseType: 'json' }).pipe(
      map((response: any) => {
        console.log('Antwort vom Backend:', response);  // Protokolliere die Antwort, um sicherzustellen, dass das Token vorhanden ist
        const token = response.token;
        if (token) {
          localStorage.setItem('jwt_token', token);
          console.log('Token im localStorage gespeichert:', token);
        } else {
          console.error('Kein Token in der Antwort vorhanden');
        }
        return response;  // Rückgabe der Antwort
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Fehler im HTTP-Aufruf:', error);
        return throwError(() => new Error('Anmeldefehler: ' + error.message));
      })
    );
  }

  logout(): Observable<any> {
    const authToken = localStorage.getItem('authToken');

    if (authToken && /^[A-Za-z0-9-_=.]+$/.test(authToken)) {
      localStorage.removeItem('authToken');
      return this.http.post(`${this.backendUrl}/api/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } else {
      console.error('Ungültiger Token oder Token fehlt');
      return of(null); // Oder eine andere Fehlerbehandlung
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

  // Token speichern (z. B. nach Anmeldung)
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }


  verifyCodeBackend(verifikationCode: string, email: string): Observable<any> {
    console.log('verifyCodebackend', verifikationCode, email)
    return this.http.post<any>(`${this.backendUrl}/api/auth/verify-code`, { verifikationCode, email });
  }

}
