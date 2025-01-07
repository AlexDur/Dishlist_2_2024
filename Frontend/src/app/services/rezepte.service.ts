import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, finalize, Observable, tap, throwError, map} from 'rxjs';
import {Rezept} from '../models/rezepte';
import {environment} from '../../environments/environment';
import {Tag} from '../models/tag';
import {RezeptAntwort} from "../models/rezeptAntwort";
import {AuthService} from "./auth.service";
import {TagType} from "../models/tagType";
import {DEFAULT_TAGS} from "../models/default_tag";
import {dishTypeMapping} from "../utils/dishTypeMapping";



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

  private spoonacularRezepteSubject: BehaviorSubject<Rezept[]> = new BehaviorSubject<Rezept[]>([]);
  public spoonacularRezepte$: Observable<Rezept[]> = this.spoonacularRezepteSubject.asObservable();



  constructor(private http: HttpClient, private authService: AuthService) { }

  private getJsonHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    return headers;
  }


  getUserRezepte(): Observable<RezeptAntwort[]> {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      return throwError(() => new Error('Kein JWT-Token im localStorage gefunden'));
    }

    /*TODO: headers zwei mal abgerufunen in datei, also auslagern*/
    const headers = this.getJsonHeaders().set('Accept', 'application/json', )
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<RezeptAntwort[]>(`${this.backendUrl}/api/rezepte/userRezepte`, { headers }).pipe(
      tap(rezepte => {
        // Überprüfe den Inhalt der Antwort
        if (!rezepte || !Array.isArray(rezepte)) {
          console.error('API antwortet mit ungültigem Inhalt:', rezepte);
          this.rezepteSubject.next([]);
        } else if (rezepte.length === 0) {
          console.warn('Keine Rezepte zurückgegeben.');
          this.rezepteSubject.next([]);
        } else {
          console.log('Rezepte vom Server:', rezepte);
          this.rezepteSubject.next(rezepte);
        }
      }),
      catchError(error => {
        console.error('Fehler beim Laden der Rezepte', error);
        if (error.status === 400) {
          console.error('Fehler 400: Ungültiges Token oder leeres Token.');
        } else if (error.status === 401) {
          console.error('Fehler 401: Ungültiger Token.');
        } else {
          console.error('Unbekannter Fehler:', error);
        }
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

    // Validierung des Rezeptes
    if (!this.validateRezept(rezept)) {
      console.error('Rezept ist ungültig. Die Erstellung wird abgebrochen.');
      this.loadingSubject.next(false); // Ladezustand zurücksetzen
      return throwError(() => new Error('Rezept ist ungültig.')); // Fehler zurückgeben
    }

    const token = localStorage.getItem('jwt_token'); // Hier holen wir das Token aus dem localStorage

    if (!token) {
      console.error('Kein Token gefunden. Bitte loggen Sie sich erneut ein.');
      this.loadingSubject.next(false); // Ladezustand zurücksetzen
      return throwError(() => new Error('Token fehlt.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    console.log('Formdata in service.ts', formData)

    // Versand der Anfrage
    return this.http.post<RezeptAntwort>(`${this.backendUrl}/api/rezepte/create`, formData, {
      observe: 'response',
      headers: headers
    }).pipe(
      tap(response => {
        console.log('Server Response:', response);
        this.loadingSubject.next(false); // Ladezustand zurücksetzen
      }),
      catchError(error => {
        console.error('Unerwarteter Fehler beim Speichern des Rezepts:', error);
        this.loadingSubject.next(false); // Ladezustand zurücksetzen
        return throwError(() => new Error('rservice3_Fehler beim Speichern des Rezepts')); // Fehler zurückgeben
      })
    );
  }


  updateRezept(rezeptId: number, rezeptToSave: Rezept, formData: FormData): Observable<any> {
    const apiUrl = `${this.backendUrl}/api/rezepte/update/${rezeptId}`;
    this.currentRezeptSubject.next(rezeptToSave);

    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(apiUrl, formData, {
      headers: headers,
      observe: 'response'
    }).pipe(
      tap(() => {
        const existingRezepte = this.rezepteSubject.getValue();
        const index = existingRezepte.findIndex(r => r.id === rezeptId);
        if (index !== -1) {
          const updatedRezepte = [
            ...existingRezepte.slice(0, index),
            { ...existingRezepte[index], ...rezeptToSave },
            ...existingRezepte.slice(index + 1)
          ];
          this.rezepteSubject.next(updatedRezepte);
        }
      }),
      catchError((error) => {
        return throwError(() => new Error('rservice_Fehler beim Aktualisieren des Rezepts'));
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

// RezeptService
  fetchRandomSpoonacularRezepte(): Observable<Rezept[]> {
    const apiUrl = `https://api.spoonacular.com/recipes/random?number=3&apiKey=${environment.spoonacularApiKey}`;



    return this.http.get<any>(apiUrl).pipe(
      map(response => {
        if (response && response.recipes) {
          return this.mapSpoonacularRezepte(response);
        } else {
          console.error('Ungültige Antwort von Spoonacular');
          return []; // Leere Liste zurückgeben, falls die Antwort ungültig ist
        }
      }),
      tap(recipes => {
        // Rezepte im Subject speichern (falls benötigt)
        this.spoonacularRezepteSubject.next(recipes);
      }),
      catchError(error => {
        console.error('Fehler beim Laden der zufälligen Rezepte von Spoonacular', error);
        return throwError(() => new Error("Fehler beim Laden der zufälligen Rezepte"));
      })
    );
  }


// Helper-Funktion zum Mappen der API-Daten
  private mapSpoonacularRezepte(response: any): Rezept[] {
    // Beispiel für gültige Gänge
    const gültigeGänge = DEFAULT_TAGS.filter(tag => tag.type === TagType.GÄNGE).map(tag => tag.label);

    return response.recipes.map((rezept: any) => {
      // Umwandlung der dishTypes in Tags
      const tags = this.getMappedDishTypes(rezept.dishTypes);

      return {
        id: Math.random(), // ID generieren oder aus anderen Daten übernehmen
        name: rezept.title,
        image: rezept.image || '', // Optional: Fallback für Image
        bildUrl: rezept.sourceUrl || '',
        tags, // Tags füllen
      };
    });
  }

// Helper-Funktion zur Gruppierung der dishTypes
  getMappedDishTypes(dishTypes: string[] | undefined): any[] {
    if (!dishTypes) return [];

    const uniqueCategories = new Set<string>();

    dishTypes.forEach((type) => {
      const mappedCategory = dishTypeMapping[type.toLowerCase()];
      if (mappedCategory) {
        uniqueCategories.add(mappedCategory);
      }
    });

    return Array.from(uniqueCategories).map((germanTag: string) => {
      return {
        id: Math.random(), // ID generieren oder aus anderen Daten übernehmen
        type: TagType.GÄNGE, // TagType bleibt 'Gänge' für Mittagessen
        label: germanTag, // Übersetzung oder Originalwert
        selected: false, // Optional: Wenn du eine Auswahl benötigst
        count: 1 // Optional: Hier eine Zählung setzen, falls erforderlich
      };
    });
  }



}
