import {Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import {Rezept} from "../models/rezepte";
import {RezeptService} from "../services/rezepte.service";
import { Subscription } from 'rxjs';
import {TagService} from "../services/tags.service";
import {SubscriptionService} from "../services/subscription.service";
import {AuthService} from "../services/auth.service";
import { Platform } from '@ionic/angular';

interface TrialInfo {
  startDate: string;
  trialExpired?: boolean; // trialExpired ist optional
}

interface TrialStatusResponse {
  startDate: string;
  trialExpired: boolean;
}

@Component({
  selector: 'app-listen-container',
  templateUrl: './listen-container.component.html'
})

export class ListenContainerComponent implements OnInit{
  @Input() isMobile?: boolean;
  @Output() selectedTagsChange: EventEmitter<string[]> = new EventEmitter<string[]>(); // Output-EventEmitter

  //wird verwendet (obwohl ausgegraut)
  private tagsSubscription: Subscription | undefined;

  rezepteGeladen: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  rezepte: Rezept[] = [];
  rezepteVerfuegbar = false
  gefilterteRezepte: Rezept[] = [];
  bildUrls: { [key: number]: string } = {};
  searchText: string = '';
  selectedTags: string[] = [];

  showTrialPopup: boolean = false;
  showSubscriptionPopup: boolean = false;
  isYesActive: boolean = false;
  isAndroid: boolean = false;


  constructor(private rezepteService: RezeptService, private authService: AuthService, private platform: Platform, private tagService: TagService, private cdr: ChangeDetectorRef, private subscriptionService: SubscriptionService) {
  }

  ngOnInit(): void {
    this.isAndroid = this.platform.is('android');
    const userId = this.authService.getUserId();

    if (!userId) {
      console.error('Keine User-ID gefunden');
      return;
    }

    this.subscriptionService.getTrialStatus(userId).subscribe(
      (trialInfo: TrialStatusResponse | null) => { // Korrigierte Typisierung
        if (!trialInfo) {
          this.subscriptionService.startTrial(userId).subscribe(
            () => {
              console.log('Testphase gestartet');
              this.showTrialPopup = true;
            },
            (error) => {
              console.error('Fehler beim Starten des Trials:', error);
            }
          );
        } else if (trialInfo.trialExpired) {
          this.showSubscriptionPopup = true;
        } else {
          this.showTrialPopup = true;
        }
      },
      (error) => {
        console.error('Fehler beim Abrufen des Trial-Status:', error);
      }
    );

    this.tagsSubscription = this.tagService.selectedTags$.subscribe(tags => {
      this.selectedTags = tags;
      this.applyFilters();
    });

    this.rezepteService.getUserRezepte().subscribe(rezepte => {
      this.rezepte = rezepte.map(rezept => ({ ...rezept }));
      this.rezepteGeladen.emit(this.rezepte);
      this.gefilterteRezepte = [...this.rezepte];
      this.rezepteVerfuegbar = true;
      this.selectedTags = [...this.selectedTags];
      this.cdr.detectChanges();

      this.gefilterteRezepte.forEach(rezept => {
        if (rezept && rezept.bildUrl) {
          const bildname = rezept.bildUrl.split('/').pop();
          if (bildname) {
            this.bildUrls[rezept.id] = `https://bonn-nov24.s3.eu-central-1.amazonaws.com/${bildname}`;
          }
        }
      });

      this.applyFilters();
    });
  }


// Filter anwenden
  applyFilters(): void {
    this.applySearchFilter();
    this.applyTagFilter();
  }

// Filter nach Suchtext anwenden
  applySearchFilter(): void {
    if (this.searchText && Array.isArray(this.gefilterteRezepte)) {
      // Filtere die bereits gefilterten Rezepte weiter nach dem Suchtext
      this.gefilterteRezepte = this.gefilterteRezepte.filter(rezept =>
        rezept.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

// Filter nach Tags anwenden
  applyTagFilter(): void {
    if (Array.isArray(this.selectedTags) && this.selectedTags.length > 0) {
      // Filtere die Rezepte basierend auf den Tags
      this.gefilterteRezepte = this.gefilterteRezepte.filter(rezept =>
        this.selectedTags.every(tag => rezept.tags?.some(rTag => rTag.label === tag))
      );
    }
  }


  onSelectedTagsInSidebarChange(isInSidebar: boolean): void {
    console.log('selectedTagsInSidebar geändert:', isInSidebar);
    // Weitere Logik basierend auf dem Wert von isInSidebar
  }


  // Diese Methode wird aufgerufen, wenn der Nutzer auf "Ok" klickt
  startTrialAndHidePopup(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.subscriptionService.startTrial(userId).subscribe((response) => {
        this.showTrialPopup = false;
      });

      this.subscriptionService.hideTrialPopup();
    } else {
      console.error('Keine User-ID gefunden');
    }
  }


  subscribeViaPlayStore(): void {
    if (this.isAndroid) {
      // Android-spezifische Logik, um das Play Store-Zahlmenü zu öffnen
      if (window.startSubscription) {  // Ohne den Index-Zugriff
        window.startSubscription();  // Aufruf der nativen Methode
      } else {
        console.error('startSubscription-Methode nicht gefunden');
      }
    } else {
      console.log('Abonnement nur auf Android verfügbar');
      // Möglicherweise eine Web-basierte Lösung anbieten
    }
  }



  continueWithAds(): void {
    // Logik, um die App mit Werbung fortzusetzen
    console.log('Weiter mit Werbung...');
    this.showSubscriptionPopup = false;
    /*TODO:Aktivierung der Werbeanzeigen in der App*/
  }

}


