import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Rezept } from "../../../models/rezepte";

/*Nur um Bild zu emittieren*/

@Component({
  selector: 'app-foto-upload',
  templateUrl: './foto-upload.component.html'
})
export class FotoUploadComponent {

  @Output() imageUploaded = new EventEmitter<File>();
  @Input() rezepte: Rezept[] = [];
  isBildSelected: boolean = false;
  selectedFile: File | null = null;



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.isBildSelected = true;
      this.imageUploaded.emit(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.isBildSelected = false;
    }
  }
}
