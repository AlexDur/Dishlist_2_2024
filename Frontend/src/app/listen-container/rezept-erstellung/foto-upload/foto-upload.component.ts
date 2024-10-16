import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Rezept } from "../../../models/rezepte";

@Component({
  selector: 'app-foto-upload',
  templateUrl: './foto-upload.component.html',
  styleUrls: ['./foto-upload.component.scss']
})
export class FotoUploadComponent implements OnInit {

  @Output() imageUploaded = new EventEmitter<File>(); // Emitter für das hochgeladene Bild
  @Input() rezepte: Rezept[] = []; // Liste der Rezepte
  bildUrl: string = ""; // Bild-URL für das Rezept

  ngOnInit() {
    // Überprüfen, ob ein Bild vorhanden ist und das Platzhalterbild festlegen
    this.bildUrl = this.rezepte.length > 0 && this.rezepte[0].bildUrl ? this.rezepte[0].bildUrl : '/static/images/Platzhalter_keinUpload.jpg';
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.imageUploaded.emit(file); // Emit das ausgewählte Bild
    }
  }
}
