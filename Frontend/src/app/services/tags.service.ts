import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tag } from '../models/tag';


@Injectable({
  providedIn: 'root'
})
export class TagService {
  private tagsSubject = new BehaviorSubject<Tag[]>([]);
  public tags$ = this.tagsSubject.asObservable();

  updateSelectedTags(selectedTags: Tag[]): void {
    const tags = this.tagsSubject.getValue(); // Aktuelle Tags abrufen
    const updatedTags: Tag[] = [];

    // Überprüfen, ob die Tags bereits im aktuellen Set enthalten sind, und sie aktualisieren oder hinzufügen
    selectedTags.forEach(selectedTag => {
      const existingTagIndex = tags.findIndex(tag => tag.label === selectedTag.label); // Korrektur: Vergleich der Labels
      if (existingTagIndex !== -1) {
        // Tag existiert bereits, aktualisieren
        updatedTags.push({ ...tags[existingTagIndex], ...selectedTag }); // Annahme: selectedTag könnte aktualisierte Informationen haben
      } else {
        // Tag existiert nicht, hinzufügen
        updatedTags.push(selectedTag); // Annahme: selectedTag ist bereits vollständig definiert
      }
    });

    // Aktualisieren des Subjects mit den neuen Tags
    this.tagsSubject.next(updatedTags);
  }


  getSelectedTags(): Tag[] {
    return this.tagsSubject.getValue();
  }
}
