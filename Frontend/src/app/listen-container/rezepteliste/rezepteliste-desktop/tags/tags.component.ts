/*
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Rezept} from "../../../../models/rezepte";
import {TagService} from "../../../../services/tags.service";
import {Tag} from "../../../../models/tag";

export type Dish = 'Vorspeise' | 'Hauptgang' | 'Nachtisch';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})

export class TagsComponent implements OnInit, OnDestroy, OnChanges{
  @Input() currentRecipe: Rezept | undefined;
  @Output() selectedTagsChanged = new EventEmitter<Tag[]>();


  /!*  private tagsSubject = new BehaviorSubject<Tag[]>([]);*!/
  currentSeverities: Record<'Vorspeise' | 'Hauptgang' | 'Nachtisch', 'success' | 'info' | 'warning' | 'danger' | 'default'> = {
    Vorspeise: 'success',
    Hauptgang: 'warning',
    Nachtisch: 'danger'
  };
  // Anfangs- und aktuelle Severity-Zustände
  initialSeverities: Record<Dish, 'success' | 'info' | 'warning' | 'danger'> = {
    Vorspeise: 'success',  // Orange
    Hauptgang: 'warning',  // Grün
    Nachtisch: 'danger'    // Rot
  };

  constructor(private cdr: ChangeDetectorRef, private tagService: TagService) {  this.currentSeverities = {
    Vorspeise: 'success',
    Hauptgang: 'warning',
    Nachtisch: 'danger',


  };}

  ngOnInit(){
    if (this.currentRecipe) {
      this.loadInitialTags();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentRecipe'] && changes['currentRecipe'].currentValue) {
      this.loadInitialTags();
    }
  }

  loadInitialTags(): void {
    if (this.currentRecipe && this.currentRecipe.tags) {
      this.currentRecipe.tags.forEach(tag => {
        // Stellen Sie sicher, dass sowohl `tag.label` als auch `tag.severity` definiert sind
        if (tag.label && tag.severity) {
          // Nun können Sie sicher sein, dass tag.label nicht undefined ist
          this.currentSeverities[tag.label] = tag.severity;
        }
      });
      this.cdr.detectChanges(); // Trigger a manual change detection to update the view
    }
  }


  handleClick(tag: Tag): void {
    const isInfoUnselected = this.currentSeverities[tag.label as Dish] === 'info';
    // Wenn die Checkbox abgewählt wird, rufe die resetTags-Funktion auf
    if (isInfoUnselected) {
      this.resetTags();
      return; // Beende die Funktion hier
    }
    const newSeverity = tag.severity === 'info' ? this.initialSeverities[tag.label as 'Vorspeise' | 'Hauptgang' | 'Nachtisch'] : 'info';
    this.currentSeverities[tag.label as 'Vorspeise' | 'Hauptgang' | 'Nachtisch'] = newSeverity;
    let updatedTags = this.tagService.getSelectedTags();
    const tagIndex = updatedTags.findIndex(t => t.label === tag.label);
    if (tagIndex !== -1) {
      updatedTags[tagIndex] = {...updatedTags[tagIndex], severity: newSeverity};
    } else {
      updatedTags.push({ ...tag, severity: newSeverity });
    }
    this.tagService.updateSelectedTags(updatedTags);  // Updaten der Tags im Service
    this.selectedTagsChanged.emit(updatedTags);  // Benachrichtige Elter
    this.updateTags();  // Sicherstellen, dass Tags im Service geupdated werden
  }

  getTagFromLabel(label: 'Vorspeise' | 'Hauptgang' | 'Nachtisch'): Tag {
    const tag = {
      label: label,
      severity: this.currentSeverities[label]
    };
    console.log('getTagFromLabel:', tag);
    return tag;
  }

  updateTags(): void {
    this.tagService.updateSelectedTags(Array.from(this.tagService.getSelectedTags()));
  }

  resetTags(): void {
    // Iteriere über die Schlüssel des currentSeverities-Objekts
    for (const key in this.currentSeverities) {
      if (Object.prototype.hasOwnProperty.call(this.currentSeverities, key)) {
        // Setze die Severity des aktuellen Tags auf den Ausgangszustand zurück
        this.currentSeverities[key as Dish] = this.initialSeverities[key as Dish];
      }
    }

    // Leere die ausgewählten Tags
    this.tagService.updateSelectedTags([]);
    this.selectedTagsChanged.emit([]); // Benachrichtige das übergeordnete Komponente über die Änderung
  }


  ngOnDestroy() {
  }
}
*/
