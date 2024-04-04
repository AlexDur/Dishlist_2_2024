import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import { Rezept } from '../models/rezepte';
import {DatePipe} from "@angular/common";

interface RezeptAntwort {
  id: number;
  message: string;
}


@Injectable({
  providedIn: 'root'
})
export class RezeptService {

  private backendUrl = 'http://localhost:8080';

  private getJsonHeaders() {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }
  constructor(private http: HttpClient) { }

  getAlleRezepte(): Observable<Rezept[]> {
    return this.http.get<Rezept[]>(`${this.backendUrl}/api/rezepte/alleRezepte`);
  }

/*  getRezeptById(rezeptId: number): Observable<Rezept> {
    return this.http.get<Rezept>(`${this.backendUrl}/api/rezepte/${rezeptId}`);
  }*/

  createRezept(rezept: Rezept): Observable<HttpResponse<RezeptAntwort>> {
    const headers = this.getJsonHeaders();

    const rezeptMitFormatiertenTags = {
      ...rezept,
    /*Sicherstellen, dass, wenn rezept.tags = undefined, stattdessen ein leeres Array verwendet wird*/
      tags: rezept.tags?.map(tagName => ({ name: tagName })) ?? []
    };

    return this.http.post<RezeptAntwort>(
      `${this.backendUrl}/api/rezepte/create`,
      rezeptMitFormatiertenTags,
      { headers, observe: 'response', responseType: 'json' }
    ).pipe(
      map(response => {
        console.log('Message:', response.body?.message);
        console.log('ID:', response.body?.id);
        return response;
      }),
      catchError(error => {
        console.error('Ein Fehler ist aufgetreten:', error);
        return throwError(() => error);
      })
    );
  }


  updateRezept(rezeptId: number, rezept: Rezept): Observable<any> {
    const apiUrl = `${this.backendUrl}/api/rezepte/update/${rezeptId}`;

    // Überprüfen, ob `tags` definiert ist, und Verwendung eines leeren Arrays als Fallback
    const rezeptMitFormatiertenTags = {
      ...rezept,
      tags: rezept.tags?.map(tagName => ({ name: tagName })) ?? []
    };

    return this.http.put(apiUrl, rezeptMitFormatiertenTags, { headers: this.getJsonHeaders() }).pipe(
      catchError((error) => {
        console.error('Fehler beim Aktualisieren des Rezepts', error);
        return throwError(() => new Error('Fehler beim Aktualisieren des Rezepts'));
      })
    );
  }


  deleteRezept(id: number): Observable<any> {
    const apiUrl = `${this.backendUrl}/api/rezepte/delete/${id}`;
    // Keine Notwendigkeit, Content-Type Header für eine DELETE-Anfrage zu setzen,
    // besonders wenn kein Body gesendet wird.
    return this.http.delete(apiUrl, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Fehler beim Löschen des Rezepts', error);
        // Direkte Verwendung von throwError ohne Funktion, um die Konsistenz mit RxJS 6+ zu wahren
        return throwError(new Error('Fehler beim Löschen des Rezepts'));
      })
    );
  }


}
