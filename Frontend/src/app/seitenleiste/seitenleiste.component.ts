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
    { label: 'Deutsch', value: 'deutsch', count: 3 },
    { label: 'Chinesisch', value: 'chinesisch', count: 1 },
    { label: 'Japanisch', value: 'japanisch', count: 0 },
    { label: 'Italienisch', value: 'italienisch', count: 0 },
    { label: 'Indisch', value: 'indisch', count: 4 },
  ];


  selectedFilters: string[] = [];
  selectedCategories: string[] = [];
  selectedKuechen: string[] = [];

  gerichtArten = [
    { label: 'Vorspeise', value: 'vorspeise', count: 1 },
    { label: 'Haupt', value: 'haupt', count: 2 },
    { label: 'Nachtisch', value: 'nachtisch', count: 3 },
    { label: 'Getränk', value: 'getränk', count: 2 },
  ];

  selectedGerichtarten: string[] = [];

  gerichtEigenschaften = [
    { label: 'schnell', value: 'schnell', count: 2 },
    { label: 'kalorienreich', value: 'kalorienreich', count: 3 },
    { label: 'vegetarisch', value: 'vegetarisch', count: 2 },
    { label: 'proteinreich', value: 'preoteinreich', count: 0 },
  ];


  selectedGerichtEigenschaften: string[] = [];


}
