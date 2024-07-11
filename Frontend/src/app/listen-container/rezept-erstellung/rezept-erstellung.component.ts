import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Rezept} from "../../models/rezepte";
import {Tag} from "../../models/tag";
import {RezeptService} from "../../services/rezepte.service";
import {TagService} from "../../services/tags.service";
import {Router} from "@angular/router";
import {catchError, Observable, switchMap, tap, throwError} from "rxjs";

@Component({
  selector: 'app-rezept-erstellung',
  templateUrl: './rezept-erstellung.component.html',
  styleUrls: ['./rezept-erstellung.component.scss']
})
export class RezeptErstellungComponent implements OnInit{
  @Output() newRecipeCreated = new EventEmitter<Rezept>();
  @Input() rezepte: Rezept[] = [];
  @Input() gefilterteRezepte: Rezept[] = [];

  newRecipe: any;
  selectedRow: any;
  editMode = false;
  rezeptGeladen: boolean = false;

  constructor( private rezepteService: RezeptService,  private tagService: TagService, private router: Router) {
    this.selectedRow = {};
  }

  ngOnInit() {
    if (history.state.data) {
      this.newRecipe = history.state.data;
      this.editMode = true;
    } else {
      this.initNewRecipe(); // Stelle sicher, dass newRecipe initialisiert ist
    }
  }

  initNewRecipe() {
    this.newRecipe = {
      name: '',
      onlineAdresse: '',
      tags: this.initTags()  // Initialisiert die Tags entsprechend
    };
  }

  initTags() {
    // Hier kannst du die Logik definieren, um die Tags initial zu setzen
    return [
      { label: 'Vorspeise', selected: false },
      { label: 'Hauptgang', selected: false },
      { label: 'Nachtisch', selected: false }
    ];
  }

  setGeaendert(rezept: Rezept) {
    rezept.istGeaendert = true;
  }

  /*id kann weglassen werden, da die DB die ID automatisch generiert (AUTO INCREMENT)*/
  addRow() {
    console.log('selectedRow in addRow:', this.selectedRow);
    this.initNewRecipe();  // Setzt newRecipe zurück auf den Initialzustand
    this.gefilterteRezepte.unshift(this.newRecipe);
    this.editMode = true;
    this.selectedRow = this.newRecipe;  // Aktiviert den Bearbeitungsmodus für das neue Rezept
  }

  saveChanges(rezept: Rezept): Observable<any> {
    let operation: Observable<any>;

    if (!rezept.id) {
      operation = this.rezepteService.createRezept(rezept);
    } else {
      operation = this.rezepteService.updateRezept(rezept.id, rezept);
    }

    return operation.pipe(
      tap(() => {
        // Aktualisiere die UI und die Zähler sofort nach dem Speichern
    /*    this.updateUIAfterSave();*/
      }),
      switchMap(response => {
        // Lade alle Rezepte erneut, falls notwendig
        return this.rezepteService.getAlleRezepte();
      }),
      catchError(error => {
        console.error('Fehler beim Speichern oder Aktualisieren des Rezepts', error);
        return throwError(() => error);
      })
    );
  }

  onRatingChanged(newRating: number, rezept: any) {
    rezept.bewertung = newRating;
    rezept.istGeaendert = true;
  }

  selectRow(rezept: any) {
    this.selectedRow = rezept;
    this.editMode = true;
  }

  navigateContainer(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/listencontainer']);
  }

  handleClick($event: any){
    // Emission des neuen Rezepts an übergeordnete Komponenten oder andere Interessenten
    this.newRecipeCreated.emit(this.newRecipe);

    // Speichern des Rezepts und Warten auf die erfolgreiche Speicherung
    this.saveChanges(this.newRecipe).subscribe({
      next: (response) => {
        // Navigation nach erfolgreicher Speicherung
        this.navigateContainer($event);
        // Hinzufügen einer neuen Zeile falls notwendig
        this.addRow();
      },
      error: (error) => {
        console.error('Fehler beim Speichern des Rezepts', error);
      }
    });
  }

}
