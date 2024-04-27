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
    const tags = this.tagsSubject.getValue();
    const updatedTags = tags.map(tag => {
      const foundTag = selectedTags.find(t => t.label === tag.label);
      return foundTag ? { ...tag, ...foundTag } : tag;
    });

    // Fügen Sie fehlende Tags hinzu, die noch nicht in der Liste sind
    selectedTags.forEach(tag => {
      if (!updatedTags.some(t => t.label === tag.label)) {
        updatedTags.push(tag);
      }
    });

    this.tagsSubject.next(updatedTags);
  }



  getSelectedTags(): Tag[] {
    return this.tagsSubject.getValue();
  }
}
