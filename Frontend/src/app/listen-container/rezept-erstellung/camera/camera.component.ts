import { Component, ViewChild, ElementRef, Output, Input, EventEmitter } from '@angular/core';
import {Rezept} from "../../../models/rezepte";

/*Kamerafunktionen und reine Emission des Bilds*/

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
})
export class CameraComponent {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  @Output() imageUploaded = new EventEmitter<File>();
  @Input() rezepte: Rezept[] = [];
  isBildSelected: boolean = false;
  isCameraOpen = false;

  private videoStream!: MediaStream;


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
    // Foto aufnehmen
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    const canvas: HTMLCanvasElement = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'photo.png', { type: 'image/png' });
          this.imageUploaded.emit(file);
        }
      }, 'image/png');
    }

    // Kamera schließen
    this.closeCamera();
    console.log('bildSelected',this.isBildSelected)
  }

  closeCamera() {
    // Kamera und VideoStream stoppen
    this.isCameraOpen = false;
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
    }
  }
}

