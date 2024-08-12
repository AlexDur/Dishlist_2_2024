import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
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
  public onRezeptUpdated: EventEmitter<void> = new EventEmitter();
  private backendUrl = environment.apiUrl;

  // BehaviorSubject speichert den zuletzt gesendeten Wert und gibt diesen Wert sofort an neue Abonnenten weiter.
  // Speichert Arrays vom Type Rezept
  // Initialisiert das BehaviorSubject mit leerem Array
  private rezepteSubject: BehaviorSubject<Rezept[]> = new BehaviorSubject<Rezept[]>([]);
  public rezepte$: Observable<Rezept[]> = this.rezepteSubject.asObservable();
  public kategorieZaehlerSubject: BehaviorSubject<{[kategorie: string]: number}> = new BehaviorSubject({});
  private loadingSubject = new BehaviorSubject<boolean>(false);

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

  // Methode, die Rezept-Objekt akzeptiert und ein Observable zurückgibt, das eine HTTP-Antwort enthält
  // LoadingSubject, um Ladezustand zu aktualisieren und um e. UI-Komponente darüber zu benachrichtigen (Subject = Observable UND Observer)
  // JSON-Header (enthält Metadaten, s. oben) werden für die HTTP-Anfrage abgerufen, um sicherzustellen, dass die Anfrage als JSON formatiert ist.
  // HTTP-POST-Anfrage wird an Server gesendet, um das Rezept zu erstellen (Rezept-Objekt + vorbereitete Header)
  // tap (von "Anzapfen" eines Stroms [Observable]) zur Verarbeitung der Antwort, also zum Ausführen von Aktion beim Durchfluss der Daten
  createRezept(rezept: Rezept): Observable<HttpResponse<RezeptAntwort>> {
    console.log("Rezept vor dem Senden:", rezept);

    this.loadingSubject.next(true);
    const headers = this.getJsonHeaders();
    return this.http.post<RezeptAntwort>(`${this.backendUrl}/api/rezepte/create`, rezept, { headers, observe: 'response' }).pipe(
      tap(response => {
        console.log('Server Response:', response); // Debugging-Meldung hinzufügen
        if (response.body) {
          console.log('Response Body:', response.body); // Debugging-Meldung hinzufügen
          const updatedRezepte = [...this.rezepteSubject.getValue(), {...rezept, id: response.body.id}];
          this.rezepteSubject.next(updatedRezepte);
          this.updateKategorieZaehler(rezept.tags);
          this.onRezeptUpdated.emit();
        } else {
          console.error('Received null response body');
        }
      }),
      catchError(error => {
        console.error('Unerwartete Antwort vom Server:', error); // Ändere von Response zu error
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
    return this.http.delete(apiUrl, { responseType: 'text' }).pipe(
      tap(() => {
        // Hier könnte die Methode zum Aktualisieren der Zähler aufgerufen werden
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
