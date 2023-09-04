import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RezepteService {
    getData() {
      return [
        {
          id: 1000,
          name: 'Scholl auf Bulgarlinsen mit Spinat und Tomaten',
          country: {
            name: 'www.schmatz.com',
            code: 'dz'
          },
          company: 'Benton, John B Jr',
          date: '2015-09-13',
          status: 'schon gekocht',
          verified: true,
          activity: 17,
          representative: {
            name: 'Ioni Bowcher',
            image: 'ionibowcher.png'
          },
          balance: 70663
        },
        {
          id: 1000,
          name: 'Vollkornbrot mit Humus und grünem Salat',
          country: {
            name: 'www.lecker.de',
            code: 'dz'
          },
          company: 'Benton, John B Jr',
          date: '2015-09-13',
          status: 'noch nicht gekocht',
          verified: true,
          activity: 17,
          representative: {
            name: 'Ioni Bowcher',
            image: 'ionibowcher.png'
          },
          balance: 70663
        },
        ]
  }
  constructor( private http: HttpClient){}

  getRezepteMini() {
    return Promise.resolve(this.getData().slice(0, 5));
  }
}

