import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Rezept} from "../models/rezepte";
import {RezeptService} from "../services/rezepte.service";


@Component({
  selector: 'app-listen-container',
  templateUrl: './listen-container.component.html',
  styleUrls: ['./listen-container.component.scss']
})

export class ListenContainerComponent implements OnInit{
  @Input() isMobile?: boolean;
  rezepteGeladen: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  rezepte: Rezept[] = [];
  rezepteVerfügbar = false

  constructor(private rezepteService: RezeptService) {}

  ngOnInit(): void {
    this.rezepteService.getAlleRezepte().subscribe(rezepte => {
      console.log("Container: Geladene Rezepte:", rezepte);
      this.rezepte = rezepte.map(rezept => ({
        ...rezept,
        datum: rezept.datum ? new Date(rezept.datum) : undefined
      }));
      this.rezepteGeladen.emit(this.rezepte); // Sendet die geladenen Rezepte an Kinderkomponenten
      this.rezepteVerfügbar =true
      console.log('rezepteVerfügbar', this.rezepteVerfügbar)
    });

  }


  onRezepteGeladen(rezepte: Rezept[]): void {
    console.log('Geladene Rezepte im Kindkomponente:', rezepte);
    // Hier können Sie die geladenen Rezepte weiterverarbeiten, z.B. anzeigen oder in einer Eigenschaft speichern
  }


}


