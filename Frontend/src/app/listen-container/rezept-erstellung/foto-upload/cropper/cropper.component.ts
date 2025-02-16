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
  /*@Output() isbildSelected = new EventEmitter<Rezept>();*/

  private cropper: any;
  private isCropperInitialized: boolean = false;


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
          scalable: true,
          background: true,
          autoCropArea: 1,
          cropBoxResizable: true,
          cropBoxMovable: true,

          // Event-Handler für den "ready"-Event
          ready: () => {
            console.log('Cropper ist bereit.');

            // Setze die Crop-Box mit den gewünschten Abmessungen
            this.cropper.setCropBoxData({
              left: 0,
              top: 0,
              width: 190,
              height: 190
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

      const size = Math.min(croppedCanvas.width, croppedCanvas.height);
      const x = (croppedCanvas.width - size) / 2;
      const y = (croppedCanvas.height - size) / 2;

      const fixedCanvas = document.createElement('canvas');
      fixedCanvas.width = size;
      fixedCanvas.height = size;
      const ctx = fixedCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(croppedCanvas, -x, -y, croppedCanvas.width, croppedCanvas.height);
      } else {
        console.error("2D rendering context not available");
        return;
      }

      fixedCanvas.toBlob((blob: Blob | null) => { // <= Hier die Änderung
        if (blob) { // <= Und hier die Überprüfung
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
          this.rezepteService.setImage(file);
          this.router.navigate(['/rezepterstellung']);
        } else {
          console.error("Fehler beim Erstellen des Blobs."); // <= Fehlerbehandlung
        }
      }, 'image/jpeg');
    } else {
      console.error('Cropper nicht initialisiert');
    }
  }


  close() {
    if (this.cropper) {
      this.cropper.destroy();
    }
    this.closeCropper.emit();
    this.router.navigate(['/rezepterstellung']);
  }
}
