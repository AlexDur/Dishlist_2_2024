import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {Rezept} from "../models/rezepte";


type Dish = 'Vorspeise' | 'Hauptgang' | 'Nachtisch';


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})

export class TagsComponent {
  @Input()currentRecipe: Rezept | undefined;
  // Anfangs- und aktuelle Severity-Zustände
  initialSeverities: Record<Dish, string> = {
    Vorspeise: 'warning',  // Gelb
    Hauptgang: 'success',  // Grün
    Nachtisch: 'danger'    // Rot
  };
  currentSeverities: Record<Dish, string> = {...this.initialSeverities};

  handleClick(dish: Dish): void {
    // Überprüfen, ob die aktuelle Severity 'info' ist
    if (this.currentSeverities[dish] === 'info') {
      // Zurücksetzen auf die ursprüngliche Severity
      this.currentSeverities[dish] = this.initialSeverities[dish];
    } else {
      // Ändern der Severity auf 'info'
      this.currentSeverities[dish] = 'info';
    }
  }
}
