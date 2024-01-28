import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Table} from "primeng/table";
import {Rezept} from "../.././models/rezepte";
import {RezeptService} from "../../services/rezepte.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-listen-container',
  templateUrl: './listen-container.component.html',
  styleUrls: ['./listen-container.component.scss']
})
export class ListenContainerComponent implements OnInit{
@ViewChild('newRecipeNameInput') newRecipeNameInput?: ElementRef<HTMLInputElement>;
rezepte: Rezept[] = [];
newRecipe: any = {}
  istGeaendert: boolean = false;
  istGespeichert: boolean = false;
  showSaveButton: boolean = true;
  showDeleteButton: boolean = false;
  editMode = true; // Variable, um den Bearbeitungsmodus zu verfolgen
  selectedRow: any; // Variable, um die ausgewählte Zeile zu speichern
private backendUrl = 'http://localhost:8080';

  tagToggleStates: { [key: number]: boolean } = {};
  constructor( private rezepteService: RezeptService, private http: HttpClient) {
    this.selectedRow = {};
  }

  ngOnInit(): void {
    console.log('selectedRow in ngOnInit:', this.selectedRow);
    this.rezepteService.getAlleRezepte().subscribe((rezepte) => {
      console.log('Geladene Rezepte:', rezepte);
      this.rezepte = rezepte;
      this.rezepte.forEach((rezept) => (rezept.datum = new Date(<Date>rezept.datum)));
    });
  }

/*  clear(table: Table) {
    table.clear();
  }*/

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

  toggleTag(rezept: Rezept) {
    this.tagToggleStates[rezept.id!] = !this.tagToggleStates[rezept.id!];
  }


  /*id kann ich weglassen, das die DB die ID automatisch generiert (AUTO INCREMET)*/
  addRow() {
    console.log('selectedRow in addRow:', this.selectedRow);
    const currentDate = new Date();

    this.newRecipe = {
      name: '',
      onlineAdresse: '',
      datum: currentDate,
      person: '',
      status: false, // Hier wird der Status standardmäßig auf "geplant" (false) gesetzt
      rating: 0,
    };

    this.rezepte.unshift(this.newRecipe);
    this.editMode = true; // Setzen Sie editMode auf true, um Eingabefelder anzuzeigen

    // Setzen von selectedRow auf das neue Rezept, um Bearbeitungsmodus zu aktivieren
    this.selectedRow = this.newRecipe;

    // Setzen des Fokus auf das Input-Element in der neuen Zeile
    setTimeout(() => {
      this.newRecipeNameInput?.nativeElement.focus();
    });
  }

  saveChanges(rezept: Rezept) {
    console.log('selectedRow in saveChanges:', this.selectedRow);
    console.log("Aktueller Wert von onlineAdresse", rezept.onlineAdresse);
    console.log("Before saving changes", rezept);

    if (rezept.id === null || rezept.id === undefined) {
      this.rezepteService.createRezept(rezept).subscribe(
        (response) => {
          console.log('Rezept ganz erfolgreich erstellt', response);

          this.rezepte.unshift();
          this.istGeaendert = false;
          this.istGespeichert = true;
          this.showSaveButton = false;
          this.showDeleteButton = true;
        },
        (error) => {
          console.error('Fehler beim Erstellen des Rezepts', error);
        }
      );
    } else {
      // Behandlung der Aktualisierung vorhandener Rezepte
      this.rezepteService.updateRezept(rezept.id, rezept).subscribe(
        (response) => {
          console.log('Rezept erfolgreich aktualisiert', response);
          this.showSaveButton = false;
          this.showDeleteButton = true;
          // Finden Sie das zu aktualisierende Rezept in der Liste und aktualisieren Sie es
          const index = this.rezepte.findIndex(r => r.id === rezept.id);
          if (index !== -1) {
            this.rezepte[index] = {...rezept};
          }
        },
        (error) => {
          console.error('Fehler beim Aktualisieren des Rezepts', error);
        }
      );
    }
  }


/*  editRow(rezept: Rezept) {
    this.selectedRow = rezept;
    this.editMode = true;
  }*/

/*  cancelEdit() {
    this.selectedRow = null;
    this.editMode = false;
  }*/

  deleteRow(id: number) {
    if (id !== undefined) {
      this.rezepteService.deleteRezept(id).subscribe(
        () => {
          console.log('Rezept erfolgreich gelöscht');
          // Weitere Aktionen nach dem Löschen des Rezepts
        },
        (error) => {
          console.error('Fehler beim Löschen des Rezepts', error);
        }
      );
    }
  }


}


