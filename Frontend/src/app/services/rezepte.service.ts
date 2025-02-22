import {HttpClient, HttpHeaders, HttpResponse, HttpParams} from '@angular/common/http';
import {EventEmitter, Injectable, NgZone } from '@angular/core';
import {BehaviorSubject,  Observable,  throwError, of, forkJoin } from 'rxjs';
import { switchMap, map, catchError, tap,mergeMap  } from 'rxjs/operators';
import {Rezept} from '../models/rezepte';
import {environment} from '../../environments/environment';
import {RezeptAntwort} from "../models/rezeptAntwort";
import {AuthService} from "./auth.service";
import {spoonDataMapping} from "../utils/spoonDataMapping";
import {reverseSpoonDataMapping} from "../utils/reverseSpoonDataMapping";
import {SpoonacularApiAntwortGesamt} from "../models/SpoonacularApiAntwort";

@Injectable({
  providedIn: 'root'
})


export class RezeptService {
  private currentRecipe: any = {};
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

  private isBildSelectedSubject = new BehaviorSubject<boolean>(false);
  isBildSelected$ = this.isBildSelectedSubject.asObservable();

  private spoonacularRezepteSubject: BehaviorSubject<Rezept[]> = new BehaviorSubject<Rezept[]>([]);



  constructor(private http: HttpClient, private authService: AuthService, private ngZone: NgZone) {
    console.log('Initial isBildSelectedSubject value:', this.isBildSelectedSubject.getValue());
  }


