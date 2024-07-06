import {
  Component,
  ElementRef,
  Input,
  OnChanges, OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Rezept} from "../../../../../models/rezepte";
import {RezeptService} from "../../../../../services/rezepte.service";
import {TagService} from "../../../../../services/tags.service";

/*import {Dish, TagsComponent} from "../../../rezepteliste-desktop/tags/tags.component";*/
import {Tag} from "../../../../../models/tag";
import {Router} from "@angular/router";
import {RezeptErstellungComponent} from "../../../../rezept-erstellung/rezept-erstellung.component";
import {DialogComponent} from "../../../../../shared/dialog/dialog.component";

@Component({
  selector: 'app-listeninhaltmobil',
  templateUrl: './listeninhalt-mobil.component.html',
  styleUrls: ['./listeninhalt-mobil.component.scss']
})
export class ListeninhaltMobilComponent implements OnInit{
  @ViewChild(DialogComponent) Dialog!: DialogComponent;
/*  @ViewChild(TagsComponent) tagsComponent!: TagsComponent;*/
  @ViewChild('newRecipeNameInput') newRecipeNameInput?: ElementRef<HTMLInputElement>;
  @Input() rezepte: Rezept[] = [];
  @Input() gefilterteRezepte: Rezept[] = [];
  @Input() rezepteVerfügbar: boolean = false;
  @Input() visible: boolean = false;
  displayDeleteDialog: boolean = false;
  selectedRezeptId: number | null = null;

  newRecipe: any = {}
  selectedRow: any;
  istGeaendert: boolean = false;
  istGespeichert: boolean = false;
  showSaveButton: boolean = false;
  showDeleteButton: boolean = false;
  editMode = false;
  rezepteGeladen: boolean = false;
  tagToggleStates: { [key: number]: boolean } = {};
  currentRecipe: Rezept | undefined;
  selectedTag: Set<Tag> = new Set<Tag>();


  constructor( private rezepteService: RezeptService,  private tagService: TagService, private router:Router) {
    this.selectedRow = {};
  }

  ngOnInit() {
    this.rezepteService.rezepte$.subscribe(rezepte => {
      this.gefilterteRezepte = rezepte;
      console.log('Aktualisierte Rezepte:', rezepte);
    });
  }


  selectRow(rezept: any) {
    this.selectedRow = rezept;
    this.editMode = true;
  }

  navigateForm(rezept: Rezept, event: MouseEvent) {
    event.preventDefault();
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
    // Füge "http://" hinzu, wenn die URL mit "www." beginnt und kein "http://" oder "https://" hat
    if (url.startsWith('www.')) {
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
