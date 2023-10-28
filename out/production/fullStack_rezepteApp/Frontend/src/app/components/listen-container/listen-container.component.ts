import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Table} from "primeng/table";
import {Rezept} from "../../domain/rezepte";
import {RezepteService} from "../../services/rezepte.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-listen-container',
  templateUrl: './listen-container.component.html',
  styleUrls: ['./listen-container.component.scss']
})
export class ListenContainerComponent implements OnInit{
@ViewChild('newRecipeNameInput') newRecipeNameInput!: ElementRef<HTMLInputElement>;
addRowIndex: number | null = null;
rezepte: Rezept[] = [];
loading: boolean = true
statuses!: any[];

newRecipe: any = {}
constructor( private rezepteService: RezepteService, private http: HttpClient) {}

  ngOnInit(): void {
    this.rezepteService.getRezepteMini().subscribe((rezepte) => {
      this.rezepte = rezepte;
      this.loading = false;

      this.rezepte.forEach((rezept) => (rezept.date = new Date(<Date>rezept.date)));
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
    console.log('getSeverity function called with status:', status);
    switch (status.toLowerCase()) {
      case 'noch nicht gekocht':
        console.log('Status is noch nicht gekocht');
        return 'danger';

      case 'schon gekocht':
        return 'success';

      default:
        return 'null'
    }
  }

  onSubmit(){

    const apiUrl = 'http://localhost:8080/api/rezepte';

    // Senden Sie das neue Rezept an Ihre Backend-API
    this.http.post(apiUrl, this.newRecipe).subscribe(
      (response) => {
        console.log('Rezept erfolgreich hinzugefügt', response);

        // Hier können Sie die Anzeige aktualisieren, das Formular zurücksetzen oder andere Aktionen ausführen
        this.newRecipe = {};
      },
      (error) => {
        console.error('Fehler beim Hinzufügen des Rezepts', error);
      }
    );
  }

  addRow() {
    // Fügen Sie die neue Zeile am Anfang der Liste rezepte hinzu
    this.rezepte.unshift({
      id: this.generateUniqueId(),
      name: '',
      online_links: '',
      date: new Date(),
      person: '',
      status: '',
      rating: 0
    });

    // Setzen Sie den Index der hinzugefügten Zeile
    this.addRowIndex = 0;

    // Leeren Sie das Formular
    this.newRecipe = {
      rezept: '',
      onlineadresse: '',
      datum: '',
      koch: '',
      status: '',
      bewertung: ''
    };

    // Setzen Sie den Fokus auf das Input-Element in der neuen Zeile
    setTimeout(() => {
      this.newRecipeNameInput.nativeElement.focus();
    });
  }

  onAddRowFocus() {
    // Stellen Sie sicher, dass Sie den Fokus auf das richtige Input-Element in der neuen Zeile setzen
    if (this.addRowIndex === 0) {
      setTimeout(() => {
        this.newRecipeNameInput.nativeElement.focus();
      });
    }
  }

  cancelAddRow() {
    // Entfernen Sie die hinzugefügte Zeile, wenn der Vorgang abgebrochen wird
    if (this.addRowIndex === 0) {
      this.rezepte.shift();
    }
    this.addRowIndex = null;
  }

  private generateUniqueId() {
    return 0;
  }

  editMode = false; // Variable, um den Bearbeitungsmodus zu verfolgen
  selectedRow: any; // Variable, um die ausgewählte Zeile zu speichern

// Methode zum Aktivieren des Bearbeitungsmodus für eine Zeile
  activateEditMode(rowData: Rezept) {
    this.editMode = true;
    this.selectedRow = rowData;
  }


// Methode zum Speichern der Bearbeitungen
  saveChanges() {
    console.log("Before saving changes", this.rezepte, this.selectedRow, this.editMode);
    // Speichern Sie die Bearbeitungen in Ihrer Datenquelle
    this.editMode = false; // Beenden Sie den Bearbeitungsmodus
    console.log("After saving changes", this.rezepte, this.selectedRow, this.editMode);
    // Aktualisieren Sie die Anzeige, wenn erforderlich
  }



}


