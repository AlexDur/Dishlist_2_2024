import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,

} from '@angular/core';
import { Rezept } from "../../models/rezepte";
import { Tag } from "../../models/tag";
import { RezeptService } from "../../services/rezepte.service";
import { Router, NavigationEnd  } from "@angular/router";
import { catchError, Observable, tap, throwError } from "rxjs";
import { HttpResponse } from '@angular/common/http';
import {RezeptAntwort} from "../../models/rezeptAntwort";
import {DEFAULT_TAGS} from "../../models/default_tag";
import {TagType} from "../../models/tagType";
import { filter } from 'rxjs/operators';
import { Subscription, combineLatest  } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-rezept-erstellung',
  templateUrl: './rezept-erstellung.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RezeptErstellungComponent implements OnInit, OnDestroy {
  @Output() newRecipeCreated = new EventEmitter<Rezept>();
  @Input() rezepte: Rezept[] = [];
  @Input() gefilterteRezepte: Rezept[] = [];

  private subscriptions: Subscription = new Subscription();
  newRecipe: any = {};
  tags: Tag[] = [...DEFAULT_TAGS];
  selectedTags: Tag[] = [];
  tagError: boolean = false;
  showNameError: boolean = false;
  showOnlineAddressError: boolean = false;
  nametouched:boolean = false;
  on_adtouched: boolean = false;
  selectedCategory: string | null = null;


  dataLoaded = false;

  rezeptForm!: FormGroup;
  isUpdateMode: boolean = false;
  image: any;


  categories = [
    { name: 'Gänge', selected: false },
    { name: 'Küche', selected: false },
    { name: 'Nährwert', selected: false }
  ];


  constructor(
    private rezepteService: RezeptService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}



  // FormGroup erstellen und die bisherigen Formularwerte in Form Controls zu integrieren
  ngOnInit(): void {
    console.log('Initialer Wert von newRecipe:', this.newRecipe);
    console.log('Initialer Update-Modus:', this.isUpdateMode);
    this.rezeptForm = this.rezepteService.createForm(this.newRecipe);

    // Listener für Änderungen des 'name'-Feldes
    this.rezeptForm.get('name')?.valueChanges.subscribe(value => {
      console.log('Neuer Wert für name:', value);
    });

    // Listener für Änderungen des 'onlineAdresse'-Feldes
    this.rezeptForm.get('onlineAdresse')?.valueChanges.subscribe(value => {
      console.log('Neuer Wert für onlineAdresse:', value);
    });

    this.rezepteService.image$.subscribe(image => {
      console.log('Neues Bild erhalten:', image);
      if (image && !this.rezeptForm.get('image')?.value) {
        this.rezeptForm.get('image')?.setValue(image);
      }
    });

    // Überprüfung, ob Formulardaten bei UpdateModus gesetzt werden
    if (this.isUpdateMode) {

      this.rezepteService.updateForm(this.rezeptForm, this.newRecipe);
    }

    // Falls bereits Bild vorhanden ist, setzen
    if (this.newRecipe.image && !this.rezeptForm.get('image')?.value) {
      this.rezeptForm.get('image')?.setValue(this.newRecipe.image);
    }
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


  private mapToTagType(type: string): TagType {
    if (Object.values(TagType).includes(type as TagType)) {
      return type as TagType; // Typen stimmen überein
    }
    throw new Error(`Ungültiger TagType: ${type}`);
  }

  private showError(fieldName: keyof Rezept, show: boolean): void {
    if (fieldName === 'name') {
      this.showNameError = show;
    } else if (fieldName === 'onlineAdresse') {
      this.showOnlineAddressError = show;
    }
  }

  validateAndFormatURL(): void {
    const urlControl = this.rezeptForm.get('onlineAdresse');
    if (urlControl?.value && !/^https?:\/\//.test(urlControl.value)) {
      urlControl.setValue('https://' + urlControl.value); // `https://` hinzufügen, wenn nötig
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
    this.cdr.detectChanges();
  }


  getVisibleTags() {
    // Tags nach `selectedCategory` filtern
    return this.tags.filter(tag => tag.type === this.selectedCategory);
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
    console.log('Aktuelle ausgewählte Tags:', this.selectedTags);
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
    this.rezeptForm.patchValue({
      image: image
    });
    this.newRecipe.image = image;
    console.log('Bild im Formular gespeichert:', image);
  }


  handleClick(event: Event) {
    event.preventDefault();

    if (!this.dataLoaded || !this.image) {
      console.log('Rezept oder Bild noch nicht geladen');
    }

    console.log('Form is valid and data loaded');
    console.log('image in handleClick', this.newRecipe.image);

    this.tagError = false;

    const rezeptToSave = this.newRecipe;
    const formData = this.createFormData(rezeptToSave);

    if (!rezeptToSave.image) {
      console.log('Kein Bild zum Speichern vorhanden!');
    }

    const action$ = this.isUpdateMode
      ? this.rezepteService.updateRezept(rezeptToSave.id, this.createRezeptDTO(rezeptToSave), formData)
      : this.saveRecipe(rezeptToSave);

    action$.pipe(
      tap(response => {
        console.log(this.isUpdateMode ? 'Rezept erfolgreich aktualisiert' : 'Rezept erfolgreich gespeichert', response);
        this.router.navigate(['/listen-container']);
      }),
      catchError(error => {
        console.error(error);
        return throwError(() => new Error('Fehler beim Speichern/Aktualisieren des Rezepts.'));
      })
    ).subscribe();
  }

  saveRecipe(rezeptToSave: Rezept): Observable<HttpResponse<RezeptAntwort>> {
    const formData = this.createFormData(rezeptToSave);

    return rezeptToSave.id
      ? this.rezepteService.updateRezept(rezeptToSave.id, this.createRezeptDTO(rezeptToSave), formData)
      : this.rezepteService.createRezept(rezeptToSave, formData);
  }

  private createFormData(rezeptToSave: Rezept): FormData {
    const formData = new FormData();
    formData.append('rezeptDTO', new Blob([JSON.stringify(this.createRezeptDTO(rezeptToSave))], { type: 'application/json' }));

    if (rezeptToSave.image instanceof File) {
      if (rezeptToSave.image.size > 10 * 1024 * 1024) {
        console.error('Bilddatei überschreitet die maximale Größe von 10 MB.');
        throw new Error('Bild ist zu groß.');
      }
      formData.append('image', rezeptToSave.image);
      console.log('Bild zum Speichern:', rezeptToSave.image);
    } else {
      console.warn('Kein optionales Bild vorhanden:', rezeptToSave.image);
    }

    return formData;
  }

  private createRezeptDTO(rezeptToSave: Rezept) {
    return {
      id: rezeptToSave.id,
      name: rezeptToSave.name,
      onlineAdresse: rezeptToSave.onlineAdresse,
      tags: Array.isArray(rezeptToSave.tags) ? rezeptToSave.tags.map(tag => ({
        id: tag.id,
        type: tag.type ?? 'defaultType',
        label: tag.label,
        selected: tag.selected,
        count: tag.count,
      })) : []
    };
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
