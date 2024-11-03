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
import { HttpResponse } from '@angular/common/http';
import {RezeptAntwort} from "../../models/rezeptAntwort";
import {RezeptDTO} from "../../models/dto/rezept.dto";
import {DEFAULT_TAGS} from "../../models/default_tag.ts";



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
  tags: Tag[] = [...DEFAULT_TAGS];
  selectedTags: Tag[] = [];
  tagError: boolean = false;
  showNameError: boolean = false;
  showOnlineAddressError: boolean = false;
  nametouched:boolean = false;
  on_adtouched: boolean = false;
  selectedCategory: string | null = null;

  categories = ['Gänge', 'Küche', 'Nährwert'];

  constructor(
    private rezepteService: RezeptService,
  /*  private authService: AuthService,*/
    private tagService: TagService,
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

  setCategory(category: string) {
    // Die ausgewählte Kategorie umschalten oder abwählen
    this.selectedCategory = this.selectedCategory === category ? null : category;
  }

  getVisibleTags() {
    // Tags nach `selectedCategory` filtern
    return this.tags.filter(tag => tag.type === this.selectedCategory);
  }

  onTagClick(tag: any) {
    // Logik für das Tag-Klick-Event
    console.log(`${tag.label} wurde geklickt`);
  }

  toggleTagSelection(tag: Tag) {
    tag.selected = !tag.selected
    console.log(`Tag ${tag.label} selected status: ${tag.selected}`);
    if (tag.selected) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags = this.selectedTags.filter(t => t.label !== tag.label);
    }
    this.newRecipe.tags = [...this.selectedTags];
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
  saveRecipe(rezept: Rezept): Observable<HttpResponse<RezeptAntwort>> {
    const rezeptDTO = {
      name: rezept.name,
      onlineAdresse: rezept.onlineAdresse,
      tags: Array.isArray(rezept.tags) ? rezept.tags.map((tag) => ({
        type: tag.type ?? 'defaultType',
        label: tag.label,
        selected: tag.selected,
        count: tag.count,
      })) : []  // Fallback auf leeres Array
    };

    console.log('Erstelltes RezeptDTO:', rezeptDTO);

    const formData = new FormData();
    formData.append('rezeptDTO', new Blob([JSON.stringify(rezeptDTO)], { type: 'application/json' }));

    // @ts-ignore
    if (rezept.image && (rezept.image instanceof File || rezept.image instanceof Blob)) {
      if ((rezept.image as File).size > 10 * 1024 * 1024) {
        console.error('Bilddatei überschreitet die maximale Größe von 10 MB.');
        return throwError(() => new Error('Bild ist zu groß.'));
      }
      formData.append('image', rezept.image);
    } else {
      console.warn('Kein optionales Bild vorhanden:', rezept.image);
    }

    return this.rezepteService.createRezept(rezept, formData).pipe(
      tap(response => {
        console.log('Rezept erfolgreich gespeichert:', response);
        this.updateTagCount()
      }),
      catchError(error => {
        console.error('Fehler beim Speichern des Rezepts:', error);
        return throwError(() => new Error('Fehler beim Speichern des Rezepts.'));
      })
    );
  }

  handleClick(event: Event) {
    event.preventDefault();

    this.tagError = false;
    // Rezept speichern
    const rezeptToSave = this.newRecipe;

    //saveRecipe enthält ja createRezept (s.o.)
    this.saveRecipe(rezeptToSave).subscribe(      response => {

        this.router.navigate(['/listencontainer']);  // Weiterleitung nach dem Speichern
      },
      error => {
        console.error('Fehler in handleClick:', error);

      }
    );
  }



  navigateContainer(event: Event) {
    event.preventDefault();
    this.router.navigate(['/listencontainer']);
  }

  getGerichtartenTags(): Tag[] {
    return this.tagService.getGerichtartenTags();
  }

  getKuechenTags(): Tag[] {
    return this.tagService.getKuechenTags();
  }

  getNaehrwertTags(): Tag[] {
    return this.tagService.getNaehrwertTags();
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

  private showError(fieldName: keyof Rezept, show: boolean): void {
    if (fieldName === 'name') {
      this.showNameError = show;
    } else if (fieldName === 'onlineAdresse') {
      this.showOnlineAddressError = show;
    }
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
