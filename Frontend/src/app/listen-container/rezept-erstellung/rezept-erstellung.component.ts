import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
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
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-rezept-erstellung',
  templateUrl: './rezept-erstellung.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RezeptErstellungComponent implements OnInit {
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
  isUpdateMode: boolean = false;
  image: any;
  dataLoaded = false;


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
    console.log('ngOnInit started');

    // Abonniere das aktuelle Rezept
    this.subscriptions.add(
      this.rezepteService.currentRezept$.subscribe(rezept => {
        if (rezept) {
          this.newRecipe = { ...rezept, image: rezept.image };
          this.selectedTags = (rezept.tags || []).map(tag => ({
            ...tag,
            type: this.mapToTagType(tag.type),
          }));
          this.isUpdateMode = true;
        } else {
          this.rezepteService.image$.subscribe(image => {
            if (image) {
              this.initNewRecipe(image);
              console.log('Bild empfangen:', image);
            }
          });
        }
        this.dataLoaded = true;
        this.cdr.detectChanges();
      })
    );

    console.log('ngOnInit completed');
  }




  initNewRecipe(image: File | null = null) {
    this.newRecipe = {
      name: '',
      onlineAdresse: '',
      tags: [],
      image: image || null
    };
    console.log('Neues Rezept aus initNewRecipe:', this.newRecipe);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


  private mapToTagType(type: string): TagType {
    if (Object.values(TagType).includes(type as TagType)) {
      return type as TagType; // Typen stimmen überein
    }
    throw new Error(`Ungültiger TagType: ${type}`); // Optionale Fehlerbehandlung
  }

  private showError(fieldName: keyof Rezept, show: boolean): void {
    if (fieldName === 'name') {
      this.showNameError = show;
    } else if (fieldName === 'onlineAdresse') {
      this.showOnlineAddressError = show;
    }
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

/*  onImageUploaded(image: File): void {
    this.newRecipe.image = image;
    console.log('Hochgeladenes Bild:', this.newRecipe.image);
  }*/

  handleClick(event: Event) {

    event.preventDefault();

    if (this.dataLoaded) {
      console.log('image in handleClick', this.newRecipe.image);
    } else {
      console.log('Rezept oder Bild noch nicht geladen');
    }


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

    //Füge rezeptDTO zu formData hinzu
    formData.append('rezeptDTO', new Blob([JSON.stringify(rezeptDTO)], {type: 'application/json'}));

    //Füge image zu formData hinzu
    if (rezeptToSave.image instanceof File) {
      formData.append('image', rezeptToSave.image);
    }else{
      console.log()
    }

    console.log('formData in HandleClick', formData)

    if (!rezeptToSave.image) {
      console.error('Kein Bild zum Speichern vorhanden!');
      return;
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
      console.log('Bild zum Speichern:', rezeptToSave.image);

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
