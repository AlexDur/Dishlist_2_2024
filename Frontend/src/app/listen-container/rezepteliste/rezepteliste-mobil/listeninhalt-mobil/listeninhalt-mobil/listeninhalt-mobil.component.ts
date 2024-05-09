import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Rezept} from "../../../../../models/rezepte";
import {RezeptService} from "../../../../../services/rezepte.service";
import {TagService} from "../../../../../services/tags.service";

import {Dish, TagsComponent} from "../../../rezepteliste-desktop/tags/tags.component";
import {Tag} from "../../../../../models/tag";
import {Router} from "@angular/router";

@Component({
  selector: 'app-listeninhaltmobil',
  templateUrl: './listeninhalt-mobil.component.html',
  styleUrls: ['./listeninhalt-mobil.component.scss']
})
export class ListeninhaltMobilComponent implements OnChanges{
  @ViewChild(TagsComponent) tagsComponent!: TagsComponent;
  @ViewChild('newRecipeNameInput') newRecipeNameInput?: ElementRef<HTMLInputElement>;
  @Input() rezepte: Rezept[] = [];
  @Input() gefilterteRezepte: Rezept[] = [];
  @Input() rezepteVerfügbar: boolean = false;

  newRecipe: any = {}
  selectedRow: any;
  istGeaendert: boolean = false;
  istGespeichert: boolean = false;
  showSaveButton: boolean = false;
  showDeleteButton: boolean = false;
  editMode = false;
  rezepteGeladen: boolean = false;
  tagToggleStates: { [key: number]: boolean } = {};
  currentRecipe: Rezept | undefined;
  selectedTag: Set<Tag> = new Set<Tag>();


  constructor( private rezepteService: RezeptService,  private tagService: TagService, private router:Router) {
    this.selectedRow = {};
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rezepte']) {
      console.log('Rezepte aktualisiert:', this.rezepte);

    }

  }

/*TODO: In Rezept speichern - Button unterbringen*/

/*  /!*id kann weglassen werden, da die DB die ID automatisch generiert (AUTO INCREMENT)*!/
  addRow() {
    console.log('selectedRow in addRow:', this.selectedRow);
    const currentDate = new Date();


    this.newRecipe = {
      name: '',
      onlineAdresse: '',
      datum: currentDate,
      status: false,
      bewertung: 0,
    };

    this.gefilterteRezepte.unshift(this.newRecipe);
    this.editMode = true;

    // Setzen von selectedRow auf das neue Rezept, um Bearbeitungsmodus zu aktivieren
    this.selectedRow = this.newRecipe;

    // Setzen des Fokuses auf das Input-Element in der neuen Zeile
    setTimeout(() => {
      this.newRecipeNameInput?.nativeElement.focus();
    });
  }*/




  /*loadRezept(): Promise<void> {
    // Hier wird das Rezept asynchron geladen
    // rezeptGeladen muss auf true gesetzt sein, wenn das Rezept vollständig geladen ist
    return new Promise<void>((resolve, reject) => {
      // Annahme: this.rezeptGeladen wird auf true gesetzt, wenn das Rezept erfolgreich geladen ist
      this.rezeptGeladen = true;
      resolve();

    });*/

/*  onRatingChanged(newRating: number, rezept: any) {
    rezept.bewertung = newRating;
    rezept.istGeaendert = true;
  }*/

  selectRow(rezept: any) {
    this.selectedRow = rezept;
    this.editMode = true;
  }

  /*TODO: Nach Navigation ins Rezept, sollen die Inhalte in den Feldern stehen*/
  navigateForm(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/rezepterstellung']);
  }

  deleteCard(id: number) {

    if (this.rezepteVerfügbar) {
      this.rezepteService.deleteRezept(id).subscribe(
        () => {
          console.log('Rezept erfolgreich gelöscht');
          this.gefilterteRezepte = this.gefilterteRezepte.filter(rezept => rezept.id !== id);
        },
        (error) => {
          console.error('Fehler beim Löschen des Rezepts', error);
        }
      );
    } else {
      console.log('Das Rezept wurde noch nicht geladen. Die deleteRow-Methode wird nicht aufgerufen.');
    }
  }

/*  isRatingReadonly(): boolean {
    // Ihre Logik hier, z.B.:
    return true; // oder eine dynamischere Bedingung
  }*/


  openUrl(url: string | undefined): void {
    if (!url) {
      console.warn('Versuch, eine undefinierte URL zu öffnen');
      return;
    }
    // Füge "http://" hinzu, wenn die URL mit "www." beginnt und kein "http://" oder "https://" hat
    if (url.startsWith('www.')) {
      url = 'http://' + url;
    }
    // Grundlegende Validierung, um sicherzustellen, dass die URL jetzt mit "http://" oder "https://" beginnt
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      console.warn('Ungültige URL');
    }
  }


}