  private getJsonHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    return headers;
  }

  // Methode zum Setzen des Bildes
  setImage(file: File): void {
    this.imageSubject.next(file);
  }

  setIsBildSelected(value: boolean) {
    this.isBildSelectedSubject.next(value);
  }

  setImageSelected(image: any): void {
    this.isBildSelectedSubject.next(!!image);
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

 // Validierungsfunktion für manuell erstelltes Rezept
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
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    const isSpoonacularRezept = rezept.onlineAdresse?.startsWith('https://www.foodista.com');

    const isValid = isSpoonacularRezept
      ? this.validateSpoonRezept(rezept)
      : this.validateRezept(rezept);

    if (!isValid) {
      this.loadingSubject.next(false);
      return throwError(() => new Error('Rezept ist ungültig.'));
    }


    const token = localStorage.getItem('jwt_token'); // Token aus localStorage holen

    if (!token) {
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
        this.loadingSubject.next(false); // Ladezustand zurücksetzen
      }),
      catchError(error => {
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

/*  updateCurrentRecipe(update: Partial<any>) {
    this.currentRecipe = { ...this.currentRecipe, ...update };
  }

  getCurrentRecipe() {
    return this.currentRecipe;
  }*/

  // SPOON
  // Abruf der Spoon-Rezepte DIREKT von der API ohne BE als Proxy
  fetchSpoonRezepte(tags: string[] = []): Observable<Rezept[]> {
    let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?number=3&random=true&apiKey=${environment.spoonacularApiKey}`;

    let apiDishTypes: string[] = [];
    let apiCuisines: string[] = [];
    let combinedTags: string[] = [];

    tags.forEach(tag => {
      const dishTypeTags = reverseSpoonDataMapping['dishTypes'][tag];
      const cuisineTags = reverseSpoonDataMapping['cuisines'][tag];


      if (dishTypeTags && cuisineTags) {
        dishTypeTags.forEach(dishType => {
          cuisineTags.forEach(cuisine => {
            combinedTags.push(`${dishType},${cuisine}`); // Komma-getrennt für Spoonacular API
          });
        });
      } else if (dishTypeTags) {
        apiDishTypes.push(...dishTypeTags);
      } else if (cuisineTags) {
        apiCuisines.push(...cuisineTags);
      }
    });

    if (combinedTags.length > 0) {
      apiUrl += `&type=${encodeURIComponent(combinedTags.join('|'))}`; // | für ODER-Verknüpfung bei kombinierten Suchbegriffen
    } else if (apiDishTypes.length > 0) {
      apiUrl += `&type=${encodeURIComponent(apiDishTypes.join(','))}`; // , für UND-Verknüpfung bei nur dishTypes
    }
    if (apiCuisines.length > 0) {
      apiUrl += `&cuisine=${encodeURIComponent(apiCuisines.join(','))}`; // , für UND-Verknüpfung bei nur cuisines
    }

    // Zufälligen Offset zwischen 0 und 20 (oder dynamisch nach totalResults) setzen
    const randomOffset = Math.floor(Math.random() * 20);
    apiUrl += `&offset=${randomOffset}`;

    console.log('API-URL:', apiUrl);


    // this.http.get gibt ein Observale zurück
    // "response =>" ist eine anonyme Funktion. Sie nimmt die API-Antwort (response) als Eingabe
    return this.http.get<SpoonacularApiAntwortGesamt>(apiUrl).pipe(
      tap(response => console.log('API Response:', response)),
      switchMap((response: SpoonacularApiAntwortGesamt) => {
        console.log(response);
        if (!response.results || response.results.length === 0) {
          return of([]);
        }

        const recipeIds = response.results.map(rezept => rezept.id);

        const detailRequests = recipeIds.map(id =>
          this.http.get<any>(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${environment.spoonacularApiKey}`)
        );

        return forkJoin(detailRequests).pipe(
          mergeMap((detailResponses: any[]) => {
            const mappedRecipes = detailResponses.map((detailResponse, index) => {
              console.log('Detail Response:', detailResponse);
              const rezept = response.results[index];
              return this.mapSpoonRezepte({ ...rezept, sourceUrl: detailResponse.sourceUrl });
            });
            return of(mappedRecipes); // Gib ein Observable mit dem Array zurück
          })
        );
      }),
      tap(recipes => this.spoonacularRezepteSubject.next(recipes)),
      catchError(error => {
        console.error('API-Fehler:', error);
        return throwError(() => new Error("Fehler beim Laden der Rezepte"));
      })
    );
  }




  //Übernimmt die igentliche Transformation der API-Antwort
  private mapSpoonRezepte(rezept: any): Rezept {
    console.log('mapSpoonRezepte Input:', rezept);
    const dishTypeTags = this.getMappedDishTypes(rezept.dishTypes);
    const cuisineTags = this.getMappedCuisines(rezept.cuisines);

    const uniqueTags = [...dishTypeTags, ...cuisineTags].filter((tag, index, self) =>
      self.findIndex(t => t.label === tag.label) === index
    );

    const mappedRezept = {
      id: rezept.id,
      name: rezept.title,
      bildUrl: rezept.image,
      onlineAdresse: rezept.sourceUrl || '',
      dishTypes: rezept.dishTypes || [],
      cuisines: rezept.cuisines || [],
      tags: uniqueTags,
    };
    console.log('Mapped Rezept:', mappedRezept); // Loggen des gemappten Rezepts
    return mappedRezept;
  }



  /*TODO: Hier die Unterscheidung zwischen Meal und Cuisine wirksam werden lassen*/
  //Helper-Funktion zur Gruppierung der dishTypes
  //Um dishTypes in meine Tag-Struktur zu mappen
  getMappedDishTypes(dishTypes: { type: string; category: string }[] | undefined) {
    if (!dishTypes) return [];

    const uniqueTags = new Set<string>();

    dishTypes.forEach((dish) => {
      const translatedTag = spoonDataMapping[dish.category]?.[dish.type.toLowerCase()];

      if (translatedTag) {
        uniqueTags.add(translatedTag);
      }
    });

    return Array.from(uniqueTags).map((translatedTag: string) => {
      const type =
        Object.values(spoonDataMapping['dishTypes']).includes(translatedTag) ? 'Mahlzeit' :
          Object.values(spoonDataMapping['cuisines']).includes(translatedTag) ? 'Landesküche' :
            'Unbekannt';

      return {
        id: Math.random(),
        type,
        label: translatedTag,
        selected: false,
        count: 1
      };
    });
  }

  getMappedCuisines(cuisines: string[] | undefined) {
    if (!cuisines) return [];

    const uniqueCuisines = new Set<string>();

    cuisines.forEach((cuisine) => {
      const translatedCuisine = spoonDataMapping['cuisines'][cuisine];
      if (translatedCuisine) {
        uniqueCuisines.add(translatedCuisine);
      }
    });

    return Array.from(uniqueCuisines).map((translatedCuisine: string) => ({
      id: Math.random(),
      type: 'Landesküche',
      label: translatedCuisine,
      selected: false,
      count: 1
    }));
  }



  //Das Problem war: Content-Type wurde für rezeptDTO nicht korrekt gesetzt, weil kein File-Blob vorhanden war
  //Lösung: Erstellung eines Blobs (obwohl eigentlich keine Datei mitgesendet wird)
  addRezeptToList(rezept: Rezept, image?: string | Blob | undefined): Observable<Rezept> {
    const token = localStorage.getItem('jwt_token'); // Token aus Local Storage holen
    if (!token) {
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
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    ).pipe(
      tap((savedRezept) => {
        console.log('formData', savedRezept)
        this.ngZone.run(() => {
          const currentList = this.gefilterteRezepteSubject.value;
          this.gefilterteRezepteSubject.next([savedRezept, ...currentList]);
        });
      }),
      catchError((error) => {
        return throwError(() => new Error('Fehler beim Erstellen des Rezepts'));
      })
    );
  }

  // Validierung für Spoon-Rezept
  validateSpoonRezept(rezept: Rezept): boolean {
    if (!rezept.name?.trim()) {
      return false;
    }

    // Spoonacular-Rezepte haben eine verpflichtende `bildUrl`
    if (!rezept.bildUrl?.trim()) {
      return false;
    }

    if (rezept.tags?.length) {
      for (const tag of rezept.tags) {
        console.log('Tag-Objekt:', tag);
        console.log('Tag-Typ:', typeof tag.type, 'Wert:', tag.type);

        const tagType = Object.values(tag.type).join(' ');

        if (!tag.label?.trim() || !tagType.trim()) {
          return false;
        }
      }
    }

    return true;
  }


}
