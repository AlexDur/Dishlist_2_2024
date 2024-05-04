import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Rezept} from "../../models/rezepte";
import {TagService} from "../../services/tags.service";
import {Tag} from "../../models/tag";
import {Subscription} from "rxjs";

export type Dish = 'Vorspeise' | 'Hauptgang' | 'Nachtisch';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})

export class TagsComponent implements OnInit{
  @Input()currentRecipe: Rezept | undefined;
  @Output() selectedTagsChanged = new EventEmitter<Tag[]>();

  /*  private tagsSubject = new BehaviorSubject<Tag[]>([]);*/
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
    Nachtisch: 'danger'
  };}

  ngOnInit(){
    this.loadInitialTags();
  }

  loadInitialTags(): void {
    this.tagService.getSelectedTags().forEach(tag => {
      if (tag.severity) {
        this.currentSeverities[tag.label as Dish] = tag.severity;
      }
    });
    this.cdr.detectChanges();
  }

  handleClick(tag: Tag): void {
    const isCheckboxUnselected = this.currentSeverities[tag.label as Dish] === 'info';
    // Wenn die Checkbox abgewählt wird, rufe die resetTags-Funktion auf
    if (isCheckboxUnselected) {
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
    this.tagService.updateSelectedTags(updatedTags);  // Updates the tags in the service
    this.selectedTagsChanged.emit(updatedTags);  // Notify parent component
    this.updateTags();  // Ensure tags are updated in the service
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


}
