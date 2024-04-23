import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tag } from '../models/tag';
import {Dish} from "../tags/tags.component";

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private tagsSubject = new BehaviorSubject<Tag[]>([]);
  public tags$ = this.tagsSubject.asObservable();

  updateActiveTags(activeTags: Set<Dish>): void {
    const tags = this.tagsSubject.getValue(); // Aktuelle Tags abrufen
    const updatedTags: Tag[] = [];

    // Überprüfen, ob die Tag bereits im aktuellen Set enthalten ist, und sie aktualisieren oder hinzufügen
    activeTags.forEach(activeTag => {
      const existingTagIndex = tags.findIndex(tag => tag.label === activeTag);
      if (existingTagIndex !== -1) {
        // Tag existiert bereits, aktualisieren
        updatedTags.push({ ...tags[existingTagIndex] });
      } else {
        // Tag existiert nicht, hinzufügen
        updatedTags.push({ label: activeTag, severity: 'info' });
      }
    });

    // Neue Tags dem aktuellen Zustand hinzufügen
    this.tagsSubject.next([...tags, ...updatedTags]);
  }

  getSelectedTags(): Tag[] {
    return this.tagsSubject.getValue();
  }
}
