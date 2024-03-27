import { Component } from '@angular/core';
import {Rezept} from "../models/rezepte";
import {FilterService} from "primeng/api";

@Component({
  selector: 'app-seitenleiste',
  templateUrl: './seitenleiste.component.html',
  styleUrls: ['./seitenleiste.component.scss']
})
export class SeitenleisteComponent {

  constructor(private filterService: FilterService) {}

  interKuechen = [
    { label: 'Deutsch', value: 'deutsch', count: 4146 },
    { label: 'Chinesisch', value: 'chinesisch', count: 4146 },
    { label: 'Japanisch', value: 'japanisch', count: 4146 },
    { label: 'Italienisch', value: 'italienisch', count: 4146 },
    { label: 'Indisch', value: 'indisch', count: 4146 },
  ];


  selectedFilters: string[] = [];
  selectedCategories: string[] = [];
  selectedKuechen: string[] = [];

  gerichtArten = [
    { label: 'Vorspeise', value: 'vorspeise', count: 4146 },
    { label: 'Haupt', value: 'haupt', count: 4146 },
    { label: 'Nachtisch', value: 'nachtisch', count: 4146 },
    { label: 'Getränk', value: 'getränk', count: 4146 },
  ];

  selectedGerichtarten: string[] = [];

  gerichtEigenschaften = [
    { label: 'schnell', value: 'schnell', count: 4146 },
    { label: 'kalorienreich', value: 'kalorienreich', count: 4146 },
    { label: 'vegetarisch', value: 'vegetarisch', count: 4146 },
    { label: 'proteinreich', value: 'preoteinreich', count: 4146 },
  ];


  selectedGerichtEigenschaften: string[] = [];

  filteredRezepte: Rezept[] = [];


  /*onCheckboxChange(category: string, event: Event) {
    const isSelected = (event.target as HTMLInputElement).checked;
    this.filterService.selectCategory(category, isSelected);
  }

  this.filterService.selectedCategories.subscribe(selectedCategories => {
  this.filteredRezepte = this.rezepte.filter(rezept =>
    rezept.categories.some(category => selectedCategories.includes(category))
  );
});

  onCategoryChange() {
    this.filteredRezepte = this.rezepte.filter(rezept =>
      rezept.categories.some(cat => this.selectedCategories.includes(cat))
    );
  }*/
}
