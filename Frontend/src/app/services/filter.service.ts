/*import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private _selectedCategories = new BehaviorSubject<string[]>([]);

  get selectedCategories() {
    return this._selectedCategories.asObservable();
  }

  selectCategory(category: string, isSelected: boolean) {
    if (isSelected) {
      // Kategorie hinzufügen
      this._selectedCategories.next([...this._selectedCategories.getValue(), category]);
    } else {
      // Kategorie entfernen
      this._selectedCategories.next(
        this._selectedCategories.getValue().filter(c => c !== category)
      );
    }
  }
}*/
