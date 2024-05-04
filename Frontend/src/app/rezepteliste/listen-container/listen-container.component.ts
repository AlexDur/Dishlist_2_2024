import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Rezept} from "../.././models/rezepte";
import {RezeptService} from "../../services/rezepte.service";


@Component({
  selector: 'app-listen-container',
  templateUrl: './listen-container.component.html',
  styleUrls: ['./listen-container.component.scss']
})

export class ListenContainerComponent implements OnInit{
  @Output() rezepteLoaded: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  rezepte: Rezept[] = [];

  constructor(private rezepteService: RezeptService) {}

  ngOnInit(): void {
    this.rezepteService.getAlleRezepte().subscribe(rezepte => {
      console.log("Geladene Rezepte:", rezepte);
      this.rezepte = rezepte.map(rezept => ({
        ...rezept,
        datum: rezept.datum ? new Date(rezept.datum) : undefined
      }));
      this.rezepteLoaded.emit(this.rezepte); // Sendet die geladenen Rezepte an Kinderkomponenten
    });
  }


  onRezepteFiltered(gefilterteRezepte: Rezept[]): void {
    // Verarbeitung der gefilterten Rezepte
    console.log('Gefilterte Rezepte:', gefilterteRezepte);
    this.rezepte = gefilterteRezepte;
  }


}


