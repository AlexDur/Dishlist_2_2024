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
    return this.http.post<any>(this.registerUrl, { username, password }, { headers, withCredentials: true });
  }

  // Login und Speicherung des Tokens
  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.loginUrl, { username, password }, { headers, withCredentials: true })
      .pipe(
        tap(response => {
          console.log('Login Response:', response);
          if (response && response.token) {
            console.log('Saving Token:', response.token);
            localStorage.setItem(this.authTokenKey, response.token);
          }
        })
      );
  }



  // Methode zur Überprüfung, ob der Benutzer eingeloggt ist
  isAuthenticated(): boolean {
    // Überprüft, ob das Token unter dem authTokenKey vorhanden ist
    const token = localStorage.getItem(this.authTokenKey);
    console.log("Abgerufener Token in isAuthenticated:", token);
    return !!token;
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
