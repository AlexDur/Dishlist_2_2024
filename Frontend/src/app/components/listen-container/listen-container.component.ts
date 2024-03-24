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
  selectedRow: any;
  istGeaendert: boolean = false;
  istGespeichert: boolean = false;
  showSaveButton: boolean = true;
  showDeleteButton: boolean = false;
  editMode = true; // Variable, um den Bearbeitungsmodus zu verfolgen
/*private backendUrl = 'http://localhost:8080';*/

  tagToggleStates: { [key: number]: boolean } = {};
  constructor( private rezepteService: RezeptService, private http: HttpClient) {
    this.selectedRow = {};
  }

  ngOnInit(): void {
    console.log('selectedRow in ngOnInit:', this.selectedRow);
    this.rezepteService.getAlleRezepte().subscribe((rezepte) => {
      console.log('Geladene Rezepte:', rezepte);
      this.rezepte = rezepte.map((rezept) => {
        // Konvertiere das Datum, wenn es definiert ist
        if (rezept.datum) {
          rezept.datum = new Date(rezept.datum);
        }
        return rezept;
      });
    });
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


  /*id kann ich weglassen, das die DB die ID automatisch generiert (AUTO INCREMET)*/
  addRow() {
    console.log('selectedRow in addRow:', this.selectedRow);
    const currentDate = new Date();

    this.newRecipe = {
      name: '',
      onlineAdresse: '',
      datum: currentDate,
      person: '',
      status: false,
      bewertung: 0,
    };

    this.rezepte.unshift(this.newRecipe);
    this.editMode = true; // Setzen des editMode auf true, um Eingabefelder anzuzeigen

    // Setzen von selectedRow auf das neue Rezept, um Bearbeitungsmodus zu aktivieren
    this.selectedRow = this.newRecipe;

    // Setzen des Fokuses auf das Input-Element in der neuen Zeile
    setTimeout(() => {
      this.newRecipeNameInput?.nativeElement.focus();
    });
  }

  saveChanges(rezept: Rezept) {
    console.log('selectedRow in saveChanges:', this.rezepte);

    if (rezept.id === null || rezept.id === undefined) {
      this.rezepteService.createRezept(rezept).subscribe(
        (response) => {
          console.log('Rezept ganz erfolgreich erstellt', response);

          this.rezepte.unshift();
          this.istGeaendert = false;
          this.istGespeichert = true;
          this.showSaveButton = false;
          this.showDeleteButton = true;
          this.editMode = false;
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

  onRatingChanged(newRating: number, rezept: any) {
    rezept.bewertung = newRating;
    rezept.istGeaendert = true;
  }


  selectRow(rezept: any) {
    this.selectedRow = rezept;
  }

  deleteRow(id: number) {
    console.log('Die ID vor löschen:',id)
    if (id) {
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

  openUrl(url: string): void {
    // Grundlegende Validierung, um sicherzustellen, dass die URL mit "http://" oder "https://" beginnt.
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      console.warn('Ungültige URL');

    }
  }

}


