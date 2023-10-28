import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RezeptService {

  private backendUrl = 'http://localhost:3000'; // Ändern Sie die URL entsprechend Ihrer Backend-URL

  constructor(private http: HttpClient) { }

  createRezept(rezept: Rezept): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<string>(`${this.backendUrl}/rezepte`, rezept, { headers });
  }
}
