import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post('/api/login', { username, password });
  }

  logout(): Observable<any> {
    return this.http.post('/api/logout', {});
  }

  /**
   * Sendet Registrierungsdaten an das Backend
   * @param username Der Benutzername des neuen Nutzers
   * @param password Das Passwort des neuen Nutzers
   * @returns Ein Observable mit der Antwort des Servers
   */
  register(username: string, password: string): Observable<any> {
    const body = {
      username: username,
      password: password
    };

    return this.http.post(`${this.baseUrl}/register`, body);
  }
}
