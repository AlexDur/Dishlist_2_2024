import { Component, EventEmitter, OnInit, Output, Input, AfterViewInit, SimpleChanges , ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import Cropper from 'cropperjs';
import {Rezept} from "../../../../models/rezepte";
import { ActivatedRoute } from '@angular/router';
import {Router} from "@angular/router";
import {RezeptService} from "../../../../services/rezepte.service";

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html'
})

export class CropperComponent implements OnInit, AfterViewInit {
  @Input() rezepte: Rezept[] = [];
  @Input() imageUrl!: string;
/*  @Output() imageCropped = new EventEmitter<File>();*/
  @Output() closeCropper = new EventEmitter<void>(); // Event zum Schließen der Bearbeitung


  private cropper: any;
  private isCropperInitialized: boolean = false;
  /*selectedFile: File | null = null;*/

  @ViewChild('imageElement') imageElement!: ElementRef;
  /*@ViewChild('canvasElement') canvasElement!: ElementRef;*/

  constructor(private router: Router, private route: ActivatedRoute, private rezepteService: RezeptService) {
    this.route.queryParams.subscribe(params => {
      this.imageUrl = params['imageUrl']; // Eingabe-Bild-URL
    });
  }

  ngOnInit(): void {
    if (!this.imageUrl) {
      console.error('Keine Image-URL gefunden');
    }
  }

  ngAfterViewInit() {
    if (this.imageUrl) {
      this.initializeCropper();
    }
  }

  initializeCropper() {
    const image = this.imageElement.nativeElement as HTMLImageElement;

    image.onload = () => {
      console.log('Bild erfolgreich geladen.');

      // Nur wenn der Cropper noch nicht initialisiert wurde
      if (!this.cropper) {
        this.cropper = new Cropper(image, {
          aspectRatio: 1,  // Das Bild bleibt quadratisch
          viewMode: 1,
          responsive: true,
          zoomable: true,
          scalable: false,
          dragMode: 'move',
          background: true,
          autoCropArea: 1,
          cropBoxResizable: true,
          cropBoxMovable: true,

          // Event-Handler für den "ready"-Event
          ready: () => {
            console.log('Cropper ist bereit.');

            // Setze die Crop-Box mit den gewünschten Abmessungen
            this.cropper.setCropBoxData({
              left: 0,       // Position der Crop-Box
              top: 0,        // Position der Crop-Box
              width: 190,    // Breite der Crop-Box
              height: 190    // Höhe der Crop-Box
            });
          }
        });

        this.isCropperInitialized = true;
      } else {
        console.log('Cropper wurde bereits initialisiert.');
      }
    };

    image.onerror = () => {
      console.error('Fehler beim Laden des Bildes:', this.imageUrl);
    };

    // Bildquelle setzen
    image.src = this.imageUrl;
  }


  // Bild zuschneiden und als Datei zurückgeben
  cropImage(): void {
    if (this.isCropperInitialized) {
      const croppedCanvas = this.cropper.getCroppedCanvas();
      console.log('Canvas-Dimensionen:', croppedCanvas.width, croppedCanvas.height);

      // Log die Originalabmessungen des Bildes vor dem Zuschneiden
      const image = this.imageElement.nativeElement as HTMLImageElement;
      console.log('Originalbild-Dimensionen:', image.naturalWidth, image.naturalHeight);

      if (croppedCanvas.width !== croppedCanvas.height) {
        console.error('Das zugeschnittene Bild ist nicht quadratisch!');
        return;
      }

      croppedCanvas.toBlob((blob: Blob) => {
        if (blob) {
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
          console.log('Gecropptes Bild:', file);

          // Bild über den RezeptService setzen
          this.rezepteService.setImage(file);

          // Navigiere zurück zur Rezepterstellung
          this.router.navigate(['/rezepterstellung']);
        }
      }, 'image/jpeg');
    } else {
      console.error('Cropper nicht initialisiert');
    }
  }





  close() {
    if (this.cropper) {
      this.cropper.destroy(); // Zerstöre den Cropper richtig, um doppelte Instanzen zu vermeiden
    }
    this.closeCropper.emit();
    this.router.navigate(['/rezepterstellung']);
  }
}
