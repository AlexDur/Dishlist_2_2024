import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from 'rxjs';
import { Rezept } from '../models/rezepte';

interface RezeptAntwort {
  id: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class RezeptService {

  private backendUrl = 'http://localhost:8080';
  private rezepteSubject: BehaviorSubject<Rezept[]> = new BehaviorSubject<Rezept[]>([]);
  public rezepte$: Observable<Rezept[]> = this.rezepteSubject.asObservable();

  private getJsonHeaders() {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }
  constructor(private http: HttpClient) { }

  getAlleRezepte(): Observable<Rezept[]> {
    // Prüfen, ob das BehaviorSubject bereits Daten enthält
    if (this.rezepteSubject.getValue().length === 0) {
      return this.http.get<Rezept[]>(`${this.backendUrl}/api/rezepte/alleRezepte`).pipe(
        tap(rezepte => {
          // Verarbeiten der Rezepte und Umwandeln der Datumsstrings in Date-Objekte
          const processedRezepte = rezepte.map(rezept => ({
            ...rezept,
            datum: rezept.datum ? new Date(rezept.datum) : undefined
          }));
          this.rezepteSubject.next(processedRezepte);  // Aktualisieren des Subjects mit den neuen Daten
        })
      );
    } else {
      // Wenn Daten vorhanden sind, das bestehende BehaviorSubject als Observable zurückgeben
      return this.rezepteSubject.asObservable();
    }
  }


  createRezept(rezept: Rezept): Observable<HttpResponse<RezeptAntwort>> {
    const headers = this.getJsonHeaders();

    const rezeptMitFormatiertenTags = {
      ...rezept,
      /*Wenn das tags-Attribut des ursprünglichen rezept-Objekts nicht vorhanden ist
      oder null oder undefined ist, wird stattdessen ein leeres Array [] zugewiesen.*/
      tags: rezept.tags ?? []
    };

    console.log('Rezepte.service: rezeptMitFormatiertenTags:', rezeptMitFormatiertenTags)

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
      /*Wenn das tags-Attribut des ursprünglichen rezept-Objekts nicht vorhanden ist
      oder null oder undefined ist, wird stattdessen ein leeres Array [] zugewiesen.*/
      tags: rezept.tags ?? []
    };

    return this.http.put(apiUrl, rezeptMitFormatiertenTags, { headers: this.getJsonHeaders(), observe: 'response', responseType: 'json' }).pipe(
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
