import { Component, ChangeDetectorRef, ViewChild, ElementRef, Output, Input, EventEmitter, AfterViewInit, OnDestroy  } from '@angular/core';
import {Rezept} from "../../../models/rezepte";
import {BildService} from "../../../services/bild.service";
import { Observable, Subscription } from "rxjs";

/*Kamerafunktionen und reine Emission des Bilds*/
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
})
export class CameraComponent implements AfterViewInit, OnDestroy{
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  @Output() imageUploaded = new EventEmitter<File>();
  @Input() rezepte: Rezept[] = [];
  isCameraShot$: Observable<boolean>;
  isCameraShot: boolean = false;
  isCameraOpen = false;

  private subscription: Subscription | undefined;
  private videoStream!: MediaStream;

  constructor(private cameraService: BildService, private cdr: ChangeDetectorRef) {
    this.isCameraShot$ = this.cameraService.isCameraShot$;
  }

  ngAfterViewInit() {
    console.log('View ist initialisiert');
    this.subscription = this.isCameraShot$.subscribe(value => {
      console.log('isCameraShot Wert erhalten:', value);
      this.isCameraShot = value;
      console.log('isCameraShot nach Update:', this.isCameraShot);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async startCamera() {
    try {
      this.isCameraOpen = true;
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      const video: HTMLVideoElement = this.videoElement.nativeElement;
      video.srcObject = this.videoStream;
    } catch (err) {
      console.error('Kamera konnte nicht geöffnet werden:', err);
      this.isCameraOpen = false;
    }
  }

  capturePhoto() {
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    const canvas: HTMLCanvasElement = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const size = Math.min(video.videoWidth, video.videoHeight);

      // Setze die Canvas-Größe auf das Quadrat
      canvas.width = size;
      canvas.height = size;

      // Berechne die Position des Bildes, um es quadratisch zu schneiden
      const offsetX = (video.videoWidth - size) / 2;
      const offsetY = (video.videoHeight - size) / 2;

      // Zeichne das quadratische Bild auf das Canvas
      ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size);

      // Konvertiere das Bild in ein Blob und gebe es als File weiter
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'photo.png', { type: 'image/png' });

          // Überprüfe, ob das File-Objekt existiert
          if (file) {
            console.log('Bild erfolgreich erfasst:', file);

            // Überprüfe die Dateigröße
            if (file.size > 0) {
              console.log('Dateigröße:', file.size);
            } else {
              console.error('Fehler: Dateigröße ist null.');
            }

            // Überprüfe den Dateityp
            if (file.type === 'image/png') {
              console.log('Dateityp:', file.type);
            } else {
              console.error('Fehler: Ungültiger Dateityp.');
            }

            this.imageUploaded.emit(file);
            this.cameraService.setIsCameraShot(true);
            this.isCameraShot = true;
            setTimeout(() => {
              const labelElement = document.querySelector('.upload-button-label');
              console.log('Label-Element gefunden:', labelElement);
              console.log('Hat es die Klasse "cameraShot-selected"?', labelElement?.classList.contains('cameraShot-selected'));
            }, 100);
            this.closeCamera();

          } else {
            this.cameraService.setIsCameraShot(false);
            console.error('Fehler: File-Objekt ist null.');
          }
        }
      }, 'image/png');
    }
  }


  closeCamera() {
    // Kamera und VideoStream stoppen
    this.isCameraOpen = false;
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
    }
  }
}

