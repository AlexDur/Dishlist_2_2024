import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Rezept} from "../../models/rezepte";
import {TagsComponent} from "../rezepteliste/rezepteliste-desktop/tags/tags.component";
import {Tag} from "../../models/tag";
import {RezeptService} from "../../services/rezepte.service";
import {TagService} from "../../services/tags.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-rezept-erstellung',
  templateUrl: './rezept-erstellung.component.html',
  styleUrls: ['./rezept-erstellung.component.scss']
})
export class RezeptErstellungComponent{
/*  @ViewChild(TagsComponent) tagsComponent!: TagsComponent;
  @ViewChild('newRecipeNameInput') newRecipeNameInput?: ElementRef<HTMLInputElement>;*/
  @Input() rezepte: Rezept[] = [];
  @Input() gefilterteRezepte: Rezept[] = [];

  newRecipe: any = {}
  selectedRow: any;
  istGeaendert: boolean = false;
  istGespeichert: boolean = false;
  showSaveButton: boolean = false;
  showDeleteButton: boolean = false;
  editMode = false;
  rezeptGeladen: boolean = false;
  tagToggleStates: { [key: number]: boolean } = {};
  currentRecipe: Rezept | undefined;
  selectedTag: Set<Tag> = new Set<Tag>();


  constructor( private rezepteService: RezeptService,  private tagService: TagService, private router: Router) {
    this.selectedRow = {};
  }
/*
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rezepte']) {
      console.log('R-Erstellung: Rezepte aktualisiert:', this.rezepte);
    }
  }*/



  setGeaendert(rezept: Rezept) {
    rezept.istGeaendert = true;
  }

  /*id kann weglassen werden, da die DB die ID automatisch generiert (AUTO INCREMENT)*/
  addRow() {
    console.log('selectedRow in addRow:', this.selectedRow);
    const currentDate = new Date();

    this.newRecipe = {
      name: '',
      onlineAdresse: '',
    };

    this.gefilterteRezepte.unshift(this.newRecipe);
    this.editMode = true;

    // Setzen von selectedRow auf das neue Rezept, um Bearbeitungsmodus zu aktivieren
    this.selectedRow = this.newRecipe;

    // Setzen des Fokuses auf das Input-Element in der neuen Zeile
  /*  setTimeout(() => {
      this.newRecipeNameInput?.nativeElement.focus();
    });*/
  }

  saveChanges(rezept: Rezept) {
    if (!rezept.id) {
      this.rezepteService.createRezept(rezept).subscribe(response => {
        if (response.body) {
          rezept.id = response.body.id;
          this.updateUIAfterSave();
          this.rezepteService.getAlleRezepte(); // Erneutes Laden der Rezepte, um die Liste zu aktualisieren
        }
      });
    } else {
      this.rezepteService.updateRezept(rezept.id, rezept).subscribe(() => {
        this.updateUIAfterSave();
        this.rezepteService.getAlleRezepte(); // Erneutes Laden der Rezepte, um die Liste zu aktualisieren
      });
    }
  }


  updateUIAfterSave() {
    this.istGeaendert = false;
    this.showSaveButton = false;
    this.showDeleteButton = true;
    this.editMode = false;
    this.istGespeichert = true;
  }


  restoreOriginalTags() {
    // Hier kannst du den Code einfügen, um die ursprünglichen Tags wiederherzustellen
  }

  onRatingChanged(newRating: number, rezept: any) {
    rezept.bewertung = newRating;
    rezept.istGeaendert = true;
  }

  selectRow(rezept: any) {
    this.selectedRow = rezept;
    this.editMode = true;
  }


  navigateContainer(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/listencontainer']);
  }

  handleClick($event: any){
    this.saveChanges($event);
    this.navigateContainer($event)
    this.addRow()
  }




  onRezepteGeladen(rezepte: Rezept[]): void {
    console.log('Geladene Rezepte im Kindkomponente:', rezepte);
    // Hier können Sie die geladenen Rezepte weiterverarbeiten, z.B. anzeigen oder in einer Eigenschaft speichern
  }
}
