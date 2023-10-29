import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rezept } from '../models/rezepte';

@Injectable({
  providedIn: 'root'
})
export class RezeptService {

  private backendUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getRezepteMini(): Observable<Rezept[]> {
    return this.http.get<Rezept[]>(`${this.backendUrl}/rezepteMini`);
  }

  createRezept(rezept: Rezept): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<string>(`${this.backendUrl}/rezepte`, rezept, { headers });
  }
}
