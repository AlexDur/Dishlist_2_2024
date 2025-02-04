import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, finalize, Observable, tap, throwError, map} from 'rxjs';
import {Rezept} from '../models/rezepte';
import {environment} from '../../environments/environment';
import {RezeptAntwort} from "../models/rezeptAntwort";
import {AuthService} from "./auth.service";
import {TagType} from "../models/tagType";
import {DEFAULT_TAGS} from "../models/default_tag";
import {dishTypeMapping} from "../utils/dishTypeMapping";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Injectable({
  providedIn: 'root'
})


export class RezeptService {

  public onRezeptUpdated: EventEmitter<void> = new EventEmitter();
  private backendUrl = environment.apiUrl;

  //Observable rezepte$ wird durch gefilterteRezepteSubject.asObservable() erstellt.
  //Das ist das abbonnierbar für Interessenten
  private rezepteSubject: BehaviorSubject<Rezept[]> = new BehaviorSubject<Rezept[]>([]);
  private gefilterteRezepteSubject = new BehaviorSubject<Rezept[]>([]);
  rezepte$: Observable<Rezept[]> = this.rezepteSubject.asObservable();
  gefilterteRezepte$ = this.gefilterteRezepteSubject.asObservable();

  public kategorieZaehlerSubject: BehaviorSubject<{[kategorie: string]: number}> = new BehaviorSubject({});
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private currentRezeptSubject: BehaviorSubject<Rezept | null> = new BehaviorSubject<Rezept | null>(null);

  //Observable currentRezept$ wird durch currentRezeptSubject.asObservable() erstellt.
  //Damit können andere Teile der Anwendung, die an Änderungen des aktuellen Rezepts interessiert sind, sich darauf abonnieren.
  public currentRezept$: Observable<Rezept | null> = this.currentRezeptSubject.asObservable();

  private imageSubject: BehaviorSubject<File | null> = new BehaviorSubject<File | null>(null);
  public image$: Observable<File | null> = this.imageSubject.asObservable();

  private spoonacularRezepteSubject: BehaviorSubject<Rezept[]> = new BehaviorSubject<Rezept[]>([]);
  public spoonacularRezepte$: Observable<Rezept[]> = this.spoonacularRezepteSubject.asObservable();
  private imageUrl: string = '';





  constructor(private http: HttpClient, private authService: AuthService, private fb: FormBuilder) {
  }


  private getJsonHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    return headers;
  }

  // Methode zum Setzen des Bildes
  public setImage(file: File): void {
    this.imageSubject.next(file);
  }

  // Lädt alle im Backend vorhandenen Rezepte (entsprechend ungefilterr) und speichert sie im Subject
  getUserRezepte(): Observable<RezeptAntwort[]> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Kein JWT-Token im localStorage gefunden'));
    }

    const headers = this.createHeaders(token);

    return this.http.get<RezeptAntwort[]>(`${this.backendUrl}/api/rezepte/userRezepte`, { headers }).pipe(
      tap(rezepte => this.handleResponse(rezepte)),
      catchError(error => this.handleError(error))
    );
  }

  private getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  private createHeaders(token: string): HttpHeaders {
    return this.getJsonHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  private handleResponse(rezepte: RezeptAntwort[]): void {
    if (!rezepte || !Array.isArray(rezepte)) {
      this.rezepteSubject.next([]);
      this.gefilterteRezepteSubject.next([]);
    } else if (rezepte.length === 0) {
      this.rezepteSubject.next([]);
      this.gefilterteRezepteSubject.next([]);
    } else {
      this.rezepteSubject.next(rezepte); // Alle Rezepte speichern
      this.gefilterteRezepteSubject.next(rezepte);
    }
  }

  private handleError(error: any): Observable<never> {

    switch (error.status) {
      case 400:
        break;
      case 401:
        break;
      default:
        break;
    }

    return throwError(() => new Error("Fehler beim Laden der Rezepte"));
  }


  setCurrentRezept(rezept: Rezept) {
    this.currentRezeptSubject.next(rezept);
  }

  clearCurrentRezept() {
    // Setzt das aktuelle Rezept auf `null` zurück
    this.currentRezeptSubject.next(null);
  }

// Validierungsfunktion für das Rezept
  validateRezept(rezept: Rezept): boolean {

    if (!rezept.name?.trim()) {
      return false;
    }

    if (!rezept.onlineAdresse?.trim()) {
      return false;
    }

    if (rezept.tags?.length) {
      for (const tag of rezept.tags) {
        if (!tag.label?.trim()) {
          return false;
        }

        if (!tag.type?.trim()) {
          return false;
        }
      }
    }

    return true;
  }


  validateSpoonRezept(rezept: Rezept): boolean {
    if (!rezept.name?.trim()) {
      return false;
    }

    // Spoonacular-Rezepte haben keine verpflichtende `onlineAdresse`
    if (!rezept.bildUrl?.trim()) {
      return false;
    }

    // Tags sind optional, aber wenn sie vorhanden sind, sollten sie valide sein
    if (rezept.tags?.length) {
      for (const tag of rezept.tags) {
        console.log('Tag-Objekt:', tag);
        console.log('Tag-Typ:', typeof tag.type, 'Wert:', tag.type);

        // Sicherstellen, dass tag.type ein String ist, bevor trim() angewendet wird
        const tagType = Object.values(tag.type).join(' '); // Alle Werte des type-Objekts zusammenfügen

        if (!tag.label?.trim() || !tagType.trim()) {
          return false;
        }
      }
    }

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

    const isSpoonacularRezept = rezept.onlineAdresse?.startsWith('https://www.foodista.com');

    console.log(`Erkannter Rezepttyp: ${isSpoonacularRezept ? 'Spoonacular-Rezept' : 'Manuell erstelltes Rezept'}`);


    const isValid = isSpoonacularRezept
      ? this.validateSpoonRezept(rezept)
      : this.validateRezept(rezept);

    if (!isValid) {
      console.error('Rezept ist ungültig. Die Erstellung wird abgebrochen.');
      this.loadingSubject.next(false);
      return throwError(() => new Error('Rezept ist ungültig.'));
    }


    const token = localStorage.getItem('jwt_token'); // Token aus localStorage holen

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
        return throwError(() => new Error('rservice3_Fehler beim Speichern des Rezepts'));
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
        return throwError(() => new Error('Rezept konnte nicht gelöscht werden.'));

      })
    );
  }

  private updateTagCountsAfterDeletion(id: number): void {
    const currentRezepte = this.rezepteSubject.getValue();
    const newZaehler = { ...this.kategorieZaehlerSubject.getValue() };

    currentRezepte.find(rezept => rezept.id === id)?.tags?.forEach(tag => {
      if (tag.label) {
        newZaehler[tag.label] = Math.max(0, (newZaehler[tag.label] || 0) - 1);
      }
    });

    this.kategorieZaehlerSubject.next(newZaehler);
    this.rezepteSubject.next(currentRezepte.filter(rezept => rezept.id !== id));
  }


  getFilteredRezepte(tags: string[], searchText: string): Observable<Rezept[]> {
    return this.rezepte$.pipe(
      map(rezepte => {
        const gefilterteRezepte = rezepte.filter(rezept => {
          const matchesSearch = !searchText || rezept.name.toLowerCase().includes(searchText.toLowerCase());

          if (!matchesSearch) return false;

          if (tags.length === 0) return true;

          return tags.every(selectedTag =>
            rezept.tags?.some(rTag => rTag.label === selectedTag)
          );
        });

        // Aktualisiere die gefilterteRezepteSubject mit den neuen gefilterten Rezepten
        this.gefilterteRezepteSubject.next(gefilterteRezepte);

        // Gibt die gefilterten Rezepte zurück
        return gefilterteRezepte;
      })
    );

  }


