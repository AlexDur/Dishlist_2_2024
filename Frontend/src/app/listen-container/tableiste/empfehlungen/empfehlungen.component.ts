import { Component,Input, HostListener, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import {RezeptService} from "../../../services/rezepte.service";
import {Rezept} from "../../../models/rezepte";
import {Router} from "@angular/router";
import { Subscription, of, finalize, Observable, timeout } from 'rxjs';
import {TagService} from "../../../services/tags.service";
import { catchError } from 'rxjs/operators';



@Component({
  selector: 'app-empfehlungen',
  templateUrl: './empfehlungen.component.html'
})
export class EmpfehlungenComponent implements OnInit, OnDestroy {
  @Input() rezepte: Rezept[] = [];

  private tagsSubscription: Subscription | undefined;
  private subscription: Subscription | undefined;

  gefilterteRezepte$: Observable<Rezept[]>;
  isOverlayVisible = false;
  isLoading = false;
  errorMessage: string | null = null;
  selectedTags: string[] = [];
  isClicked = false;
  rezeptWunsch: string = '';
  isAIInputVisible = false;
  hasAIInputBeenVisible = false;
  isAIOverlayVisible: boolean = false;
  isWishButtonActive = false;

  constructor(private rezeptService: RezeptService, private tagService: TagService, private router: Router, private cdRef: ChangeDetectorRef) {
    this.gefilterteRezepte$ = this.rezeptService.gefilterteRezepte$;
  }

  ngOnInit(): void {
    this.tagsSubscription = this.tagService.selectedTags$.subscribe(tags => {
      this.selectedTags = tags;
    });
    this.gefilterteRezepte$ = this.rezeptService.gefilterteRezepte$;

  }

  get hasFilter(): boolean {
    return this.selectedTags.length > 0;
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  closeOverlay(event: Event): void {
    const content = document.querySelector('.overlay-content');
    if (content && !content.contains(event.target as Node)) {
      this.isOverlayVisible = false;
    }
  }


  // Verhindert das Schließen des Overlays, wenn innerhalb des Overlays geklickt wird
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  // Schließt das Overlay, wenn der Schließen-Button geklickt wird
  closeOverlayButton(event: MouseEvent): void {
    this.isAIOverlayVisible = false;
    event.stopPropagation();
    this.router.navigate(['/listen-container']);
    console.log('button clicked');
  }


  // Öffnet oder schließt das Overlay
  toggleOverlay(event: Event) {
    event.stopPropagation();
    this.isOverlayVisible = !this.isOverlayVisible;

    if (this.isOverlayVisible) {
      this.loadSpoonRezepte();
    }
  }


  /*TODO: Finde heraus wieso OVerlay sich nicht bei isAIInputVisible öffnet*/
  toggleOverlayAI(event: Event) {
    event.stopPropagation();
    this.isAIOverlayVisible  = !this.isAIOverlayVisible ;
    this.hasAIInputBeenVisible = true;
    this.rezeptWunsch = '';
  }


  sucheRezeptNachWunsch() {
    if (this.rezeptWunsch.trim() !== '') {
      this.isOverlayVisible = false;
      this.rezeptWunsch = '';
    } else {
      alert('Bitte gib einen Rezeptwunsch ein.');
    }
  }

  starteSuche() {
    if (this.rezeptWunsch.trim() !== '') {
      this.isLoading = true;
      console.log('Nutzer sucht nach:', this.rezeptWunsch);
      this.isAIInputVisible = false;
    }
  }


  loadSpoonRezepte(): void {
    this.isLoading = true;
    this.isClicked = false;
    this.errorMessage = null; // Setze die Fehlermeldung zurück

    const TIMEOUT_DURATION = 5000;


    this.rezeptService.fetchSpoonRezepte(this.selectedTags).pipe(
      timeout(TIMEOUT_DURATION),
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          console.error('Die Anfrage hat das Zeitlimit überschritten.');
          this.errorMessage = 'Die Anfrage hat das Zeitlimit überschritten. Bitte versuche es später noch einmal.'; // Benutzerfreundliche Nachricht
        } else {
          console.error('Fehler beim Abrufen der Rezepte:', error);
          this.errorMessage = 'Ein Fehler ist beim Abrufen der Rezepte aufgetreten. Bitte versuche es später noch einmal.'; // Allgemeine Fehlermeldung
        }
        return of([]); // Gib ein leeres Array zurück, um den Observable-Strom fortzusetzen
      }),
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges(); // Manuelles Aktualisieren der UI
      })
    ).subscribe((rezepte) => {
      console.log('Empfangene Rezepte:', rezepte);
      this.rezepte = rezepte.map((rezept) => ({
        ...rezept, // Behält alle anderen Eigenschaften des Rezepts bei
        tags: rezept.tags ?? [] // Setzt tags auf ein leeres Array, falls rezept.tags null oder undefined ist
      }));

    });
  }

  openUrlSpoon(url: string, type: 'image' | 'recipe'): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.error('Ungültige URL: ', url, 'Type:', type);
    }
  }

  addRecipe(rezept: Rezept): void {
    if (this.isClicked) return; // Falls der Button schon einmal geklickt wurde, nichts tun

    this.isLoading = true;
    this.isClicked = true;

    this.rezeptService.addRezeptToList(rezept).pipe(
      catchError((error: any) => {
        this.isLoading = false;
        this.isClicked = false;
        console.error('Fehler beim Speichern des Rezepts:', error);
        return of(null);
      })
    ).subscribe(() => {
      this.isLoading = false;
    });
  }



  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.tagsSubscription) {
      this.tagsSubscription.unsubscribe();
    }
  }
}
