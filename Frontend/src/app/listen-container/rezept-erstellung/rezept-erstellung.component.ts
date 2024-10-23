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
  showNameError: boolean = false;
  showOnlineAddressError: boolean = false;
  nametouched:boolean = false;
  on_adtouched: boolean = false;

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
        console.log('Aktuelles Rezept:', this.newRecipe);
      }
      // Wenn kein Rezept vorhanden ist, eine neue Instanz initialisieren
      else {
        this.initNewRecipe();
      }
    });
  }

  //Neues Rezept mit Standardwerten befüllt
  initNewRecipe() {
    this.newRecipe = {
      name: '',
      onlineAdresse: '',
      tags: [],
      image: null
    };
/*    this.resetTags();*/
    /*this.selectedTags = [];*/
  }

/*  resetTags() {
    // Initialisiert Tags neu und setzt `selected` auf false
    this.tags = this.tagService.getTags().map(tag => ({
      ...tag,
      selected: false
    }));
    this.cdr.detectChanges();
  }*/

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

  onImageUploaded(image: File): void {
    this.newRecipe.image = image; // Bild im Rezept speichern
    console.log('Hochgeladenes Bild:', this.newRecipe.image);
  }



  /*  private prepareTags(tags: Tag[]): string {
      return JSON.stringify(tags.map(tag => ({
        label: tag.label,
        count: 0,
        selected: true,
        type: 'Gerichtart' || 'Kueche'
      })));
    }*/

  private createRezeptObj(rezept: Rezept): any {
    const rezeptObj = {
      name: rezept.name,
      onlineAdresse: rezept.onlineAdresse,
      tags: this.selectedTags,
      image: this.newRecipe.image ? this.newRecipe.image : null
    };

    console.log('createRezeptObj', rezeptObj)
    return rezeptObj
  }

  //Observable für die Anfragen im return
  saveRecipe(rezept: Rezept): Observable<HttpResponse<RezeptAntwort>> {
    /*console.log('Selected Tags before saving:', this.selectedTags);*/

    const rezeptObj = this.createRezeptObj(this.newRecipe);
    console.log('rezeptObj:', rezeptObj)
    const formData = new FormData();

    // Bild anhängen (wenn vorhanden und nicht bereits angehängt)
    if (this.newRecipe.image instanceof Blob || this.newRecipe.image instanceof File) {
      // Überprüfen, ob das Bild bereits in formData vorhanden ist
      if (!formData.has('image')) {
        formData.append('image', this.newRecipe.image);
      } else {
        console.warn('Bild ist bereits in FormData vorhanden:', this.newRecipe.image);
      }
    } else {
      console.warn('Bild ist kein gültiges File oder Blob:', this.newRecipe.image);
    }


    // Tags anhängen
    if (rezeptObj.tags && rezeptObj.tags.length > 0) {
      formData.append('tags', JSON.stringify(rezeptObj.tags));
    }

// Rezeptdaten anhängen
    formData.append('name', rezeptObj.name);
    formData.append('onlineAdresse', rezeptObj.onlineAdresse);



    // Rezept-Inputdaten anhängen, mit Überprüfung
  /*  const rezeptBlob = new Blob([JSON.stringify(rezeptObj)], { type: 'application/json' });
    if (!formData.has('rezept')) {
      formData.append('rezept', rezeptBlob);
    } else {
      console.warn('Rezept ist bereits in FormData vorhanden:', rezeptObj);
    }*/

/*    console.log('Rezept-Objekt mit Tags vor dem Blob:', rezeptObj);

    console.log('FormData-Inhalte vor dem Senden_1:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });*/
    console.log('FormData-Inhalte vor dem Senden_2:', Array.from((formData as any).entries()));
    console.log('Tags im Rezept-Objekt:', rezeptObj.tags);


    // this.rezepteService.... wird aufgerufen, um ein neues Rezept zu erstellen.
      // neue Anfrage mit Rezeptdaten und Bilddaten wird an Server gesendet (via Aufruf von create.Rezept)
      // pipe um Operatoren auf das Observable anzuwenden
      // tap um Nebenffekte zu erzeugen ohne die Daten selbst zu verändern
      return this.rezepteService.createRezept(rezeptObj, formData).pipe(
        tap(response => {
          console.log('Rezept erfolgreich gespeichert:', response);
          this.newRecipeCreated.emit(this.newRecipe);
          this.updateTagCount();
        }),
        catchError(error => {
          console.error('Fehler beim Speichern des Rezepts:', error);
          return throwError(() => new Error('Fehler beim Speichern des Rezepts'));
        })
      );
    }



  handleClick(event: Event) {
    event.preventDefault();

  /*  if (this.selectedTags.length === 0) {
      this.tagError = true; // Setzt die Error-Flag
      return;
    }

    this.tagError = false;*/
    // Rezept speichern
    const rezeptToSave = this.newRecipe;

    this.saveRecipe(rezeptToSave).subscribe(
      response => {
        console.log('Rezept erfolgreich gespeichert:', response);
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

/*  base64ToBlob(base64Image: string): Blob {
    const byteString = atob(base64Image.split(',')[1]);
    const mimeString = base64Image.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }*/



}
