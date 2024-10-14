import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Rezept } from "../../models/rezepte";
import { Tag } from "../../models/tag";
import { RezeptService } from "../../services/rezepte.service";
import { Router } from "@angular/router";
import { catchError, Observable, tap, throwError } from "rxjs";
import { TagService} from "../../services/tags.service";


@Component({
  selector: 'app-rezept-erstellung',
  templateUrl: './rezept-erstellung.component.html',
  styleUrls: ['./rezept-erstellung.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RezeptErstellungComponent implements OnInit {
  @Output() newRecipeCreated = new EventEmitter<Rezept>();
  @Input() rezepte: Rezept[] = [];
  @Input() gefilterteRezepte: Rezept[] = [];

  newRecipe: any = {};
  tags: Tag[] = [];
  selectedTags: Tag[] = [];
  tagError: boolean = false;

  constructor(
    private rezepteService: RezeptService,
  /*  private authService: AuthService,*/
    private tagService: TagService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Abonnieren des Observable für das aktuelle Rezept
    this.rezepteService.currentRezept$.subscribe(rezept => {
      if (rezept) {
        // Wenn ein Rezept vorhanden ist, diesen Zustand wiederherstellen
        this.newRecipe = { ...rezept }; // Zustand wiederherstellen
        this.selectedTags= rezept.tags || []; // Tags wiederherstellen und sicherstellen, dass nicht undefined
        console.log('Aktuelles Rezept:', this.newRecipe);
      } else {
        // Wenn kein Rezept vorhanden ist, eine neue Instanz initialisieren
        this.initNewRecipe();
      }
    });
  }

  initNewRecipe() {
    this.newRecipe = {
      name: '',
      onlineAdresse: '',
      tags: [],
      image: null
    };
    this.resetTags();
    this.selectedTags = [];
  }

  resetTags() {
    // Initialisiert Tags neu und setzt `selected` auf false
    this.tags = this.tagService.getTags().map(tag => ({
      ...tag,
      selected: false
    }));
    this.cdr.detectChanges();
  }

  validateAndFormatURL(): void {
    if (this.newRecipe.onlineAdresse && !this.newRecipe.onlineAdresse.startsWith('http')) {
      this.newRecipe.onlineAdresse = 'https://' + this.newRecipe.onlineAdresse;
    }
  }


  toggleTagSelection(tag: Tag) {
    console.log(`Tag ${tag.label} selected status: ${tag.selected}`);
    if (tag.selected) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags = this.selectedTags.filter(t => t.label !== tag.label);
    }
    this.cdr.detectChanges();
  }

  updateTagCount(): void {
    this.tags.forEach(tag => tag.count = 0);
    this.rezepte.forEach(rezept => {
      rezept.tags?.forEach(rezeptTag => {
        const foundTag = this.tags.find(tag => tag.label === rezeptTag.label);
        if (foundTag) {
          foundTag.count++;
        }
      });
    });
  }

  saveRecipe(rezept: Rezept, newRecipe: Rezept): Observable<any> {
    console.log('Selected Tags before saving:', this.selectedTags);
    this.newRecipe.tags = this.selectedTags;

    if (this.newRecipe.tags.length > 0) {
      console.log('Rezept vor dem Senden:', this.newRecipe);

      const formData = new FormData();
     /* const tagsArray = this.selectedTags.map(tag => tag.label);*/

      if (this.newRecipe.image) {
        console.log('Bilddaten vor dem Speichern:', this.newRecipe.image);
        formData.append('image', this.newRecipe.image);
      }

      // Übergeben der Tags als Array von IDs
      formData.append('name', this.newRecipe.name);
      formData.append('onlineAdresse', this.newRecipe.onlineAdresse);

      // Tags als Array von Objekten vorbereiten
      const tagsArray = this.selectedTags.map(tag => ({
        label: tag.label,
        count: 0, // Beispielwert, kann je nach Logik angepasst werden
        selected: true, // Beispielwert, kann je nach Logik angepasst werden
        type: 'Gerichtart' // Beispielwert, kann je nach Logik angepasst werden
      }));

      // Tags zum FormData hinzufügen
      formData.append('tags', JSON.stringify(tagsArray));

      // Rezept-Objekt hinzufügen
      const rezeptObj = {
        name: this.newRecipe.name,
        onlineAdresse: this.newRecipe.onlineAdresse,
        tags: tagsArray, // Die Tags als Array von Objekten
        image: this.newRecipe.image ? null : undefined // Bilddaten optional lassen
      };


      /*TODO: Blob nochmal nachlesen*/
      formData.append('rezept', new Blob([JSON.stringify(rezeptObj)], { type: 'application/json' }));// Rezept-Objekt als JSON-String hinzufügen

      // Senden der Anfrage
      return this.rezepteService.createRezept(newRecipe, formData).pipe(
        tap(response => {
          console.log('Rezept erfolgreich gespeichert:', response);
          this.newRecipeCreated.emit(this.newRecipe);
          this.updateTagCount();
          this.router.navigate(['/listencontainer']);
        }),
        catchError(error => {
          console.error('Fehler beim Speichern des Rezepts:', error);
          return throwError(() => new Error('Fehler beim Speichern des Rezepts'));
        })
      );
    } else {
      console.error('Bitte wählen Sie mindestens einen Tag aus.');
      return throwError(() => new Error('Bitte wählen Sie mindestens einen Tag aus.'));
    }
  }


  navigateContainer(event: Event) {
    event.preventDefault();
    this.router.navigate(['/listencontainer']);
  }

  handleClick(event: Event) {
    event.preventDefault();

/*    // Authentifizierungsüberprüfung
    if (!this.authService.isAuthenticated()) {
      console.log("Zu Login, weil User nicht eingeloggt")
      this.router.navigate(['/login']);  // Weiterleitung zur Login-Seite, wenn nicht eingeloggt
      return;
    }*/

    if (this.selectedTags.length === 0) {
      this.tagError = true; // Setzt die Error-Flag
      return; // Beendet die Funktion, falls kein Tag ausgewählt ist
    }

    this.tagError = false;
    // Rezept speichern

/*
    // Erstellen von FormData
    const formData = new FormData();
    formData.append('file', this.selectedFile); // Die ausgewählte Datei hinzufügen
    formData.append('rezept', JSON.stringify(this.newRecipe)); // Rezeptinhalt als JSON hinzufügen

*/

    this.saveRecipe(this.rezepte[0],this.newRecipe).subscribe(
      response => {
        console.log('Rezept erfolgreich gespeichert:', response);
        this.router.navigate(['/listencontainer']);  // Weiterleitung nach dem Speichern
      },
      error => {
        console.error('Fehler beim Speichern des Rezepts:', error);
        // Hier kann zusätzliche Fehlerbehandlung hinzugefügt werden
      }
    );
  }

  onImageUploaded(image: File): void {
    this.newRecipe.image = image; // Bild im Rezept speichern
    console.log('Hochgeladenes Bild:', this.newRecipe.image);
  }

  getGerichtartenTags(): Tag[] {
    return this.tagService.getGerichtartenTags();
  }

  getKuechenTags(): Tag[] {
    return this.tagService.getKuechenTags();
  }
}
