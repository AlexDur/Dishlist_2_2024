import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Rezept} from "../../../../models/rezepte";
import {RezeptService} from "../../../../services/rezepte.service";
import {TagService} from "../../../../services/tags.service";

import {Dish, TagsComponent} from "../tags/tags.component"
import {Tag} from "../../../../models/tag";

@Component({
  selector: 'app-listeninhalt',
  templateUrl: './listeninhalt.component.html',
  styleUrls: ['./listeninhalt.component.scss']
})
export class ListeninhaltComponent implements OnChanges{
  @ViewChild(TagsComponent) tagsComponent!: TagsComponent;
  @ViewChild('newRecipeNameInput') newRecipeNameInput?: ElementRef<HTMLInputElement>;
  @Input() rezepte: Rezept[] = [];
  @Input() gefilterteRezepte: Rezept[] = [];

  newRecipe: any = {}
  selectedRow: any;
  istGeaendert: boolean = false;
  istGespeichert: boolean = false;
  showSaveButton: boolean = false;
  showDeleteButton: boolean = false;
  editMode = false;
  rezeptGeladen: boolean = false;
  tagToggleStates: { [key: number]: boolean } = {};
  currentRecipe: Rezept | undefined;
  selectedTag: Set<Tag> = new Set<Tag>();


  constructor( private rezepteService: RezeptService,  private tagService: TagService) {
    this.selectedRow = {};
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rezepte']) {
      console.log('Rezepte aktualisiert:', this.rezepte);
    }
  }

  onselectedTagChanged(selectedTag: Tag[]): void {
    this.selectedTag = new Set(selectedTag);
    console.log('Listeninhalt: selectedTag', selectedTag)
  }

  getSeverity(status: boolean | string): string {
    if (typeof status === 'boolean') {
      return status ? 'info' : 'warning'; // Wenn gekocht, dann 'info', sonst keine Farbe
    } else if (typeof status === 'string') {
      switch (status.toLowerCase()) {
        case 'noch nicht gekocht':
          return 'danger';

        case 'schon gekocht':
          return 'success';

        default:
          return 'null';
      }
    } else {
      return 'null';
    }
  }

  getTagValue(status: boolean, isTagToggled: boolean): string {
    if (isTagToggled) {
      return 'schon gekocht'; // Wenn das Tag getoggled ist
    } else {
      return status ? 'schon gekocht' : 'noch geplant';
    }
  }

  toggleTag(rezept: any) {
    this.tagToggleStates[rezept.id!] = !this.tagToggleStates[rezept.id!];

    // Zusätzlich den `status` im `rezept`-Objekt aktualisieren
    rezept.status = !rezept.status;
    rezept.istGeaendert = true;
  }

  setGeaendert(rezept: Rezept) {
    rezept.istGeaendert = true;
  }

  /*id kann weglassen werden, da die DB die ID automatisch generiert (AUTO INCREMENT)*/
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
  }

  saveChanges(rezept: Rezept) {
    // Erhalt der ausgewählten Tags vom TagService
    const selectedTags: Tag[] = this.tagService.getSelectedTags();
    console.log('listeninhalt: selectedTag', selectedTags)

    // Setzen der ausgewählten Tags für das aktuelle Rezept
    rezept.tags = selectedTags;

    // Überprüfen, ob das Rezept bereits eine ID hat (also bereits existiert)
    if (rezept.id === null || rezept.id === undefined) {
      // Rezept erstellen
      this.rezepteService.createRezept(rezept).subscribe(
        (response) => {
          if (response.body) {
            // ID des neu erstellten Rezepts setzen
            rezept.id = response.body.id;
            this.updateUIAfterSave();
          } else {
            console.error('Fehler: Antwortkörper ist null');
          }
        },
        (error) => {
          console.error('Fehler beim Erstellen des Rezepts', error);
          // Fehlerbehandlung für die Tags
          this.restoreOriginalTags();
        }
      );
    } else {
      // Rezept aktualisieren
      this.rezepteService.updateRezept(rezept.id, rezept).subscribe(
        (response) => {
          if (response.body) {

            // ID des neu erstellten Rezepts setzen
            rezept.id = response.body.id;
            this.updateUIAfterSave();
          } else {
            console.error('Fehler: Antwortkörper ist null');
          }
        },
        (error) => {
          console.error('Fehler beim Aktualisieren des Rezepts', error);
          // Fehlerbehandlung für die Tags
          this.restoreOriginalTags();
        }
      );
    }
  }

  updateUIAfterSave() {
    this.istGeaendert = false;
    this.showSaveButton = false;
    this.showDeleteButton = true;
    this.editMode = false;
    this.istGespeichert = true;
  }


  restoreOriginalTags() {
    // Hier kannst du den Code einfügen, um die ursprünglichen Tags wiederherzustellen
  }

  onRatingChanged(newRating: number, rezept: any) {
    rezept.bewertung = newRating;
    rezept.istGeaendert = true;
  }

  selectRow(rezept: any) {
    this.selectedRow = rezept;
    this.editMode = true;
  }

  deleteRow(id: number) {
    if (this.rezeptGeladen) {
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


  openUrl(url: string): void {
    // Grundlegende Validierung, um sicherzustellen, dass die URL mit "http://" oder "https://" beginnt.
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      console.warn('Ungültige URL');

    }
  }

}
