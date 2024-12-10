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
import { HttpResponse } from '@angular/common/http';
import {RezeptAntwort} from "../../models/rezeptAntwort";
import {DEFAULT_TAGS} from "../../models/default_tag.ts";



@Component({
  selector: 'app-rezept-erstellung',
  templateUrl: './rezept-erstellung.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RezeptErstellungComponent implements OnInit {
  @Output() newRecipeCreated = new EventEmitter<Rezept>();
  @Input() rezepte: Rezept[] = [];
  @Input() gefilterteRezepte: Rezept[] = [];

  newRecipe: any = {};
  tags: Tag[] = [...DEFAULT_TAGS];
  selectedTags: Tag[] = [];
  tagError: boolean = false;
  showNameError: boolean = false;
  showOnlineAddressError: boolean = false;
  nametouched:boolean = false;
  on_adtouched: boolean = false;
  selectedCategory: string | null = null;
  isUpdateMode: boolean = false;
  rezeptToSave?: Rezept;

  categories = [
    { name: 'Gänge', selected: false },
    { name: 'Küche', selected: false },
    { name: 'Nährwert', selected: false }
  ];


  constructor(
    private rezepteService: RezeptService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {


    // Abonnieren des Observables aus rezepteService für das aktuelle Rezept
    // Wenn e. Rezept exisitiert, dann wird es in newRecipe gespeichert und tags werden selectedTags zugewiesen
    this.rezepteService.currentRezept$.subscribe(rezept => {
      if (rezept) {
        // Flache Kopie von Rezept (es werden nur die Referenzen kopiert nicht die Inhalte) d.h. newRecipe ist unabhängig von rezept
        this.newRecipe = { ...rezept };
        // Tags gesondert abgerufen, für spätere Verarbeitung in Zähler-Darstellungen
        this.selectedTags= rezept.tags || [];
      }
      // Wenn kein Rezept vorhanden ist, eine neue Instanz initialisieren
      else {
        this.initNewRecipe();
      }
    });

    this.rezepteService.currentRezept$.subscribe(rezept => {
      if (rezept) {
      this.isUpdateMode = true;
    }
  })
  }

  private showError(fieldName: keyof Rezept, show: boolean): void {
    if (fieldName === 'name') {
      this.showNameError = show;
    } else if (fieldName === 'onlineAdresse') {
      this.showOnlineAddressError = show;
    }
  }

  //Neues leeres Rezept mit Standardwerten initialisiert
  //newRecipe dient als temporärer Speicher
  initNewRecipe() {
    this.newRecipe = {
      name: '',
      onlineAdresse: '',
      tags: [],
      image: null
    };
  }

  validateAndFormatURL(): void {
    if (this.newRecipe.onlineAdresse && !this.newRecipe.onlineAdresse.startsWith('http')) {
      this.newRecipe.onlineAdresse = 'https://' + this.newRecipe.onlineAdresse;
    }
  }

  setCategory(category: { name: string; selected: boolean }) {
    // Die ausgewählte Kategorie umschalten
    if (this.selectedCategory === category.name) {
      category.selected = false;
      this.selectedCategory = null;
    } else {
      // Setze die ausgewählte Kategorie und setze alle anderen auf nicht ausgewählt
      this.categories.forEach(cat => cat.selected = false);
      category.selected = true;
      this.selectedCategory = category.name;
    }
  }


  getVisibleTags() {
    // Tags nach `selectedCategory` filtern
    return this.tags.filter(tag => tag.type === this.selectedCategory);
  }

  isAnyTagSelected(category: string): boolean {
    const categoryTags = this.tags.filter(tag => tag.type === category);
    console.log(`Tags for category ${category}:`, categoryTags);
    const anySelected = categoryTags.some(tag => tag.selected);
    console.log(`Any tag selected for category ${category}:`, anySelected);
    return anySelected;
  }


  toggleTagSelection(tag: Tag) {
    tag.selected = !tag.selected;
    console.log(`Tag ${tag.label} selected status: ${tag.selected}`);

    if (tag.selected) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags = this.selectedTags.filter(t => t.label !== tag.label);
    }

    this.newRecipe.tags = [...this.selectedTags];
    console.log('Aktuelle ausgewählte Tags:', this.selectedTags); // Log der ausgewählten Tags
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

  onImageUploaded(image: File): void {
    this.newRecipe.image = image;
    console.log('Hochgeladenes Bild:', this.newRecipe.image);
  }



  //Observable für die Anfragen im return
  saveRecipe(rezeptToSave: Rezept): Observable<HttpResponse<RezeptAntwort>> {
    const rezeptDTO = {
      id: rezeptToSave.id,
      name: rezeptToSave.name,
      onlineAdresse: rezeptToSave.onlineAdresse,
      tags: Array.isArray(rezeptToSave.tags) ? rezeptToSave.tags.map((tag) => ({
        id: tag.id,
        type: tag.type ?? 'defaultType',
        label: tag.label,
        selected: tag.selected,
        count: tag.count,
      })) : []
    };

    console.log('Erstelltes RezeptDTO:', rezeptDTO);

    const formData = new FormData();
    formData.append('rezeptDTO', new Blob([JSON.stringify(rezeptDTO)], {type: 'application/json'}));

    if (rezeptToSave.image instanceof File) {
      if (rezeptToSave.image.size > 10 * 1024 * 1024) {
        console.error('Bilddatei überschreitet die maximale Größe von 10 MB.');
        return throwError(() => new Error('Bild ist zu groß.'));
      }
      formData.append('image', rezeptToSave.image);
    } else {
      console.warn('Kein optionales Bild vorhanden:', rezeptToSave.image);
    }

    // Wenn eine ID vorhanden ist, rufe die Update-Methode auf
    if (rezeptToSave.id) {
      console.log('rezept vor updateRezept in saveRecipe', rezeptToSave);
      return this.rezepteService.updateRezept(rezeptToSave.id, rezeptToSave, formData).pipe(
        tap(response => {
          console.log('Serverantwort:', response);
          this.updateTagCount();
        }),
        catchError(error => {
          return throwError(() => new Error('Fehler beim Aktualisieren des Rezepts.'));
        })
      );
    } else {
      // Wenn keine ID vorhanden ist, rufe die Create-Methode auf
      return this.rezepteService.createRezept(rezeptToSave, formData).pipe(
        tap(response => {
          console.log('Rezept erfolgreich gespeichert:', response);
          this.updateTagCount();
        }),
        catchError(error => {
          return throwError(() => new Error('Fehler beim Speichern des Rezepts.'));
        })
      );
    }
  }


  handleClick(event: Event) {
    event.preventDefault();

    this.tagError = false;
    const rezeptToSave = this.newRecipe;

    const formData = new FormData();
    const rezeptDTO = {
      id: rezeptToSave.id,
      name: rezeptToSave.name,
      onlineAdresse: rezeptToSave.onlineAdresse,
      tags: Array.isArray(rezeptToSave.tags) ? rezeptToSave.tags.map((tag: {id:number, type: any; label: any; selected: any; count: any; }) => ({
        id: tag.id,
        type: tag.type ?? 'defaultType',
        label: tag.label,
        selected: tag.selected,
        count: tag.count,
      })) : []
    };

    formData.append('rezeptDTO', new Blob([JSON.stringify(rezeptDTO)], {type: 'application/json'}));

    if (rezeptToSave.image instanceof File) {
      formData.append('image', rezeptToSave.image);
    }


    if (this.isUpdateMode) {
      console.log('rezeptToSave bei isUpdateMode', rezeptToSave)
      this.rezepteService.updateRezept(rezeptToSave.id, rezeptDTO, formData).pipe(
        tap(response => {
          console.log('Rezept erfolgreich aktualisiert:', response);
          this.isUpdateMode = false;
          console.log('isUpdateMode nach Update', this.isUpdateMode)
          this.router.navigate(['/listen-container']);
        }),
        catchError(error => {
          return throwError(() => new Error('erstellung2_Fehler beim Aktualisieren des Rezepts.'));
        })
      ).subscribe();
    } else {
      this.saveRecipe(rezeptToSave).pipe(
        tap(response => {
          console.log('Rezept erfolgreich gespeichert:', response);
          this.router.navigate(['/listen-container']);
        }),
        catchError(error => {
          return throwError(() => new Error('2_Fehler beim Speichern des Rezepts.'));
        })
      ).subscribe();
    }
  }


  navigateContainer(event: Event) {
    event.preventDefault();
    this.router.navigate(['/listen-container']);
  }


  isFieldValid(fieldName: keyof Rezept): boolean {
    const fieldValue = this.newRecipe[fieldName];
    return typeof fieldValue === 'string' && fieldValue.trim() !== '';
  }


  //Validierung der Eingabedaten ab hier

  getInputClass(fieldName: keyof Rezept): string {
    // Nur rot anzeigen, wenn das Feld berührt wurde und ungültig ist
    if (fieldName === 'name' && this.nametouched) {
      return this.isFieldValid(fieldName) ? '' : 'invalid';
    } else if (fieldName === 'onlineAdresse' && this.on_adtouched) {
      return this.isFieldValid(fieldName) ? '' : 'invalid';
    }
    return ''; // Standardfarbe, wenn das Feld nicht berührt wurde
  }



  onFieldBlur(fieldName: keyof Rezept): void {
    if (fieldName === 'name') {
      this.nametouched = true; // Markiere das Feld als berührt
    } else if (fieldName === 'onlineAdresse') {
      this.on_adtouched = true; // Markiere das Feld als berührt
    }

    if (!this.isFieldValid(fieldName)) {
      this.showError(fieldName, true);
    } else {
      this.showError(fieldName, false);
    }
  }

}
