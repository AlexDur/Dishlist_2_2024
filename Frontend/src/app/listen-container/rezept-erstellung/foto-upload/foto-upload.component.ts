import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Rezept } from "../../../models/rezepte";

@Component({
  selector: 'app-foto-upload',
  templateUrl: './foto-upload.component.html',
  styleUrls: ['./foto-upload.component.scss']
})
export class FotoUploadComponent {

  @Output() imageUploaded = new EventEmitter<File>(); // Emitter für das hochgeladene Bild
  @Input() rezepte: Rezept[] = [];
  isBildSelected: boolean = false;
  selectedFile: File | null = null;



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Speichert die ausgewählte Datei
      this.isBildSelected = true; // Bild wurde ausgewählt
      this.imageUploaded.emit(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.isBildSelected = false;
    }
  }
}
