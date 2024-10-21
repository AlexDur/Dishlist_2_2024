import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Rezept } from "../../../models/rezepte";

@Component({
  selector: 'app-foto-upload',
  templateUrl: './foto-upload.component.html',
  styleUrls: ['./foto-upload.component.scss']
})
export class FotoUploadComponent {

  @Output() imageUploaded = new EventEmitter<File>(); // Emitter für das hochgeladene Bild
  @Input() rezepte: Rezept[] = []; // Liste der Rezepte



  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.imageUploaded.emit(file); // Emit das ausgewählte Bild
    }
  }
}
