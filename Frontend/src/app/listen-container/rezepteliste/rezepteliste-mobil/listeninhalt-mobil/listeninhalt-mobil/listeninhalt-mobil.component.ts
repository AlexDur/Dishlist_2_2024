import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import {Rezept} from "../../../../../models/rezepte";
import {RezeptService} from "../../../../../services/rezepte.service";
import {Router} from "@angular/router";
import {DialogComponent} from "../../../../../shared/dialog/dialog.component";
import { Subscription } from 'rxjs';
import {TagService} from "../../../../../services/tags.service";
import {UserInterfaceService} from "../../../../../services/userInterface.service";
import {ListenansichtService} from "../../../../../services/listenansicht.service";

@Component({
  selector: 'app-listeninhaltmobil',
  templateUrl: './listeninhalt-mobil.component.html'
})
export class ListeninhaltMobilComponent implements OnInit, OnDestroy {
  @ViewChild(DialogComponent) Dialog!: DialogComponent;
  @ViewChild('newRecipeNameInput') newRecipeNameInput?: ElementRef<HTMLInputElement>;
  @Input() tagsFromSidebarChanged: boolean = false;
  @Input() rezepte: Rezept[] = [];
  /*@Input() selectedTagsInSidebar: boolean = false*/
 /* @Input() gefilterteRezepte: Rezept[] = [];*/
  @Input() rezepteVerfügbar: boolean = false;
  @Input() visible: boolean = false;
  @Input() isMobile?: boolean;
  @Output() selectedRemoveTags = new EventEmitter<string[]>();

  private tagsSubscription: Subscription | undefined;

  gefilterteRezepte: Rezept[] = [];
  selectedTags: string[] = [];
  displayDeleteDialog: boolean = false;
  selectedRezeptId: number | null = null;
  isBildSelected: boolean = false;
  spaltenAnzahl: number = 2;
  actionButtonsVisible: boolean = true;


  constructor(private rezepteService: RezeptService, private tagService: TagService, private router:Router, private uiService: UserInterfaceService, private listenAnsichtService: ListenansichtService) {}

  ngOnInit(): void {
    this.tagsSubscription = this.tagService.selectedTags$.subscribe(tags => {
      this.selectedTags = tags;
    });

    //Neuer Wert der aus der Gesamtheit "rezepte" genommen wird, wird gefilterteRezepte zugeordnet
    this.rezepteService.gefilterteRezepte$.subscribe(rezepte => {
      this.gefilterteRezepte = rezepte;
    })

    this.listenAnsichtService.spaltenAnzahl$.subscribe((anzahl) => {
      this.spaltenAnzahl = anzahl; // Grid-Anzahl aktualisieren
    });

    this.listenAnsichtService.actionButtonsVisible$.subscribe(actionButtonsVisible => {
      this.actionButtonsVisible = actionButtonsVisible; // Sichtbarkeit der Buttons aktualisieren
    });

    this.uiService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
      console.log('isMobile geändert:', isMobile);
    });
  }

  ngOnDestroy(): void {
    if (this.tagsSubscription) {
      this.tagsSubscription.unsubscribe();
    }
  }

  navigateForm(rezept: Rezept, event: MouseEvent) {
    event.preventDefault();
    console.log('Button clicked');
    this.rezepteService.setCurrentRezept(rezept);

    if (rezept.bildUrl) {
      this.isBildSelected = true;
      console.log('isBildSelected', this.isBildSelected);
    } else {
      this.isBildSelected = false;
      console.log('isBildSelected', this.isBildSelected);
    }
    // rezept als state-Daten an Zielseite übergeben
    this.uiService.setActiveTab(1);
    this.router.navigate(['/rezepterstellung'], { state: { data: rezept, isBildSelected: this.isBildSelected } });
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
        });
    }
  }


  openUrl(url: string | undefined): void {
    if (!url) {
      console.warn('Versuch, eine undefinierte URL zu öffnen');
      return;
    }
    url = url.trim();
    if (url.startsWith('www.')) {
      url = 'http://' + url;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
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
      imageElement.style.objectFit = 'contain';
      imageElement.style.backgroundColor = 'black';
      imageElement.style.width = '100vw';
      imageElement.style.height = '100vh';
      imageElement.style.cursor = 'default';

      // Container für das Fullscreen-Bild
      const fullscreenContainer = document.createElement('div');
      fullscreenContainer.style.position = 'fixed';
      fullscreenContainer.style.top = '50%';
      fullscreenContainer.style.left = '50%';
      fullscreenContainer.style.transform = 'translate(-50%, -50%)';
      fullscreenContainer.style.width = '100vw';
      fullscreenContainer.style.height = '100vh';
      fullscreenContainer.style.zIndex = '10000';
      fullscreenContainer.style.display = 'flex';
      fullscreenContainer.style.justifyContent = 'center';
      fullscreenContainer.style.alignItems = 'center';
      fullscreenContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      fullscreenContainer.style.overflow = 'hidden';
      fullscreenContainer.style.paddingTop = '400px'
      fullscreenContainer.style.paddingBottom = '400px'

      const maxDimension = Math.min(window.innerWidth, window.innerHeight);
      fullscreenContainer.style.width = `${maxDimension}px`;
      fullscreenContainer.style.height = `${maxDimension}px`;

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

  //Tag aus der Liste der ausgewählten Tags entfernen

  onTagRemoved(tag: string): void {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
    this.selectedRemoveTags.emit(this.selectedTags);
  }

  clearTags(){
    console.log('clear Tags');
    this.selectedTags = [];
    this.tagService.setSelectedTags([]);
  }

}
