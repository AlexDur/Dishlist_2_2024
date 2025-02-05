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
  @Output() selectedRemoveTags = new EventEmitter<string[]>();


  private tagsSubscription: Subscription | undefined;

  gefilterteRezepte: Rezept[] = [];
  selectedTags: string[] = [];
  displayDeleteDialog: boolean = false;
  selectedRezeptId: number | null = null;



  constructor( private rezepteService: RezeptService, private tagService: TagService, private router:Router, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.tagsSubscription = this.tagService.selectedTags$.subscribe(tags => {
      this.selectedTags = tags;
    });

    //Neuer Wert der aus der Gesamtheit "rezepte" genommen wird, wird gefilterteRezepte zugeordnet
    this.rezepteService.gefilterteRezepte$.subscribe(rezepte => {
      this.gefilterteRezepte = rezepte;
    })
  }

  ngOnDestroy(): void {
    if (this.tagsSubscription) {
      this.tagsSubscription.unsubscribe();
    }
  }

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
      imageElement.style.width = '100%';
      imageElement.style.height = '100%';

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

}
