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
statuses!: any[];

constructor( private rezepteService: RezepteService) {}

  ngOnInit(): void {
    this.rezepteService.getRezepteMini().then((rezepte) => {
      this.rezepte = rezepte;
      this.loading = false;

      this.rezepte.forEach((rezept) => (rezept.date = new Date(<Date>rezept.date)));
  });

    this.statuses = [
      { label: 'Noch nicht gekocht', value: 'noch nicht gekocht' },
      { label: 'Schon (x) gekocht', value: 'schon gekocht' },
    ];
    console.log('statuses array:', this.statuses);
}

  clear(table: Table) {
    table.clear();
  }

  getSeverity(status: string) {
    console.log('getSeverity function called with status:', status);
    switch (status.toLowerCase()) {
      case 'noch nicht gekocht':
        console.log('Status is noch nicht gekocht');
        return 'danger';

      case 'schon gekocht':
        return 'success';

      default:
        return 'null'
    }
  }

  protected readonly HTMLInputElement = HTMLInputElement;

}


