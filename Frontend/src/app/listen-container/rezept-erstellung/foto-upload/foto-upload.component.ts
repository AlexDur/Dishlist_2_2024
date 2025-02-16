import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Rezept } from "../../../models/rezepte";
import {Router} from "@angular/router";
import { FormGroup } from '@angular/forms';
import {RezeptService} from "../../../services/rezepte.service";

/*Bildauswahl und Weiterleitung an Cropper*/
@Component({
  selector: 'app-foto-upload',
  templateUrl: './foto-upload.component.html'
})
export class FotoUploadComponent implements OnInit{
  @Input() rezeptForm!: FormGroup;  // Reactive Form als Input erhalten
  @Input() rezepte: Rezept[] = [];
  @Input() isBildSelected: boolean = false;
  @Output() imageUploaded = new EventEmitter<File>();

  selectedFile: File | null = null;


  constructor(private router: Router, private rezepteService: RezeptService) {
  }

  ngOnInit(): void {
    // Abonniere das Observable, um das zugeschnittene Bild zu erhalten
    this.rezepteService.image$.subscribe(image => {
      if (image) {
        this.isBildSelected = true;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isBildSelected = true;

      // Rufe die Validierungsfunktion auf
      const validation = this.validateFile(file);

      if (!validation.isValid) {
        // Zeige die Fehlermeldung an und breche den Upload ab
        alert(validation.message);
        return;
      }

      this.selectedFile = file;
      this.isBildSelected = true;

      // Gebe das ausgewählte Bild an die Elternkomponente weiter
      this.imageUploaded.emit(this.selectedFile);

      // Speichern in der Form
      this.rezeptForm.patchValue({
        image: this.selectedFile
      });

      // Erstelle eine Data-URL vom Bild
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageUrl = e.target.result; // Data-URL des Bildes

        // Navigiere zur Cropping-Ansicht und übergebe die URL
        this.navigateToCropper(imageUrl);
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.isBildSelected = false;
    }
  }




  validateFile(file: File): { isValid: boolean, message?: string } {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;

    // Validierung: Überprüfe das Dateiformat
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, message: 'Ungültiges Dateiformat. Erlaubt sind nur JPEG und PNG.' };
    }

    // Validierung: Überprüfe die Dateigröße
    if (file.size > maxSize) {
      return { isValid: false, message: 'Das Bild ist zu groß. Maximale Größe ist 5 MB.' };
    }

    // Falls alles in Ordnung ist
    return { isValid: true };
  }


  navigateToCropper(imageUrl: string): void {
    this.router.navigate(['/bildbearbeitung'], { queryParams: { imageUrl } });
  }

}
