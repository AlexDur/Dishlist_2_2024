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
import {FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


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
  nametouched: boolean = false;
  on_adtouched: boolean = false;
  selectedCategory: string | null = null;

  rezeptForm!: FormGroup;
  isUpdateMode: boolean = false;
  image: any;
  isLoading = false;


  categories = [
    {name: 'Gänge', selected: false},
    {name: 'Küche', selected: false},
    {name: 'Nährwert', selected: false}
  ];


  constructor(
    private rezepteService: RezeptService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
  }


  // FormGroup erstellen und die bisherigen Formularwerte in Form Controls zu integrieren
  ngOnInit(): void {
    this.loadRezeptToEdit();

    // Erstellen des Formulars mit den geladenen Daten
    this.rezeptForm = this.createForm(this.newRecipe);

    // URL-Formatierung validieren und anpassen bei Änderungen
    this.rezeptForm.get('onlineAdresse')?.valueChanges.subscribe(() => {
      this.validateAndFormatURL();
    });

    // Beobachten, ob ein Bild hochgeladen wird, und Formular entsprechend aktualisieren
    this.rezepteService.image$.subscribe(image => {
      if (image && !this.rezeptForm.get('image')?.value) {
        this.rezeptForm.get('image')?.setValue(image);
      }
    });
  }




  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // Formular erstellen
  createForm(newRecipe: Rezept): FormGroup {
    const tagFormArray = this.fb.array(newRecipe.tags?.map(tag => this.createTagFormGroup(tag)) ?? []);

    return this.fb.group({
      name: [newRecipe.name || '', [Validators.required]],
      onlineAdresse: [newRecipe.onlineAdresse || '', [Validators.required]],
      tags: tagFormArray,
      image: [newRecipe.image || null, []]
    });
  }


  // Formular aktualisieren
  updateForm(form: FormGroup, rezept: Rezept): void {
    form.patchValue({
      name: rezept.name || '',
      onlineAdresse: rezept.onlineAdresse || '',
      image: rezept.image || null,
    });

    const tagsArray = form.get('tags') as FormArray;
    tagsArray.clear(); // Vorherige Tags entfernen
    rezept.tags?.forEach(tag => {
      tagsArray.push(this.createTagFormGroup(tag)); // Neue Tags hinzufügen
    });
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
      urlControl.setValue('https://' + urlControl.value);
    }
  }

  isFormValid(): boolean {
    return this.rezeptForm && this.rezeptForm.status === 'VALID';
  }


  setCategory(category: { name: string; selected: boolean }) {
    event?.preventDefault();
    if (this.selectedCategory === this.mapToTagType(category.name)) {
      this.selectedCategory = null;
    } else {
      this.selectedCategory = this.mapToTagType(category.name);
    }

    category.selected = !category.selected;
    this.cdr.detectChanges();
  }


  getVisibleTags() {
    // Tags nach `selectedCategory` filtern
    if (this.selectedCategory !== null) {
      return this.tags.filter(tag => tag.type === this.selectedCategory);
    } else {
      return [];
    }
  }

  // FormGroup für ein einzelnes Tag erstellen
  createTagFormGroup(tag: any): FormGroup {
    const tagType = this.mapToTagType(tag.type); // Konvertiere den String zu TagType
    if (!tagType) {
      throw new Error(`Ungültiger TagType: ${tag.type}`);
    }

    return this.fb.group({
      id: [tag.id],
      type: [tagType],
      label: [tag.label],
      selected: [tag.selected],
      count: [tag.count],
    });
  }

  private mapToTagType(type: string): TagType | null {
    switch (type) {
      case 'Gänge':
        return TagType.GÄNGE;
      case 'Küche':
        return TagType.KÜCHE;
      case 'Nährwert':
        return TagType.NÄHRWERT;
      default:
        return null; // Für ungültige Typen
    }
  }

  toggleTagSelection(tag: Tag) {
    const tagsArray = this.rezeptForm.get('tags') as FormArray;

    // Index des Tags im FormArray suchen
    const index = tagsArray.value.findIndex(
      (t: Tag) => t.label === tag.label && t.type === tag.type
    );

    if (index !== -1) {
      // Tag existiert bereits im FormArray
      if (tagsArray.at(index).value.selected) {
        tagsArray.removeAt(index);
      } else {
        tagsArray.at(index).patchValue({ selected: true });
      }
    } else {
      const newTag = { ...tag, selected: true };
      tagsArray.push(this.createTagFormGroup(newTag));
    }

    // Direkt das Original-Tag aktualisieren
    tag.selected = !tag.selected;

    // FormArray-Status aktualisieren
    this.rezeptForm.get('tags')?.updateValueAndValidity();
    this.cdr.markForCheck();
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

    const rezeptToSave = this.rezeptForm.value as Rezept; // Rezept aus dem Formular erstellen


    if (this.isUpdateMode) {
      rezeptToSave.id = this.newRecipe.id; // ID des bestehenden Rezepts setzen
    }

    if (this.image instanceof File) {
      rezeptToSave.image = this.image;
    } else if (this.newRecipe.bildUrl) {
      rezeptToSave.bildUrl = this.newRecipe.bildUrl;
    }


    this.isLoading = true;

    this.saveRecipe(rezeptToSave).subscribe({
      next: (response) => {
        console.log(this.isUpdateMode ? 'Rezept erfolgreich aktualisiert' : 'Rezept erfolgreich gespeichert', response);
        this.router.navigate(['/listen-container']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Fehler beim Speichern/Aktualisieren:', error);
        this.isLoading = false;
      }
    });
  }

  //mit window.history.state wird Objekt als Referenz übergeben
  loadRezeptToEdit() {
    const state = window.history.state;
    console.log('Router State:', state);
    if (state && state['data']) {
      this.newRecipe = state['data'];
      this.isUpdateMode = !!this.newRecipe.id; // Setze Update-Modus basierend auf der ID
      console.log('Geladene Rezeptdaten:', this.newRecipe);
    }
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

    // Bildverarbeitung
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
      tags: (rezeptToSave.tags && Array.isArray(rezeptToSave.tags)) // Überprüfe auf Existenz und Array-Typ
        ? rezeptToSave.tags.map(tag => ({
          id: tag.id,
          type: tag.type ?? 'defaultType',
          label: tag.label,
          selected:tag.selected,
          count:tag.count
          // selected und count werden nicht benötigt
        }))
        : []
    };
  }


  isFieldValid(fieldName: keyof Rezept): boolean {
    const fieldValue = this.newRecipe[fieldName];
    return typeof fieldValue === 'string' && fieldValue.trim() !== '';
  }


  //Validierung der Eingabedaten ab hier
/*
  getInputClass(fieldName: keyof Rezept): string {
    // Nur rot anzeigen, wenn das Feld berührt wurde und ungültig ist
    if (fieldName === 'name' && this.nametouched) {
      return this.isFieldValid(fieldName) ? '' : 'invalid';
    } else if (fieldName === 'onlineAdresse' && this.on_adtouched) {
      return this.isFieldValid(fieldName) ? '' : 'invalid';
    }
    return ''; // Standardfarbe, wenn das Feld nicht berührt wurde
  }
*/



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
