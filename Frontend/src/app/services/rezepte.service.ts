import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { Rezept } from '../models/rezepte';
import {DatePipe} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class RezeptService {

  private backendUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAlleRezepte(): Observable<Rezept[]> {
    return this.http.get<Rezept[]>(`${this.backendUrl}/api/rezepte/alleRezepte`);
  }


  createRezept(rezept: Rezept): Observable<HttpResponse<HttpResponse<string>>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (!this.isValidDate(rezept.datum, 'dd-MM-yyyy')) {
      return throwError('Ungültiges Datumsformat. Verwenden Sie "dd-MM-yyyy".');
    }

    if (rezept.name && rezept.name.length > 100) {
      return throwError('Die Beschreibung ist zu lang. Maximal 100 Zeichen erlaubt.');
    }

    if (rezept.onlineAdresse && rezept.onlineAdresse.length > 100) {
      return throwError('Die Beschreibung ist zu lang. Maximal 100 Zeichen erlaubt.');
    }

    if (rezept.person && rezept.person.length > 100) {
      return throwError('Die Beschreibung ist zu lang. Maximal 100 Zeichen erlaubt.');
    }

    // Rezept an das Backend senden
    return this.http.post<HttpResponse<string>>(`${this.backendUrl}/api/rezepte/create`, rezept, { headers, observe: 'response', responseType: 'text' as 'json' });
  }

  // Hilfsfunktion zur Überprüfung des Datumsformats
  private isValidDate(date: Date | undefined, format: string): boolean {
    if (date instanceof Date) {
      // Wenn das Datum bereits ein Date-Objekt ist, gibt es kein Problem mit dem Format
      return true;
    }

    const datePipe = new DatePipe('de-DE');
    const formattedDate = datePipe.transform(date, format);
    return formattedDate !== null;
  }

  updateRezept(rezeptId: number, rezept: Rezept): Observable<any> {
    const apiUrl = `${this.backendUrl}/api/rezepte/update/${rezeptId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(apiUrl, rezept, { headers });
  }

  deleteRezept(rezeptId: number): Observable<any> {
    const apiUrl = `${this.backendUrl}/api/rezepte/delete/${rezeptId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(apiUrl, { headers });
  }


}
