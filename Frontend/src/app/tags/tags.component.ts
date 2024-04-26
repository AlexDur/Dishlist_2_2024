import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {Rezept} from "../models/rezepte";
import {TagService} from "../services/tags.service";
import {Tag} from "../models/tag";
import {BehaviorSubject} from "rxjs";

export type Dish = 'Vorspeise' | 'Hauptgang' | 'Nachtisch';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})

export class TagsComponent {
  @Input()currentRecipe: Rezept | undefined;
  @Output() selectedTagsChanged = new EventEmitter
  private tagsSubject = new BehaviorSubject<Tag[]>([]);
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

  handleClick(tag: Tag): void {
    const newSeverity = tag.severity === 'info' ? this.initialSeverities[tag.label as Dish] : 'info';
    this.currentSeverities[tag.label as Dish] = newSeverity;  // Update currentSeverities
    const updatedTags = this.tagsSubject.getValue();
    const tagIndex = updatedTags.findIndex(t => t.label === tag.label);
    if (tagIndex !== -1) {
      updatedTags[tagIndex] = {...updatedTags[tagIndex], severity: newSeverity};
    } else {
      updatedTags.push({ ...tag, severity: newSeverity });
    }
    this.tagsSubject.next(updatedTags);
    this.cdr.detectChanges();  // Notify Angular to update the view
    this.selectedTagsChanged.emit(new Set(this.tagsSubject.getValue())); // Notify parent component
    this.updateTags(); // Update tags in the service after handling the click
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
    // Aktualisiere alle Tags basierend auf dem aktuellen Zustand im Subject
    this.tagService.updateSelectedTags(Array.from(this.tagsSubject.getValue()));
  }



}
