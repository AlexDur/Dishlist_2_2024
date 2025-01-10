import {
  Component,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {Rezept} from "../../../../../models/rezepte";
import {RezeptService} from "../../../../../services/rezepte.service";
import {TagService} from "../../../../../services/tags.service";
import { Subscription } from 'rxjs';
import {Router} from "@angular/router";
import {DialogComponent} from "../../../../../shared/dialog/dialog.component";

@Component({
  selector: 'app-listeninhaltmobil',
  templateUrl: './listeninhalt-mobil.component.html'
})
export class ListeninhaltMobilComponent {
  @ViewChild(DialogComponent) Dialog!: DialogComponent;
  @ViewChild('newRecipeNameInput') newRecipeNameInput?: ElementRef<HTMLInputElement>;
  @Input() rezepte: Rezept[] = [];
  @Input() gefilterteRezepte: Rezept[] = [];
  @Input() rezepteVerfügbar: boolean = false;
  @Input() visible: boolean = false;
  displayDeleteDialog: boolean = false;
  selectedRezeptId: number | null = null;
  selectedImageUrl: string | null = null;


  constructor( private rezepteService: RezeptService,  private router:Router) {}

  navigateForm(rezept: Rezept, event: MouseEvent) {
    event.preventDefault();
    this.rezepteService.setCurrentRezept(rezept);
    this.router.navigate(['/rezepterstellung'], { state: { data: rezept } });
  }

  showDeleteDialog(rezeptId: number) {
    this.selectedRezeptId  = rezeptId;
    this.Dialog.message = 'Rezept löschen?';
    this.displayDeleteDialog = false;
    setTimeout(() => {
      this.displayDeleteDialog = true;
    }, 0);
  }

  confirmDelete(isConfirmed: boolean) {
    if (isConfirmed && this.selectedRezeptId !== null) {
      this.deleteCard(this.selectedRezeptId);
    }
    this.displayDeleteDialog = false;
  }

  deleteCard(id: number) {
    if (this.rezepteVerfügbar) {
      this.rezepteService.deleteRezept(id).subscribe(
        () => {
          this.gefilterteRezepte = this.gefilterteRezepte.filter(rezept => rezept.id !== id);
          this.displayDeleteDialog = false;
        },
        error => {
          console.error('Fehler beim Löschen des Rezepts', error);
        }
      );
    } else {
      console.log('Das Rezept wurde noch nicht geladen. Die deleteRow-Methode wird nicht aufgerufen.');
    }
  }

  openUrl(url: string | undefined): void {
    if (!url) {
      console.warn('Versuch, eine undefinierte URL zu öffnen');
      return;
    }

    url = url.trim();

    // Füge "http://" hinzu, wenn die URL mit "www." beginnt und kein "http://" oder "https://" hat
    if (url.startsWith('www.')) {
      url = 'http://' + url;
    }

    // Füge "http://" hinzu, wenn die URL weder mit "http://" noch mit "https://" beginnt
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }

    // Grundlegende Validierung, um sicherzustellen, dass die URL jetzt mit "http://" oder "https://" beginnt
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      console.warn('Ungültige URL');
    }
  }

  openImageFullscreen(bildUrl: string): void {
    if (bildUrl) {
      const imageElement = document.createElement('img');
      imageElement.src = bildUrl;
      imageElement.alt = 'Bild in voller Größe';
      imageElement.style.objectFit = 'contain'; // Bild bleibt quadratisch, ohne abgeschnitten zu werden
      imageElement.style.backgroundColor = 'black';
      imageElement.style.width = '100%'; // Bild füllt den Container in der Breite aus
      imageElement.style.height = '100%'; // Bild füllt den Container in der Höhe aus

      // Container für das Fullscreen-Bild
      const fullscreenContainer = document.createElement('div');
      fullscreenContainer.style.position = 'fixed';
      fullscreenContainer.style.top = '50%';
      fullscreenContainer.style.left = '50%';
      fullscreenContainer.style.transform = 'translate(-50%, -50%)'; // Zentriert den Container
      fullscreenContainer.style.zIndex = '10000';
      fullscreenContainer.style.display = 'flex';
      fullscreenContainer.style.justifyContent = 'center';
      fullscreenContainer.style.alignItems = 'center';
      fullscreenContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      fullscreenContainer.style.overflow = 'hidden';

      // Dynamisches Seitenverhältnis: Der Container wird auf die kleinere Dimension (Breite oder Höhe) gesetzt
      const maxDimension = Math.min(window.innerWidth, window.innerHeight);  // Kleinste Dimension von Breite oder Höhe
      fullscreenContainer.style.width = `${maxDimension}px`;  // Setzt die Breite auf die kleinere Dimension
      fullscreenContainer.style.height = `${maxDimension}px`; // Setzt die Höhe auf die kleinere Dimension

      fullscreenContainer.appendChild(imageElement);

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // Schließen beim Klick
      fullscreenContainer.addEventListener('click', () => {
        document.body.style.overflow = '';
        document.body.removeChild(fullscreenContainer);
      });

      document.body.appendChild(fullscreenContainer);
    }
  }






}
