import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import { Rezept } from '../models/rezepte';
import {DatePipe} from "@angular/common";

interface RezeptAntwort {
  id: number; // Angenommen, dies ist der Typ der ID in Ihrer Datenbank
  message: string; // Eine Nachricht vom Server, z.B. "Rezept erfolgreich erstellt."
}


@Injectable({
  providedIn: 'root'
})
export class RezeptService {

  private backendUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }




  getAlleRezepte(): Observable<Rezept[]> {
    return this.http.get<Rezept[]>(`${this.backendUrl}/api/rezepte/alleRezepte`);
  }


  createRezept(rezept: Rezept): Observable<HttpResponse<RezeptAntwort>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<RezeptAntwort>(`${this.backendUrl}/api/rezepte/create`, rezept, { headers, observe: 'response', responseType: 'json' }).pipe(
      map(response => {
        console.log('Message:', response.body?.message);
        console.log('ID:', response.body?.id);
        return response;
      }),
      catchError(error => {
        console.error('Ein Fehler ist aufgetreten:', error);
        return throwError(error);
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
