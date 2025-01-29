import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Rezept } from "../../../models/rezepte";
import {Router} from "@angular/router";
import { FormGroup } from '@angular/forms';

/*Bildauswahl und Weiterleitung an Cropper*/
@Component({
  selector: 'app-foto-upload',
  templateUrl: './foto-upload.component.html'
})
export class FotoUploadComponent implements OnInit{

  @Input() rezepte: Rezept[] = [];
  isBildSelected: boolean = false;
  selectedFile: File | null = null;

  @Input() rezeptForm!: FormGroup;  // Reactive Form als Input erhalten
  @Output() imageUploaded = new EventEmitter<File>();

  constructor(private router: Router) {
  }

  ngOnInit(): void {}


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
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


  navigateToCropper(imageUrl: string): void {
    this.router.navigate(['/bildbearbeitung'], { queryParams: { imageUrl } });
  }

}
