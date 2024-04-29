import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Rezept} from "../.././models/rezepte";
import {RezeptService} from "../../services/rezepte.service";
import {TagService} from "../../services/tags.service";
import {Tag} from "../../models/tag";

@Component({
  selector: 'app-listen-container',
  templateUrl: './listen-container.component.html',
  styleUrls: ['./listen-container.component.scss']
})

export class ListenContainerComponent implements OnInit{
  @Input() filteredRezepte: Rezept[] = [];
  @Input() rezepte: Rezept[] = [];

  constructor() {}

  ngOnInit(): void {}


  onRezepteFiltered(filteredRezepte: Rezept[]): void {
    // Hier kannst du die gefilterten Rezepte verarbeiten
    console.log('Gefilterte Rezepte:', filteredRezepte);
    this.filteredRezepte = filteredRezepte;
  }

}


