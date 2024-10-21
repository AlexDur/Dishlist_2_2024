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



  private prepareTags(tags: Tag[]): string {
    return JSON.stringify(tags.map(tag => ({
      label: tag.label,
      count: 0, // Beispielwert
      selected: true, // Beispielwert
      type: 'Gerichtart' // Beispielwert
    })));
  }

  private createRezeptObj(rezept: Rezept): any {
    return {
      name: rezept.name,
      onlineAdresse: rezept.onlineAdresse,
      tags: this.prepareTags(this.selectedTags),
      image: rezept.image ? null : undefined // Bilddaten optional lassen
    };
  }

  // Füttere also preformdata (vom Typ FormData) mit den Daten aus rezept
/*  private prepareFormData(rezept: Rezept): FormData {
    const preformData = new FormData();

    if (rezept.image) {
      console.log('In prepareFormData: Bild vor dem Hinzufügen zur FormData vor den anderen Attributen:', rezept.image);
      preformData.append('image', rezept.image);
    } else {
      console.warn('Kein Bild gefunden in prepareFormData. FormData wird ohne Bild sein.');
    }
    preformData.append('name', rezept.name || '');
    preformData.append('onlineAdresse', rezept.onlineAdresse || '');

    preformData.append('tags', this.prepareTags(this.selectedTags));
    preformData.append('rezept', new Blob([JSON.stringify(this.createRezeptObj(rezept))], { type: 'application/json' }));

    console.log('newRecipe vor prepareFormData:', this.newRecipe);
    console.log('Bild in newRecipe:', this.newRecipe.image);


    if (this.newRecipe.image instanceof File || this.newRecipe.image instanceof Blob) {
      preformData.append('image', this.newRecipe.image);
      console.log('blob/file?',  this.newRecipe.image)
    } else if (typeof this.newRecipe.image === 'string' && this.newRecipe.image.startsWith('data:image/')) {
      // Bild ist in Base64, konvertiere zu Blob
      const blob = this.base64ToBlob(this.newRecipe.image);
      preformData.append('image', blob);
      console.log('blob?', blob)
    }



    if (this.newRecipe.image instanceof File || this.newRecipe.image instanceof Blob) {
      console.log('Bild ist ein gültiges File oder Blob.');
    } else {
      console.warn('Bild ist kein gültiges File oder Blob:', this.newRecipe.image);
    }
    return preformData;
  }*/

  saveRecipe(rezept: Rezept): Observable<HttpResponse<RezeptAntwort>> {
    console.log('Selected Tags before saving:', this.selectedTags);
    this.newRecipe.tags = this.selectedTags;

    if (this.newRecipe.tags.length > 0) {
      // Direktes Erstellen von FormData
      const preformData = new FormData();

      // Bild anhängen (wenn vorhanden)
      if (this.newRecipe.image instanceof Blob || this.newRecipe.image instanceof File) {
        preformData.append('image', this.newRecipe.image);
      } else {
        console.warn('Bild ist kein gültiges File oder Blob:', this.newRecipe.image);
      }

      // Rezept-Inputdaten anhängen
      preformData.append('rezept', new Blob([JSON.stringify({
        name: this.newRecipe.name || '',
        onlineAdresse: this.newRecipe.onlineAdresse || ''
      })], { type: 'application/json' }));

      // Tags anhängen
      preformData.append('tags', new Blob([JSON.stringify(this.selectedTags)], { type: 'application/json' }));

      // Senden der Anfrage
      return this.rezepteService.createRezept(rezept, preformData).pipe(
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

  isFieldValid(fieldName: keyof Rezept): boolean {
    const fieldValue = this.newRecipe[fieldName];
    return typeof fieldValue === 'string' && fieldValue.trim() !== '';
  }

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




  handleClick(event: Event) {
    event.preventDefault();

    if (this.selectedTags.length === 0) {
      this.tagError = true; // Setzt die Error-Flag
      return;
    }

    this.tagError = false;
    // Rezept speichern
    const rezeptToSave = this.newRecipe;

    this.saveRecipe(rezeptToSave).subscribe(
      response => {
        console.log('Rezept erfolgreich gespeichert:', response);
        this.router.navigate(['/listencontainer']);  // Weiterleitung nach dem Speichern
      },
      error => {
        console.error('Fehler in handleClick:', error);
        // Hier kann zusätzliche Fehlerbehandlung hinzugefügt werden
      }
    );
  }

  onImageUploaded(image: File): void {
    this.newRecipe.image = image; // Bild im Rezept speichern
    console.log('Hochgeladenes Bild:', this.newRecipe.image);
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

  base64ToBlob(base64Image: string): Blob {
    const byteString = atob(base64Image.split(',')[1]);
    const mimeString = base64Image.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }


}
