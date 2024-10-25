import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, finalize, Observable, tap, throwError} from 'rxjs';
import {Rezept} from '../models/rezepte';
import {environment} from '../../environments/environment';
import {Tag} from '../models/tag';
import {RezeptAntwort} from "../models/rezeptAntwort";


@Injectable({
  providedIn: 'root'
})


export class RezeptService {
  public onRezeptUpdated: EventEmitter<void> = new EventEmitter();
  private backendUrl = environment.apiUrl;

  private rezepteSubject: BehaviorSubject<Rezept[]> = new BehaviorSubject<Rezept[]>([]);

  //Observable rezepte$ wird durch currentRezeptSubject.asObservable() erstellt.
  //Das ist das abbonnierbar für Interessenten
  public rezepte$: Observable<Rezept[]> = this.rezepteSubject.asObservable();
  public kategorieZaehlerSubject: BehaviorSubject<{[kategorie: string]: number}> = new BehaviorSubject({});
  private loadingSubject = new BehaviorSubject<boolean>(false);

  private currentRezeptSubject: BehaviorSubject<Rezept | null> = new BehaviorSubject<Rezept | null>(null);

  //Observable currentRezept$ wird durch currentRezeptSubject.asObservable() erstellt.
  //Damit können andere Teile der Anwendung, die an Änderungen des aktuellen Rezepts interessiert sind, sich darauf abonnieren.
  public currentRezept$: Observable<Rezept | null> = this.currentRezeptSubject.asObservable();

  constructor(private http: HttpClient) { }

