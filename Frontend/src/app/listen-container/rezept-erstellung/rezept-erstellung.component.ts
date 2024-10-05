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
      tags: []
    };
    this.resetTags();
    this.selectedTags = [];
    console.log('Initial Tags:', this.tags);
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
    console.log('Selected Tags:', this.selectedTags);
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

  saveRecipe(newRecipe: any): Observable<any> {
    console.log('Selected Tags before saving:', this.selectedTags);
    this.newRecipe.tags = this.selectedTags;
    if (this.newRecipe.tags.length > 0) {
      console.log('Rezept vor dem Senden:', this.newRecipe);
      return this.rezepteService.createRezept(this.newRecipe).pipe(
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
    this.saveRecipe(this.newRecipe).subscribe(
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


  getGerichtartenTags(): Tag[] {
    return this.tagService.getGerichtartenTags();
  }

  getKuechenTags(): Tag[] {
    return this.tagService.getKuechenTags();
  }
}
