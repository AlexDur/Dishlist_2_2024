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
addRowIndex: number | null = null;
rezepte: Rezept[] = [];
statuses!: any[];
newRecipe: any = {}
private backendUrl = 'http://localhost:8080';
constructor( private rezepteService: RezeptService, private http: HttpClient) {}

  ngOnInit(): void {
    this.rezepteService.getAlleRezepte().subscribe((rezepte) => {
      this.rezepte = rezepte;


      this.rezepte.forEach((rezept) => (rezept.datum = new Date(<Date>rezept.datum)));
    });

    this.statuses = [
      { label: 'Noch nicht gekocht', value: 'noch nicht gekocht' },
      { label: 'Schon (x) gekocht', value: 'schon gekocht' },
    ];
    console.log('statuses array:', this.statuses);
  }


  clear(table: Table) {
    table.clear();
  }

  getSeverity(status: string) {
    if (typeof status === 'string') { // Überprüfen, ob status ein String ist
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
      return 'null'; // Wenn status kein String ist, geben Sie 'null' zurück oder eine andere geeignete Standardwert.
    }
  }


/*  onSubmit() {
    this.rezepteService.createRezept(this.newRecipe).subscribe(
      (response) => {
        console.log('Rezept erfolgreich hinzugefügt', response);
        // Hier können Sie die Anzeige aktualisieren oder andere Aktionen ausführen
        // Z.B.: Um die Liste der Rezepte neu zu laden:
        this.rezepteService.getAlleRezepte().subscribe((rezepte) => {
          this.rezepte = rezepte;
        });
        // Das Formular zurücksetzen
        this.newRecipe = {
          name: '',
          onlineAdresse: '',
          date: new Date(),
          person: '',
          status: '',
          rating: 0
        };
      },
      (error) => {
        console.error('Fehler beim Hinzufügen des Rezepts', error);
      }
    );
  }*/

  /*id kann ich weglassen, das die DB die ID autoamisch generiert (AUTO INCREMET)*/
  addRow() {

    const currentDate = new Date();
    console.log('Aktueller Wert von rezept.date:', this.newRecipe.datum);

    this.rezepte.unshift({
      name: '',
      onlineAdresse: '',
      datum: currentDate,
      person: '',
      status: '',
      rating: 0
    });

    // Setzen des Index der hinzugefügten Zeile
    this.addRowIndex = 0;

    // Leeren des Formulars
    this.newRecipe = {
      rezept: '',
      onlineAdresse: '',
      datum: currentDate,
      koch: '',
      status: '',
      bewertung: ''
    };

    // Setzen des Fokus auf das Input-Element in der neuen Zeile
    setTimeout(() => {
      this.newRecipeNameInput?.nativeElement.focus();
    });
  }

  onAddRowFocus() {
    // Setzen des Fokus auf das richtige Input-Element in der neuen Zeile
    if (this.addRowIndex === 0) {
      setTimeout(() => {
        this.newRecipeNameInput?.nativeElement.focus();
      });
    }
  }

  cancelAddRow() {
    // Entfernen der hinzugefügten Zeile, wenn Vorgang abgebrochen wird
    if (this.addRowIndex === 0) {
      this.rezepte.shift();
    }
    this.addRowIndex = null;
  }

  editMode = false; // Variable, um den Bearbeitungsmodus zu verfolgen
  selectedRow: any; // Variable, um die ausgewählte Zeile zu speichern

// Methode zum Aktivieren des Bearbeitungsmodus für eine Zeile
  activateEditMode(rowData: Rezept) {
    this.editMode = true;
    this.selectedRow = rowData;
  }



// Methode zum Speichern der Bearbeitungen
  saveChanges(rezept: Rezept) {
    console.log("Before saving changes", rezept, this.selectedRow, this.editMode);


    if (rezept.id === null || rezept.id === undefined) {
      this.rezepteService.createRezept(rezept).subscribe(
        (response) => {

          console.log('Serverantwort:', response);
          console.log('Rezept erfolgreich erstellt', response);

          // Anzeige aktualisieren oder andere Aktionen ausführen
          this.rezepteService.getAlleRezepte().subscribe((rezepte) => {
            this.rezepte = rezepte;
          });
        },
        (error) => {
          console.error('Fehler beim Erstellen des Rezepts', error);
        }
      );
    } else {

      this.rezepteService.updateRezept(rezept).subscribe(
        (response) => {
          console.log('Rezept erfolgreich aktualisiert', response);
        },
        (error) => {
          console.error('Fehler beim Aktualisieren des Rezepts', error);
        }
      );
    }

    this.editMode = false; // Beenden des Bearbeitungsmodus
    console.log("After saving changes", rezept, this.selectedRow, this.editMode);


  }

  deleteRow(rezeptId: number) {
    if (confirm('Möchten Sie dieses Rezept wirklich löschen?')) {
      this.rezepteService.deleteRezept(rezeptId).subscribe(
        () => {
          console.log('Rezept erfolgreich gelöscht');
          // Anzeige aktualisieren oder andere Aktionen ausführen
          this.rezepteService.getAlleRezepte().subscribe((rezepte) => {
            this.rezepte = rezepte;
          });
        },
        (error) => {
          console.error('Fehler beim Löschen des Rezepts', error);
        }
      );
    }
  }

}


