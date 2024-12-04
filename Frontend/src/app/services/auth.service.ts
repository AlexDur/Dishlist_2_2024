import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'cognitoToken';

  constructor(private http: HttpClient) {}

  login(email: string,  password: string): Observable<any> {
    return this.http.post('/api/login', { email, password });
  }

  logout(): Observable<any> {
    return this.http.post('/api/logout', {});
  }

  /**
   * Sendet Registrierungsdaten des Nutzers an das Backend
   * @param email
   * @param password
   * @returns Ein Observable mit der Antwort des Servers
   */
  register(email:string, password: string): Observable<any> {
    const body = {
      email: email,
      password: password
    };

    return this.http.post(`${this.baseUrl}/register`, body);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Token speichern (z. B. nach Anmeldung)
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  verifyCodeBackend(verificationCode: string): Observable<any> {
    console.log('verifyCodebackend', verificationCode)
    return this.http.post<any>(`${this.baseUrl}/verify-code`, { verificationCode });
  }

}
