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
  templateUrl: './listeninhalt-mobil.component.html',
  styleUrls: ['./listeninhalt-mobil.component.scss']
})
export class ListeninhaltMobilComponent implements OnInit, OnDestroy {
  @ViewChild(DialogComponent) Dialog!: DialogComponent;
  @ViewChild('newRecipeNameInput') newRecipeNameInput?: ElementRef<HTMLInputElement>;
  @Input() rezepte: Rezept[] = [];
  @Input() gefilterteRezepte: Rezept[] = [];
  @Input() rezepteVerfügbar: boolean = false;
  @Input() visible: boolean = false;
  displayDeleteDialog: boolean = false;
  selectedRezeptId: number | null = null;
  private subscription: Subscription | undefined;

  constructor( private rezepteService: RezeptService,  private tagService: TagService, private router:Router) {}

  ngOnInit(){
     this.subscription = this.rezepteService.rezepte$.subscribe(rezepte => {
      this.gefilterteRezepte = rezepte;
      console.log('Aktualisierte Rezepte:', rezepte);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
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

    // Entferne unnötige Leerzeichen
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

}
