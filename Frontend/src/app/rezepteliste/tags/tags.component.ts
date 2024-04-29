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

export class TagsComponent implements OnInit, OnDestroy{
  @Input()currentRecipe: Rezept | undefined;
  @Output() selectedTagsChanged = new EventEmitter<Tag[]>();
  public subscription?: Subscription;
  public tags: Tag[] = [];

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

  ngOnInit(): void {
 /*   this.subscription = this.tagService.tags$.subscribe(tags => {
      this.tags = tags;
      console.log('Aktualisierte Tags:', tags);
    });*/
  }

  handleClick(tag: Tag): void {
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }



}
