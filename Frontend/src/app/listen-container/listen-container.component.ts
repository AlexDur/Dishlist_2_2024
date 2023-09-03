import {Component, OnInit} from '@angular/core';
import {Table} from "primeng/table";
import {Rezept} from "../domain/rezepte";
import {RezepteService} from "../services/rezepte.service";

@Component({
  selector: 'app-listen-container',
  templateUrl: './listen-container.component.html',
  styleUrls: ['./listen-container.component.scss']
})
export class ListenContainerComponent implements OnInit{
rezepte: Rezept[] = [];
loading: boolean = true

constructor( private rezepteService: RezepteService) {}

  ngOnInit(): void {
    this.rezepteService.getRezepteMini().then((rezepte) => {
      this.rezepte = rezepte;
      this.loading = false;

      this.rezepte.forEach((rezept) => (rezept.date = new Date(<Date>rezept.date)));
  });
}

  clear(table: Table) {
    table.clear();
  }

  protected readonly HTMLInputElement = HTMLInputElement;

}


