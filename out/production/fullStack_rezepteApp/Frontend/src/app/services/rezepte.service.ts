import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError, Observable, finalize } from 'rxjs';
import { Rezept } from '../models/rezepte';
import { environment } from '../../environments/environment';
import { Tag } from '../models/tag';

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

  private currentRezeptSubject: BehaviorSubject<Rezept | null> = new BehaviorSubject<Rezept | null>(null);
  public currentRezept$: Observable<Rezept | null> = this.currentRezeptSubject.asObservable();


  constructor(private http: HttpClient) { }

  private getJsonHeaders(): HttpHeaders {
    /*const authToken = this.authService.getToken();*/

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  /*  if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }*/

    return headers;
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

  getAlleRezepte(): Observable<Rezept[]> {
    const headers = this.getJsonHeaders().set('Accept', 'application/json');

    return this.http.get<Rezept[]>(`${this.backendUrl}/api/rezepte/alleRezepte`, { headers }).pipe(
      tap(rezepte => {
        const processedRezepte = rezepte.map(rezept => ({
          ...rezept,
        }));
        this.rezepteSubject.next(processedRezepte);
      }),
      catchError(error => {
        console.error("Fehler beim Laden der Rezepte", error);
        return throwError(() => new Error("Fehler beim Laden der Rezepte"));
      })
    );
  }

  setCurrentRezept(rezept: Rezept) {
    this.currentRezeptSubject.next(rezept);
  }

  clearCurrentRezept() {
    // Setzt das aktuelle Rezept auf `null` zurück
    this.currentRezeptSubject.next(null);
  }


  // Validierungsfunktion für das Rezept
// Validierungsfunktion für das Rezept
  private validateRezept(rezept: Rezept): boolean {
    // Überprüfen, ob die erforderlichen Felder vorhanden sind und gültige Werte haben
    if (!rezept.name || typeof rezept.name !== 'string' || rezept.name.trim() === '') {
      console.error(`Invalid value for name: ${rezept.name}`);
      return false;
    }

    if (!rezept.onlineAdresse || typeof rezept.onlineAdresse !== 'string' || rezept.onlineAdresse.trim() === '') {
      console.error(`Invalid value for onlineAdresse: ${rezept.onlineAdresse}`);
      return false;
    }

    // Überprüfen der Tags
    if (rezept.tags && Array.isArray(rezept.tags)) {
      for (const tag of rezept.tags) {
        if (!tag.label || typeof tag.label !== 'string' || tag.label.trim() === '') {
          console.error(`Invalid value for tag label: ${tag.label}`);
          return false;
        }

        if (!tag.type || typeof tag.type !== 'string' || tag.type.trim() === '') {
          console.error(`Invalid value for tag type: ${tag.type}`);
          return false;
        }
      }
    } else {
      console.error(`Invalid or missing tags: ${rezept.tags}`);
      return false; // Tags sind entweder nicht vorhanden oder nicht in der richtigen Form
    }

    console.log("Validation passed");
    return true;
  }




  /*Sendet POST-Anfrage an Server (rezept + headers). In tap wird Serverantwort verarbeitet.
  currentRezeptSubject speichert als Behaviousubject den aktuellen Zustand des Rezepts im Service.
  next setzt Wert des BS auf übergebenes rezept und leitet es damit an alle weiter, die currentRezept-Observable abonniert haben */
  createRezept(rezept: Rezept, formData: FormData): Observable<HttpResponse<RezeptAntwort>> {
    this.loadingSubject.next(true);


    if (!this.validateRezept(rezept)) {
      console.error('Rezept ist ungültig. Die Erstellung wird abgebrochen.');
      this.loadingSubject.next(false); // Ladezustand zurücksetzen
      return throwError(() => new Error('Rezept ist ungültig.'));
    }

    const imageFile = formData.get('image') as File;
    rezept.image = imageFile ? imageFile : null;

    console.log('FormData Inhalt vor dem Senden:', {
      name: formData.get('name'),
      onlineAdresse: formData.get('onlineAdresse'),
      tags: formData.get('tags'),
      image: formData.get('file') ? (formData.get('file') as File).name : 'Kein Bild',
      rezept: formData.get('rezept')
    });

    return this.http.post<RezeptAntwort>(`${this.backendUrl}/api/rezepte/create`, formData, {
      observe: 'response'
    }).pipe(
      tap(response => {
        console.log('Server Response:', response);
        if (response.body) {
          console.log('Response Body:', response.body);
          const rezeptId = response.body.id;

          const tags = JSON.parse(formData.get('tags') as string);
          if (!Array.isArray(tags) || tags.some(tag => !tag.label)) {
            console.error("Tags sind nicht korrekt formatiert:", tags);
          } else {
            console.log("Tags sind korrekt formatiert");
          }

          // Rezept wird jetzt direkt von den FormData-Daten abgeleitet
          const updatedRezept: Rezept = {
            name: rezept.name, // Typumwandlung zu string
            onlineAdresse: rezept.onlineAdresse, // Typumwandlung zu string
            tags: JSON.parse(formData.get('tags') as string), // Tags aus JSON
            image: imageFile, // Bild kann null sein
            id: rezeptId // ID vom Server hinzufügen
          };

          // Aktualisierte Rezepte verwalten
          const updatedRezepte = [...this.rezepteSubject.getValue(), updatedRezept];
          this.rezepteSubject.next(updatedRezepte);
          this.updateKategorieZaehler(updatedRezept.tags);
          this.onRezeptUpdated.emit();

          // Hochladen des Bildes, wenn vorhanden
          if (imageFile) {
            this.uploadImage(rezeptId, imageFile).subscribe({
              next: (uploadResponse) => {
                console.log('Bild erfolgreich hochgeladen:', uploadResponse);
              },
              error: (uploadError) => {
                console.error('Fehler beim Hochladen des Bildes:', uploadError);
              }
            });
          }
        }
      }),
      catchError(error => {
        console.error('Unerwartete Antwort vom Server:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))  // Ladezustand zurücksetzen
    );
  }



  /*Asynchron als Observable, weil Bildupload dauern kann.*/
  uploadImage(rezeptId: number, file: File): Observable<any>{
    const formData = new FormData();
    formData.append('file', file); // Fügt die Datei mit dem Schlüssel 'file' hinzu

    /*    const headers = new HttpHeaders(); // Erstellen eines Header-Objekts, wenn nötig*/

    // POST an Server, um die Datei hochzuladen
    return this.http.post(`${this.backendUrl}/api/rezepte/${rezeptId}/upload`, formData).pipe(
      tap(response => console.log('Upload erfolgreich:', response)),
      catchError(error => {
        console.error('Fehler beim Hochladen des Bildes', error);
        return throwError(() => new Error('Fehler beim Hochladen des Bildes'));
      })
    );
  }


  updateRezept(rezeptId: number, rezept: Rezept): Observable<any> {
    const apiUrl = `${this.backendUrl}/api/rezepte/update/${rezeptId}`;
    this.currentRezeptSubject.next(rezept)
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
