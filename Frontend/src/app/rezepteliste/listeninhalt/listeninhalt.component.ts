import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Rezept} from "../../models/rezepte";
import {RezeptService} from "../../services/rezepte.service";
import {TagService} from "../../services/tags.service";

import {Dish, TagsComponent} from "../tags/tags.component"
import {Tag} from "../../models/tag";

@Component({
  selector: 'app-listeninhalt',
  templateUrl: './listeninhalt.component.html',
  styleUrls: ['./listeninhalt.component.scss']
})
export class ListeninhaltComponent implements OnInit{
  @ViewChild(TagsComponent) tagsComponent!: TagsComponent;
  @ViewChild('newRecipeNameInput') newRecipeNameInput?: ElementRef<HTMLInputElement>;
  @Input() gefilterteRezepte: Rezept[] = [];
  /*@Input() originalRezepte: Rezept[] = [];*/
/*  @Output() rezepteChanged: EventEmitter<Rezept[]>;*/
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
/*    this.rezepteChanged = new EventEmitter<Rezept[]>();*/
  }


  ngOnInit(): void {
    this.rezepteService.getAlleRezepte().subscribe((gefilterteRezepte) => {
      console.log('Geladene Rezepte:', gefilterteRezepte);
      this.gefilterteRezepte = gefilterteRezepte.map((rezeptGefiltert) => {
        if (rezeptGefiltert.datum) {
          rezeptGefiltert.datum = new Date(rezeptGefiltert.datum);
        }
        return rezeptGefiltert;
      });

      // Annahme: Um das erste Rezept aus der Liste als currentRecipe setzen
      if (this.gefilterteRezepte.length > 0) {
        const firstRezeptId = this.gefilterteRezepte[0]?.id;
        if (firstRezeptId !== undefined) {
          // Nur wenn Rezepte vorhanden sind, loadRezept() aufrufen
          this.loadRezept();
        }
      }
    });
  }

  loadRezept(): Promise<void> {
    // Hier wird das Rezept asynchron geladen
    // rezeptGeladen muss auf true gesetzt sein, wenn das Rezept vollständig geladen ist
    return new Promise<void>((resolve, reject) => {
      // Annahme: this.rezeptGeladen wird auf true gesetzt, wenn das Rezept erfolgreich geladen ist
      this.rezeptGeladen = true;
      resolve();

    });
  }

  onselectedTagChanged(selectedTag: Tag[]): void {
    this.selectedTag = new Set(selectedTag);
    console.log('Listeninhalt: selectedTag', selectedTag)
  }

  getSeverity(status: boolean | string): string {
    if (typeof status === 'boolean') {
      // Behandlung boolescher Werte
      return status ? 'geplant' : 'gekocht';
    } else if (typeof status === 'string') {
      // Behandlung von String-Werten
      switch (status.toLowerCase()) {
        case 'noch nicht gekocht':
          console.log('Status is noch nicht gekocht');
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
      return 'gekocht'; // Wenn das Tag getoggled ist
    } else {
      return status ? 'gekocht' : 'geplant';
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
    const selectedTags:  Tag[] = this.tagService.getSelectedTags();
    console.log('listeninhalt: selectedTag', selectedTags)

    // Setzen der ausgewählten Tags für das aktuelle Rezept
    rezept.tags = selectedTags;

    if (rezept.id === null || rezept.id === undefined) {
      // Rezept erstellen
      this.rezepteService.createRezept(rezept).subscribe(
        (response) => {
          if (response.body) {
            // ID des neu erstellten Rezepts setzen
            rezept.id = response.body.id;
            this.istGeaendert = false;
            this.showSaveButton = false;
            this.showDeleteButton = true;
            this.editMode = false;
            this.istGespeichert = true;
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
          // Rest des Codes...
        },
        (error) => {
          console.error('Fehler beim Aktualisieren des Rezepts', error);
          // Fehlerbehandlung für die Tags
          this.restoreOriginalTags();
        }
      );
    }
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
  }

  deleteRow(id: number) {
    this.loadRezept().then(() => {
      console.log("Rezept vor Löschung geladen", this.rezeptGeladen);
      console.log('Die ID vor dem Löschen:', id);

      // Überprüfen, ob das Rezept geladen wurde
      if (this.rezeptGeladen) {
        // Die deleteRow-Methode wird nur aufgerufen, wenn das Rezept geladen wurde
        console.log('Die deleteRow-Methode wird aufgerufen, da das Rezept geladen ist');

        // Aufruf des RezeptService, um das Rezept zu löschen
        this.rezepteService.deleteRezept(id).subscribe(
          () => {
            console.log('Rezept erfolgreich gelöscht');

            // Logik, um das gelöschte Rezept aus der Liste zu entfernen
            this.gefilterteRezepte = this.gefilterteRezepte.filter(rezepeGefiltert => rezepeGefiltert.id !== id);
          },
          (error) => {
            console.error('Fehler beim Löschen des Rezepts', error);
          }
        );
      } else {
        // Das Rezept wurde noch nicht geladen
        console.log('Das Rezept wurde noch nicht geladen. Die deleteRow-Methode wird nicht aufgerufen.');
      }
    });
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
