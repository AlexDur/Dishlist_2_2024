import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tag } from '../models/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private tagsSubject = new BehaviorSubject<Tag[]>([]);
  public tags$ = this.tagsSubject.asObservable();


  updateTags(tags: Tag[]): void {
    this.tagsSubject.next(tags);
  }

  getSelectedTags(): Tag[] {
    return this.tagsSubject.getValue();
  }
}
