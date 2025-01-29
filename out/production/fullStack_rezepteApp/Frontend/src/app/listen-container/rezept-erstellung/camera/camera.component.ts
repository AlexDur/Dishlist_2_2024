import { Component, ViewChild, ElementRef, Output, Input, EventEmitter, AfterViewInit  } from '@angular/core';
import {Rezept} from "../../../models/rezepte";

/*Kamerafunktionen und reine Emission des Bilds*/

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
})
export class CameraComponent implements AfterViewInit{
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  @Output() imageUploaded = new EventEmitter<File>();
  @Input() rezepte: Rezept[] = [];
  isBildSelected: boolean = false;
  isCameraOpen = false;

  private videoStream!: MediaStream;

  ngAfterViewInit() {
    console.log('View ist initialisiert');
  }

  async startCamera() {
    try {
      // Kamera öffnen
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
          this.imageUploaded.emit(file);
        }
      }, 'image/png');
    }

    this.closeCamera();
  }


  closeCamera() {
    // Kamera und VideoStream stoppen
    this.isCameraOpen = false;
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
    }
  }
}

