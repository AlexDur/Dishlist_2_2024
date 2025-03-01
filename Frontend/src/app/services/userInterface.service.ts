import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';0
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInterfaceService implements OnDestroy{
  private activeTabSubject = new Subject<number>();
  activeTab$ = this.activeTabSubject.asObservable();

  private isMobileSource = new BehaviorSubject<boolean>(false);
  public isMobile$ = this.isMobileSource.asObservable();

  constructor() {
    // Initialer Aufruf der Bildschirmgrößenprüfung
    this.checkScreenSize();

    // Event-Listener für Fenstergrößenänderungen hinzufügen
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  private checkScreenSize() {
    const isMobile = window.innerWidth < 768; // Schwelle für mobile Ansicht
    this.isMobileSource.next(isMobile); // Veröffentlicht den neuen Wert
  }


  setActiveTab(tab: number) {
    this.activeTabSubject.next(tab);
  }

  getActiveTab(): number | undefined {
    return undefined;  // Rückgabe von undefined, weil kein Anfangswert festgelegt wurde
  }

  resetTab() {
    this.activeTabSubject.next(2);  // Immer auf DishList setzen
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }
}
