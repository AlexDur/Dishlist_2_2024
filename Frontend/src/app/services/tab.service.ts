import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private activeTabSubject = new Subject<number>();
  activeTab$ = this.activeTabSubject.asObservable();

  setActiveTab(tab: number) {
    this.activeTabSubject.next(tab);
  }

  getActiveTab(): number | undefined {
    return undefined;  // Rückgabe von undefined, weil kein Anfangswert festgelegt wurde
  }

  resetTab() {
    this.activeTabSubject.next(2);  // Immer auf DishList setzen
  }
}
