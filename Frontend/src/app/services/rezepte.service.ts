import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, finalize, map, Observable, tap, throwError} from 'rxjs';
import { Rezept } from '../models/rezepte';
import {config} from "../../environments/config";
import {environment} from "../../environments/environment";
import {Tag} from "../models/tag";

interface RezeptAntwort {
  id: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class RezeptService {

  private backendUrl = environment.apiUrl;
  private rezepteSubject: BehaviorSubject<Rezept[]> = new BehaviorSubject<Rezept[]>([]);
  public rezepte$: Observable<Rezept[]> = this.rezepteSubject.asObservable();
  private kategorieZaehlerSubject: BehaviorSubject<{[kategorie: string]: number}> = new BehaviorSubject({});
  public kategorieZaehler$ = this.kategorieZaehlerSubject.asObservable();

  private getJsonHeaders() {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }
  constructor(private http: HttpClient) { }

  getAlleRezepte(): Observable<Rezept[]> {
    return this.http.get<Rezept[]>(`${this.backendUrl}/api/rezepte/alleRezepte`).pipe(
      tap(rezepte => {
        // Verarbeiten der Rezepte und Umwandeln der Datumsstrings in Date-Objekte
        const processedRezepte = rezepte.map(rezept => ({
          ...rezept,
          datum: rezept.datum ? new Date(rezept.datum) : undefined
        }));
        this.rezepteSubject.next(processedRezepte); // Aktualisieren des Subjects mit den neuen Daten
      }),
      catchError(error => {
        console.error("Fehler beim Laden der Rezepte", error);
        return throwError(() => new Error("Fehler beim Laden der Rezepte"));
      })
    );
  }


  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  createRezept(rezept: Rezept): Observable<HttpResponse<RezeptAntwort>> {
    this.loadingSubject.next(true);
    const headers = this.getJsonHeaders();
    return this.http.post<RezeptAntwort>(`${this.backendUrl}/api/rezepte/create`, rezept, { headers, observe: 'response' }).pipe(
      tap(response => {
        if (response.body) {
          const updatedRezepte = [...this.rezepteSubject.getValue(), {...rezept, id: response.body.id}];
          this.rezepteSubject.next(updatedRezepte);
          this.updateKategorieZaehler(rezept.tags);
        } else {
          // Geeignete Fehlerbehandlung, falls response.body null ist
          console.error('Received null response body');
        }
      }),
      catchError(error => {
        console.error('Ein Fehler ist aufgetreten:', error);
        return throwError(() => error);
      })
    );
  }


  private updateKategorieZaehler(tags: Tag[] | undefined): void {
    const aktuelleZaehler = this.kategorieZaehlerSubject.getValue();
    const aktualisierteZaehler = {...aktuelleZaehler};

    if (tags) {
      tags.forEach(tag => {
        // Sicherstellen, dass sowohl tag als auch tag.label definiert sind
        if (tag && tag.label) {
          const kategorieName = tag.label;
          aktualisierteZaehler[kategorieName] = (aktualisierteZaehler[kategorieName] || 0) + 1;
        }
      });
    }

    this.kategorieZaehlerSubject.next(aktualisierteZaehler);
  }




  updateRezept(rezeptId: number, rezept: Rezept): Observable<any> {
    const apiUrl = `${this.backendUrl}/api/rezepte/update/${rezeptId}`;
    const rezeptMitFormatiertenTags = {
      ...rezept,
      tags: rezept.tags ?? []
    };

    return this.http.put(apiUrl, rezeptMitFormatiertenTags, { headers: this.getJsonHeaders(), observe: 'response', responseType: 'json' }).pipe(
      tap(() => {
        const existingRezepte = this.rezepteSubject.getValue();
        const index = existingRezepte.findIndex(r => r.id === rezeptId);
        if (index !== -1) {
          const updatedRezepte = [
            ...existingRezepte.slice(0, index),
            {...existingRezepte[index], ...rezept},
            ...existingRezepte.slice(index + 1)
          ];
          this.rezepteSubject.next(updatedRezepte);
        }
      }),
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
