import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListenansichtService {
  spaltenAnzahlSource = new BehaviorSubject<number>(2); // Standard 2 Spalten
  spaltenAnzahl$ = this.spaltenAnzahlSource.asObservable(); // Observable für Abonnieren

  private actionButtonsVisibleSource = new BehaviorSubject<boolean>(true);
  actionButtonsVisible$ = this.actionButtonsVisibleSource.asObservable();

  private verbergeButtonsSource = new BehaviorSubject<boolean>(false);
  public verbergeButtons$ = this.verbergeButtonsSource.asObservable();


  wechselSpaltenanzahl() {
    const neueSpaltenanzahl = this.spaltenAnzahlSource.value === 2 ? 4 : 2;
    this.spaltenAnzahlSource.next(neueSpaltenanzahl); // Zustand wechseln
  }

  verbergeButtons(){
    const actionButtonSichtbarkeit = !this.actionButtonsVisibleSource.value;
    this.actionButtonsVisibleSource.next(actionButtonSichtbarkeit)

  }

  setzeButtonsVerbergen(status: boolean) {
    this.verbergeButtonsSource.next(status);
  }

}

