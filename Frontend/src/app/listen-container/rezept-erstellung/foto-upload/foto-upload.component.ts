import { Component, ChangeDetectorRef , ViewChild, ElementRef, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import Cropper from 'cropperjs';
import { RezeptService } from "../../../services/rezepte.service";
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable,Subscription  } from "rxjs";


@Component({
  selector: 'app-foto-upload',
  templateUrl: './foto-upload.component.html'
})
export class FotoUploadComponent implements OnInit, OnDestroy {
  @Input() rezeptForm!: FormGroup;
  @Input() isBildSelected: boolean = false;
  @Output() imageUploaded = new EventEmitter<File>();

  private subscription: Subscription | undefined;
  isBildSelected$: Observable<boolean>;
  selectedFile: File | null = null;
  cropper: any;
  @ViewChild('imageElement') imageElement!: ElementRef;
  isCropperVisible = false; // Steuert die Sichtbarkeit des Croppers
  imageUrl: string | null = null; // Speichert die Data-URL

  constructor(private rezepteService: RezeptService, private cdr: ChangeDetectorRef, private router: Router) {
    this.isBildSelected$ = this.rezepteService.isBildSelected$
  }

  ngOnInit(): void {


    this.subscription = this.rezepteService.image$.subscribe(image => {
      // Setze die Bildauswahl basierend auf dem Bild
      if (image) {
        this.isBildSelected = true;
      } else {
        this.isBildSelected = false;
        this.resetImageSelection(); // Setze die Bildauswahl zurück, wenn kein Bild vorhanden ist
      }
      this.rezepteService.setImageSelected(image); // Aktualisiere den Bildstatus im Service
    });



    this.subscription = this.isBildSelected$.subscribe(value => {
      this.isBildSelected = value;
      if (!value) {
        this.selectedFile = null;
        this.imageUrl = null;
        if (this.cropper) {
          this.cropper.destroy();
          this.cropper = null;
        }
      }
      this.cdr.detectChanges();
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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

      // Setze die ausgewählte Datei
      this.selectedFile = file;
      this.rezepteService.setIsBildSelected(true);
      this.rezeptForm.patchValue({ image: file }); // Direkt in das Formular

      // Lese die Datei mit FileReader
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result; // Setze die Bild-URL
        this.isCropperVisible = true; // Cropper anzeigen
        this.cdr.detectChanges();
        this.initializeCropper(); // Wichtig für ViewChild
      };
      reader.readAsDataURL(this.selectedFile);
    } else {

      this.resetImageSelection();
    }
  }

// Hilfsmethode zum Zurücksetzen der Bildauswahl
  resetImageSelection(): void {
    this.selectedFile = null;
    this.rezepteService.setIsBildSelected(false);
    this.isCropperVisible = false;
    this.imageUrl = null; // Bild-URL zurücksetzen
    if (this.cropper) {
      this.cropper.destroy(); // Zerstöre den Cropper, falls vorhanden
      this.cropper = null;
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
          this.rezepteService.setIsBildSelected(true);

          this.imageUrl = null;
          this.cropper.destroy();
          this.cropper = null;

          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/rezepterstellung']);
          }, 0);
        } else {
          console.error("Fehler beim Erstellen des Blobs.");
          this.router.navigate(['/rezepterstellung']);

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
    this.rezepteService.setIsBildSelected(false);
  }
}
