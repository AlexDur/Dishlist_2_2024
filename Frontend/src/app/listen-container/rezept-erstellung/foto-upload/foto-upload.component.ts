import { Component, ChangeDetectorRef , ViewChild, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Cropper from 'cropperjs';
import { RezeptService } from "../../../services/rezepte.service";
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-foto-upload', // Beibehaltung des ursprünglichen Selektors
  templateUrl: './foto-upload.component.html', // Aktualisiertes Template
  styleUrls: ['./foto-upload.component.scss'] // Optionale Styles
})
export class FotoUploadComponent implements OnInit {
  @Input() rezeptForm!: FormGroup;
  @Input() isBildSelected: boolean = false;
  @Output() imageUploaded = new EventEmitter<File>();
  selectedFile: File | null = null;
  cropper: any;
  @ViewChild('imageElement') imageElement!: ElementRef;
  isCropperVisible = false; // Steuert die Sichtbarkeit des Croppers
  imageUrl: string | null = null; // Speichert die Data-URL

  constructor(private rezepteService: RezeptService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.rezepteService.image$.subscribe(image => {
      this.isBildSelected = !!image; // Vereinfacht die Überprüfung
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const validation = this.validateFile(file);
      if (!validation.isValid) {
        alert(validation.message);
        return;
      }

      this.selectedFile = file;
      this.isBildSelected = true;
      this.rezeptForm.patchValue({ image: file }); // Direkt in das Formular

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.isCropperVisible = true; // Cropper anzeigen
        this.cdr.detectChanges();
        this.initializeCropper(); // Wichtig für ViewChild
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.isBildSelected = false;
      this.isCropperVisible = false;
      this.imageUrl = null;
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
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
  initializeCropper() {
    if (this.imageUrl && this.imageElement) {
      const image = this.imageElement.nativeElement as HTMLImageElement;
      image.onload = () => {
        this.cropper = new Cropper(image, {
          aspectRatio: 1,
          viewMode: 1,
          scalable: true,
          background: true,
          autoCropArea: 1,
          cropBoxResizable: true,
          cropBoxMovable: true,
          ready: () => {
            this.cropper.setCropBoxData({ left: 0, top: 0, width: 190, height: 190 });
          }
        });
      };
      image.onerror = () => {
        console.error('Fehler beim Laden des Bildes:', this.imageUrl);
      };
      image.src = this.imageUrl;
    }
  }

  cropImage() {
    if (this.cropper) {
      const croppedCanvas = this.cropper.getCroppedCanvas();
      croppedCanvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
          this.rezepteService.setImage(file);
          this.rezeptForm.patchValue({ image: file });
          this.isCropperVisible = false;
          this.isBildSelected = true; // Optional: Setze isBildSelected auf true
          this.imageUrl = null;
          this.cropper.destroy();
          this.cropper = null;
        } else {
          console.error("Fehler beim Erstellen des Blobs.");
        }
      }, 'image/jpeg');
    }
  }

  closeCropper() {
    this.isCropperVisible = false;
    this.imageUrl = null;
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
    this.selectedFile = null;
    this.isBildSelected = false;
  }
}