  private getJsonHeaders(): HttpHeaders {
    return new HttpHeaders({'Content-Type': 'application/json'});
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

/*  // Mapping-Funktion für Rezept zu RezeptDTO
  /!*TODO: Prüfe*!/
  private mapRecipeToDTO(rezept: Rezept): {
    onlineAdresse: string;
    name: string;
    id: number | undefined;
    tags: Tag[] | undefined
  } {
    return {
      id: rezept.id,
      name: rezept.name,
      onlineAdresse: rezept.onlineAdresse,
      tags: rezept.tags,

    };
  }

  // Mapping-Funktion für Tag zu TagDTO
  /!*TODO: Prüfe*!/
  private mapTagToDTO(tag: Tag): TagDTO {
    return {
      id: tag.id,
      label: tag.label,
      type: tag.type
    };
  }*/



// Validierungsfunktion für das Rezept
  private validateRezept(rezept: Rezept): boolean {
    // !rezept.name prüft, ob Wert falsy ist (null, undefined, 0, NaN, "", false)
    // Aber Achtung: bei der Eingabe von Leerzeichen, wäre durch diese Bedingung die Eingabe gültig.
    // Daher --> trim
    if (!rezept.name || rezept.name.trim() === '') {
      console.error(`Ungültiger Wert für name: ${rezept.name}`);
      return false;
    }

    if (!rezept.onlineAdresse || rezept.onlineAdresse.trim() === '') {
      console.error(`Ungültiger Wert für onlineAdresse: ${rezept.onlineAdresse}`);
      return false;
    }

    if (rezept.tags && Array.isArray(rezept.tags)) {
      for (const tag of rezept.tags) {
        if (!tag.label || tag.label.trim() === '') {
          console.error(`Ungültiger Wert für tag label: ${tag.label}`);
          return false;
        }

        if (!tag.type || tag.type.trim() === '') {
          console.error(`Ungültiger Wert für tag type: ${tag.type}`);
          return false;
        }
      }
    } else {
      console.error(`Ungültige oder fehlende tags: ${rezept.tags}`);
      return false;
    }

    console.log("Validierung erfolgreich");
    return true;
  }


  /*Sendet POST-Anfrage an Server (rezept + headers). In tap wird Serverantwort verarbeitet.
  currentRezeptSubject speichert als Behaviousubject den aktuellen Zustand des Rezepts im Service.
  next setzt Wert des BS auf übergebenes rezept und leitet es damit an alle weiter, die currentRezept-Observable abonniert haben
  rezept als Objekt mit den Rezeptdaten, Bilddatei wird separat, aber gemeinsame mit rezept in formData im multipart-Format gesendet
  HttpResponse enthält gesamte HTTP-Antwort vom Server (nicht nur den Antwort-Körper), sondern auch Statuscode, Header-Infos...
  Observable um asynchronen Natur von Http-Anfrage zu handhaben
  Observable gibt e. Wert des Typs T zurück, hier: HttpResponse<RezeptAntwort>, also hier: Empfang der Server-Antwort
   */
  createRezept(rezept: Rezept, formData: FormData): Observable<HttpResponse<RezeptAntwort>> {
    this.loadingSubject.next(true);

    console.log('FormData-Inhalte vor dem Senden:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    console.log('Daten in createRezept angekommen:', rezept, formData);

    if (!this.validateRezept(rezept)) {
      console.error('Rezept ist ungültig. Die Erstellung wird abgebrochen.');
      this.loadingSubject.next(false); // Ladezustand zurücksetzen
      return throwError(() => new Error('Rezept ist ungültig.'));
    }

    // Prüfen, ob formData bereits befüllt wurde
    if (!formData.has('image')) {
      console.error('Kein Bild im FormData vorhanden.');
      this.loadingSubject.next(false); // Ladezustand zurücksetzen
      return throwError(() => new Error('Bild ist erforderlich.'));
    }

    // Bild aus FormData extrahieren
    const imageFile = formData.get('image') as File;
    rezept.image = imageFile ? imageFile : null;

    console.log('In createRezept: FormData vor dem Senden:', {
      name: formData.get('name'),
      onlineAdresse: formData.get('onlineAdresse'),
      tags: formData.get('tags'),
      image: imageFile ? imageFile.name : 'Kein Bild in rezept-service.ts/create',
      rezept: formData.get('rezept')
    });

    //Hier Versand der Anfrage
    // formData enthält Daten, die an Server geschickt werden sollen (Payload)
    return this.http.post<RezeptAntwort>(`${this.backendUrl}/api/rezepte/create`, formData, {
      observe: 'response'
    }).pipe(
      tap(response => {
        console.log('Server Response:', response);
        if (response.body) {
          console.log('Response Body:', response.body);
          const rezeptId = response.body.id;

          // Tags aus FormData extrahieren und sicherstellen, dass sie korrekt sind
          const tags = JSON.parse(formData.get('tags') as string);
          if (!Array.isArray(tags) || tags.some(tag => !tag.label)) {
            console.error("Tags sind nicht korrekt formatiert:", tags);
          } else {
            console.log("Tags sind korrekt formatiert");
          }

          // Rezept wird direkt von den FormData-Daten abgeleitet
          const updatedRezept: Rezept = {
            name: rezept.name, // Typumwandlung zu string
            onlineAdresse: rezept.onlineAdresse, // Typumwandlung zu string
            tags: tags, // Tags aus JSON
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
            this.uploadImage(rezeptId.toString(), imageFile).subscribe({
              next: (uploadResponse: any) => {
                console.log('Bild erfolgreich hochgeladen:', uploadResponse);
              },
              error: (uploadError: any) => {
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



  uploadImage(rezeptId: string, file: File): Observable<HttpResponse<string>> {
    const formData = new FormData();
    formData.append('file', file); // Datei in FormData hinzufügen

    return this.http.post<string>(`${this.backendUrl}/api/rezepte/${rezeptId}/upload`, formData, {
      observe: 'response'
    }).pipe(
      tap(response => {
        console.log('Upload Response:', response);
      }),
      catchError(error => {
        console.error('Fehler beim Bild-Upload:', error);
        return throwError(() => error);
      })
    );
  }


  /*Asynchron als Observable, weil Bildupload dauern kann.*/
/*  uploadImage(rezeptId: number, file: File): Observable<any>{
    const formData = new FormData();
    formData.append('file', file); // Fügt die Datei mit dem Schlüssel 'file' hinzu

    /!*    const headers = new HttpHeaders(); // Erstellen eines Header-Objekts, wenn nötig*!/

    // POST an Server, um die Datei hochzuladen
    return this.http.post(`${this.backendUrl}/api/rezepte/${rezeptId}/upload`, formData).pipe(
      tap(response => console.log('Upload erfolgreich:', response)),
      catchError(error => {
        console.error('Fehler beim Hochladen des Bildes', error);
        return throwError(() => new Error('Fehler beim Hochladen des Bildes'));
      })
    );
  }*/


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

  // in Card über das Symbol
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
