/*
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerUrl = 'http://localhost:8080/api/auth/registrierung';
  private loginUrl = 'http://localhost:8080/api/auth/login';
  private authTokenKey = 'authToken';  // Schlüssel für das Token im localStorage

  constructor(private http: HttpClient) { }

  // Methode zum Abrufen des Tokens
  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  register(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.registerUrl, { username, password }, { headers});
  }

  // Methode zur Überprüfung, ob der Benutzer eingeloggt ist
  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log("Abgerufener Token in isAuthenticated:", token);
    return !!token;
  }

  // Beispiel für eine Methode, die eine Anfrage mit Token absendet
  saveRecipe(newRecipe: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      console.error('Kein Token gefunden. Benutzer ist nicht authentifiziert.');
      return throwError(() => new Error('Benutzer ist nicht authentifiziert.'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Token im Header anhängen
    });

    return this.http.post<any>('http://localhost:8080/api/rezepte/create', newRecipe, { headers });
  }

  // Beispiel für eine Methode, um das Token beim Login zu speichern
  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>('http://localhost:8080/api/auth/login', { username, password }, { headers})
      .pipe(
        tap(response => {
          if (response && response.token) {
            console.log('Saving Token:', response.token);
            localStorage.setItem(this.authTokenKey, response.token);
          }
        })
      );
  }
}

*/
