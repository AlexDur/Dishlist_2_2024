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
          name: 'James Butt',
          country: {
            name: 'Algeria',
            code: 'dz'
          },
          company: 'Benton, John B Jr',
          date: '2015-09-13',
          status: 'unqualified',
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

