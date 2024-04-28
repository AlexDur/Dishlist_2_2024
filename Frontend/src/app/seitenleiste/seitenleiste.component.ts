import {Component, OnInit} from '@angular/core';
import {Rezept} from "../models/rezepte";
import {FilterService} from "primeng/api";
import {RezeptService} from "../services/rezepte.service";

@Component({
  selector: 'app-seitenleiste',
  templateUrl: './seitenleiste.component.html',
  styleUrls: ['./seitenleiste.component.scss']
})
export class SeitenleisteComponent implements OnInit {

  constructor(private filterService: FilterService, private rezepteService: RezeptService) {
  }

  /*  interKuechen = [
      { label: 'Deutsch', value: 'deutsch', count: 3 },
      { label: 'Chinesisch', value: 'chinesisch', count: 1 },
      { label: 'Japanisch', value: 'japanisch', count: 0 },
      { label: 'Italienisch', value: 'italienisch', count: 0 },
      { label: 'Indisch', value: 'indisch', count: 4 },
    ];*/


  selectedFilters: string[] = [];
  selectedCategories: string[] = [];
  selectedKuechen: string[] = [];

  gerichtArten = [
    {label: 'Vorspeise', value: 'vorspeise', count: 1},
    {label: 'Hauptgang', value: 'hauptgang', count: 2},
    {label: 'Nachtisch', value: 'nachtisch', count: 3},
    /*{ label: 'Getränk', value: 'getränk', count: 2 },*/
  ];

  selectedGerichtarten: string[] = [];

  /*  gerichtEigenschaften = [
      { label: 'schnell', value: 'schnell', count: 2 },
      { label: 'kalorienreich', value: 'kalorienreich', count: 3 },
      { label: 'vegetarisch', value: 'vegetarisch', count: 2 },
      { label: 'proteinreich', value: 'preoteinreich', count: 0 },
    ];*/


  selectedGerichtEigenschaften: string[] = [];

  ngOnInit(): void {
    // Beim Initialisieren der Komponente die Zählung der Gerichtarten aktualisieren
    this.updateGerichtArtCount();
  }

  updateGerichtArtCount(): void {
    this.rezepteService.getAlleRezepte().subscribe((rezepte: Rezept[]) => {
      // Zähler für jede Gerichtart zurücksetzen
      this.gerichtArten.forEach((art) => {
        art.count = 0;
      });

      // Rezepte durchlaufen und die Anzahl für jede Gerichtart zählen
      rezepte.forEach((rezept) => {
        if (rezept.tags) {

          rezept.tags.forEach((tag) => {
            // Überprüfen, ob der Tag zu einer Gerichtart gehört
            const gerichtart = this.gerichtArten.find((g) => g.label === tag.label);
            if (gerichtart) {
              gerichtart.count++;
            }
          });
        }
      });
    });
  }
}
