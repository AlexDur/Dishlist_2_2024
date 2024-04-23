import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {Rezept} from "../models/rezepte";
import {TagService} from "../services/tags.service";

export type Dish = 'Vorspeise' | 'Hauptgang' | 'Nachtisch';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})

export class TagsComponent {
  @Input()currentRecipe: Rezept | undefined;
  @Output() activeTagsChanged = new EventEmitter<Set<Dish>>();

  // Anfangs- und aktuelle Severity-Zustände
  initialSeverities: Record<Dish, string> = {
    Vorspeise: 'warning',  // Orange
    Hauptgang: 'success',  // Grün
    Nachtisch: 'danger'    // Rot
  };
  currentSeverities: Record<Dish, string> = {...this.initialSeverities};
  activeTags: Set<Dish> = new Set();

  constructor(private cdr: ChangeDetectorRef, private tagService: TagService) {}


  handleClick(dish: Dish): void {
    if (this.activeTags.has(dish)) {
      // Deaktiviert das Tag
      this.activeTags.delete(dish);
      this.currentSeverities[dish] = this.initialSeverities[dish];
    } else {
      // Aktiviert das Tag
      this.activeTags.add(dish);
      console.log('dish', dish)
      this.currentSeverities[dish] = 'info';
    }
    this.cdr.detectChanges();

    // Aktualisiere die Tags im TagService
    this.updateTags(this.activeTags);
  }

  updateTags(activeTags: Set<Dish>): void {
    this.tagService.updateActiveTags(activeTags);
  }

}
