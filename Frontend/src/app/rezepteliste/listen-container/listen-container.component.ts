import {Component, Input, OnInit} from '@angular/core';
import {Rezept} from "../.././models/rezepte";


@Component({
  selector: 'app-listen-container',
  templateUrl: './listen-container.component.html',
  styleUrls: ['./listen-container.component.scss']
})

export class ListenContainerComponent implements OnInit{
  @Input() rezepteChanged: Rezept[] = [];

  constructor() {}

  ngOnInit(): void {}


  onRezepteFiltered(filteredRezepte: Rezept[]): void {
    // Verarbeitung der gefilterten Rezepte
    console.log('Gefilterte Rezepte:', filteredRezepte);
    this.rezepteChanged = filteredRezepte;
  }


}


