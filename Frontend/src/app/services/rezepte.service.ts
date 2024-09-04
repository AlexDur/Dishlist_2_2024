import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError, Observable, finalize } from 'rxjs';
import { Rezept } from '../models/rezepte';
import { environment } from '../../environments/environment';
import { Tag } from '../models/tag';
import { AuthService } from './auth.service';

interface RezeptAntwort {
  id: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class RezeptService {
  public onRezeptUpdated: EventEmitter<void> = new EventEmitter();
  private backendUrl = environment.apiUrl;

  private rezepteSubject: BehaviorSubject<Rezept[]> = new BehaviorSubject<Rezept[]>([]);
  public rezepte$: Observable<Rezept[]> = this.rezepteSubject.asObservable();
  public kategorieZaehlerSubject: BehaviorSubject<{[kategorie: string]: number}> = new BehaviorSubject({});
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getJsonHeaders(): HttpHeaders {
    const authToken = this.authService.getToken();

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return headers;
  }

  getAlleRezepte(): Observable<Rezept[]> {
    return this.http.get<Rezept[]>(`${this.backendUrl}/api/rezepte/alleRezepte`).pipe(
      tap(rezepte => {
        const processedRezepte = rezepte.map(rezept => ({
          ...rezept,
          datum: rezept.datum ? new Date(rezept.datum) : undefined
        }));
        this.rezepteSubject.next(processedRezepte);
      }),
      catchError(error => {
        console.error("Fehler beim Laden der Rezepte", error);
        return throwError(() => new Error("Fehler beim Laden der Rezepte"));
      })
    );
  }

  createRezept(rezept: Rezept): Observable<HttpResponse<RezeptAntwort>> {
    console.log("Rezept vor dem Senden:", rezept);

    this.loadingSubject.next(true);
    const headers = this.getJsonHeaders();
    return this.http.post<RezeptAntwort>(`${this.backendUrl}/api/rezepte/create`, rezept, { headers, observe: 'response' }).pipe(
      tap(response => {
        console.log('Server Response:', response);
        if (response.body) {
          console.log('Response Body:', response.body);
          const updatedRezepte = [...this.rezepteSubject.getValue(), { ...rezept, id: response.body.id }];
          this.rezepteSubject.next(updatedRezepte);
          this.updateKategorieZaehler(rezept.tags);
          this.onRezeptUpdated.emit();
        } else {
          console.error('Received null response body');
        }
      }),
      catchError(error => {
        console.error('Unerwartete Antwort vom Server:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))  // Ladezustand zurücksetzen
    );
  }

  private updateKategorieZaehler(tags: Tag[] | undefined): void {
    const aktuelleZaehler = this.kategorieZaehlerSubject.getValue();
    const aktualisierteZaehler = { ...aktuelleZaehler };

    if (tags) {
      tags.forEach(tag => {
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
            { ...existingRezepte[index], ...rezept },
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
    return this.http.delete(apiUrl, { responseType: 'text' }).pipe(
      tap(() => {
        this.updateTagCountsAfterDeletion(id);
      }),
      catchError((error) => {
        console.error('Fehler beim Löschen des Rezepts', error);
        return throwError(new Error('Fehler beim Löschen des Rezepts'));
      })
    );
  }

  updateTagCountsAfterDeletion(id: number) {
    let currentRezepte = this.rezepteSubject.getValue();
    let deletedRezept = currentRezepte.find(rezept => rezept.id === id);

    if (deletedRezept && deletedRezept.tags) {
      let zaehler = this.kategorieZaehlerSubject.getValue();

      deletedRezept.tags.forEach(tag => {
        if (tag.label && zaehler[tag.label] && zaehler[tag.label] > 0) {
          zaehler[tag.label] -= 1;
        }
      });

      this.kategorieZaehlerSubject.next(zaehler);
      this.rezepteSubject.next(currentRezepte.filter(rezept => rezept.id !== id));
    }
  }
}