// SPOON
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
  // Dadurch sind die Attribute aus API in der html anzeigbar unter den Namen, wie ich sie im Projekt für die gleichbedeutenden Attribute unter "rezept." angelegt habe
  private mapSpoonacularRezepte(response: any): Rezept[] {

    return response.recipes.map((rezept: any) => {
      // Umwandlung der dishTypes in Tags
      const tags = this.getMappedDishTypes(rezept.dishTypes);

      return {
        id: Math.random(),
        name: rezept.title,
        bildUrl: rezept.image || '',
        onlineAdresse: rezept.sourceUrl || '',
        tags,
        image: null,
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
        id: Math.random(),
        type: 'MAHLZEIT',
        label: germanTag,
        selected: false,
        count: 1
      };
    });
  }

  //aus spoon-Rezepten
  //Das Problem war: Content-Type wurde für rezeptDTO nicht korrekt gesetzt, weil kein File-Blob vorhanden war
  //Lösung: Erstellung eines Blobs (obwohl eigentlich keine Datei mitgesendet wird)
  addRezeptToList(rezept: Rezept, image?: string | Blob | undefined): Observable<Rezept> {
    const token = localStorage.getItem('jwt_token'); // Token aus Local Storage holen
    if (!token) {
      console.error('Kein Token gefunden. Bitte loggen Sie sich erneut ein.');
      return throwError(() => new Error('Kein Token gefunden.'));
    }

    const formData = new FormData();
    const rezeptBlob = new Blob([JSON.stringify(rezept)], { type: 'application/json' });
    formData.append('rezeptDTO', rezeptBlob, 'rezept.json');

    if (image) {
      formData.append('image', image);
    }

    return this.http.post<Rezept>(
      `${this.backendUrl}/api/rezepte/create`,
      formData,
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } // Token hier verwenden
    ).pipe(
      catchError((error) => {
        console.error('Fehler beim Erstellen des Rezepts:', error);
        return throwError(() => new Error('Fehler beim Erstellen des Rezepts'));
      })
    );
  }



  /*saveSpoonacularRezept(rezept: any, image?: File): Observable<Rezept> {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      console.error('Kein Token gefunden. Bitte loggen Sie sich erneut ein.');
      return throwError(() => new Error('Token fehlt.'));
    }

    const formData = new FormData();
    formData.append('rezeptDTO', JSON.stringify(rezept));

    if (image) {
      formData.append('image', image);
    }

    return this.http.post<Rezept>(
      `${this.backendUrl}/api/rezepte/create`,
      formData,
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    ).pipe(
      catchError(error => {
        console.error('Fehler beim Speichern des Rezepts', error);
        return throwError(() => new Error("Fehler beim Speichern des Rezepts"));
      })
    );
  }*/





  private mapSpoonacularToRezept(spoonacularRezept: any): Rezept {
    console.log('Original Rezept von Spoonacular:', spoonacularRezept);

    const mapSpoonToDishlish: Rezept = {
      id: 0,
      name: spoonacularRezept.name || 'Unbenannt',
      onlineAdresse: spoonacularRezept.sourceUrl || '',
      bildUrl: spoonacularRezept.image || '',
      image: null,
      tags: (spoonacularRezept.dishTypes?.map((dish: string, index: number) => {
        return {
          id: index,
          type: 'MAHLZEIT',
          label: 'MAHLZEIT',
          selected: false,
          count: 1
        };
      }) || []),
    };

    console.log('Nach dem Mapping in mapSpoonacularToRezept:', mapSpoonToDishlish);
    return mapSpoonToDishlish;
  }
}
