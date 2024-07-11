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
import {catchError, Observable, tap, throwError} from "rxjs";

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

  newRecipe: any;
  selectedTags: Tag[] = [];

  constructor(private rezepteService: RezeptService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initNewRecipe();
  }

  initNewRecipe() {
    this.newRecipe = {
      name: '',
      onlineAdresse: '',
      tags: []
    };
    this.selectedTags = [
      { label: 'Vorspeise', selected: false, count:0 },
      { label: 'Hauptgang', selected: false, count:0 },
      { label: 'Nachtisch', selected: false, count:0 }
    ];
  }

  toggleTagSelection(tag: Tag, $event: any) {
    tag.selected = !tag.selected;
    console.log(`Tag ${tag.label} selected status: ${tag.selected}`);
    this.cdr.detectChanges();
  }


  saveRecipe(newRecipe: any): Observable<any> {
    this.newRecipe.tags = this.selectedTags.filter(tag => tag.selected);
    // Entferne die Prüfung, ob alle Felder ausgefüllt sind, und prüfe stattdessen nur, ob Tags ausgewählt wurden.
    if (this.newRecipe.tags.length > 0) {
      return this.rezepteService.createRezept(this.newRecipe).pipe(
        tap(response => {
          console.log('Rezept erfolgreich gespeichert:', response);
          this.newRecipeCreated.emit(this.newRecipe);
          this.initNewRecipe(); // Reset nach dem Speichern
          this.router.navigate(['/listencontainer']);
        }),
        catchError(error => {
          console.error('Fehler beim Speichern des Rezepts:', error);
          return throwError(() => new Error('Fehler beim Speichern des Rezepts'));
        })
      );
    } else {
      // Fehlermeldung, falls keine Tags ausgewählt sind
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
    this.saveRecipe(this.newRecipe).subscribe({
      next: response => {
        console.log('Rezept erfolgreich gespeichert:', response);
        this.router.navigate(['/listencontainer']);
      },
      error: error => {
        console.error('Fehler beim Speichern des Rezepts:', error);
      }
    });
  }


}
