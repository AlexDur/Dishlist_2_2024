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

  // Registrierung eines neuen Benutzers
  register(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.registerUrl, { username, password }, { headers });
  }

  // Login und Speicherung des Tokens
  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.loginUrl, { username, password }, { headers })
      .pipe(
        tap(response => {
          // Annahme: Das Token ist im Feld `token` der Antwort enthalten
          if (response && response.token) {
            localStorage.setItem(this.authTokenKey, response.token);
          }
        })
      );
  }

  // Methode zur Überprüfung, ob der Benutzer eingeloggt ist
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.authTokenKey);
  }

  // Methode zum Abrufen des Tokens
  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  // Methode zum Entfernen des Tokens (z.B. beim Logout)
  logout(): void {
    localStorage.removeItem(this.authTokenKey);
  }

  // Beispiel für eine Methode, die eine Anfrage mit Token absendet
  saveRecipe(newRecipe: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Token im Header anhängen
    });

    return this.http.post<any>('http://localhost:8080/api/rezepte/create', newRecipe, { headers });
  }
}
