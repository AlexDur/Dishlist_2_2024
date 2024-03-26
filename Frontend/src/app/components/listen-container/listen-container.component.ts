import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Table} from "primeng/table";
import {Rezept} from "../.././models/rezepte";
import {RezeptService} from "../../services/rezepte.service";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";

interface RezeptAntwort {
  id: number; // Stellen Sie sicher, dass der Typ mit Ihrer API übereinstimmt
  message?: string; // Optional, falls Ihre Antwort eine Nachricht enthält
}

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
  editMode = true;
  rezeptGeladen: boolean = false;

  tagToggleStates: { [key: number]: boolean } = {};
  constructor( private rezepteService: RezeptService, private http: HttpClient) {
    this.selectedRow = {};
  }



  ngOnInit(): void {
    this.loadRezept();
    console.log('selectedRow in ngOnInit:', this.selectedRow);
    this.rezepteService.getAlleRezepte().subscribe((rezepte) => {
      console.log('Geladene Rezepte:', rezepte);
      this.rezepte = rezepte.map((rezept) => {
        if (rezept.datum) {
          rezept.datum = new Date(rezept.datum);
        }
      /*  rezept.showDeleteButton = true;*/
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
    this.editMode = true;

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
        (response) => { // Der Typ HttpResponse<RezeptAntwort> wird implizit angenommen
          if (response.body) {
            console.log('Geparste Antwort:', response.body);
            console.log('Rezept ganz erfolgreich erstellt?', response.body.id);
            rezept.id = response.body.id;

            this.rezepte.unshift(rezept);
            this.istGeaendert = false;
            this.showSaveButton = false;
            this.showDeleteButton = true;
            this.editMode = false;
            this.istGespeichert = true;
          } else {
            console.error('Fehler: Antwortkörper ist null');
            // Hier könnten Sie weitere Fehlerbehandlungen durchführen.
          }
        },
        (error) => { // Fehler-Callback korrekt platzieren
          console.error('Fehler beim Erstellen des Rezepts', error);
        }
      );
    } else {
      // Behandlung der Aktualisierung vorhandener Rezepte
      this.rezepteService.updateRezept(rezept.id, rezept).subscribe(
        (response) => { // Der Rückgabetyp wird hier nicht explizit benötigt
          console.log('Rezept erfolgreich aktualisiert', response);
          this.showSaveButton = false;
          this.showDeleteButton = true;
          // Finden Sie das zu aktualisierende Rezept in der Liste und aktualisieren Sie es
          const index = this.rezepte.findIndex(r => r.id === rezept.id);
          if (index !== -1) {
            this.rezepte[index] = {...rezept};
          }
          this.istGespeichert = true;
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

/*  loadRezept() {
    // Hier wird das Rezept asynchron geladen
    // Stellen Sie sicher, dass rezeptGeladen auf true gesetzt wird, wenn das Rezept vollständig geladen ist
    this.rezeptGeladen = true;
  }*/

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
            this.rezepte = this.rezepte.filter(rezept => rezept.id !== id);
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

  loadRezept(): Promise<void> {
    // Hier wird das Rezept asynchron geladen
    // Stellen Sie sicher, dass rezeptGeladen auf true gesetzt wird, wenn das Rezept vollständig geladen ist
    return new Promise<void>((resolve, reject) => {
      // Stellen Sie sicher, dass rezeptGeladen auf true gesetzt wird, wenn das Rezept vollständig geladen ist
      // Annahme: this.rezeptGeladen wird auf true gesetzt, wenn das Rezept erfolgreich geladen ist
      this.rezeptGeladen = true; // Annahme: Setzen Sie hier this.rezeptGeladen auf true, wenn das Rezept geladen wurde
      resolve();
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


