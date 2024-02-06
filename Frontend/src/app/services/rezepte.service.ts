import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
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

    // Rezept an das Backend senden und die Antwort als HttpResponse<string> erhalten

    return this.http.post<HttpResponse<string>>(`${this.backendUrl}/api/rezepte/create`, rezept, { headers, observe: 'response', responseType: 'text' as 'json' }).pipe(
      map(response => {
        if (response.body !== null) {
          // Den Body in eine Zeichenkette umwandeln und dann als JSON interpretieren
          const responseBodyString = response.body.toString();
          console.log('rBodystring', responseBodyString)
          const jsonResponse = JSON.parse(responseBodyString);

          // Hier kannst du auf die Daten im JSON zugreifen
          const message = jsonResponse.message;
          const id = jsonResponse.id;

          // Die bearbeitete Antwort zurückgeben
          return response;
        } else {
          // Handle den Fall, wenn die Antwort keinen Body hat
          return response;
        }
      })
    );
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

  deleteRezept(id: number): Observable<any> {
    const apiUrl = `${this.backendUrl}/api/rezepte/delete/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(apiUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Fehler beim Löschen des Rezepts', error);
        return throwError(() => new Error('Fehler beim Löschen des Rezepts'));
      })
    );
  }



}
