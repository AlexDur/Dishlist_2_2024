import { Injectable } from '@angular/core';
import {BehaviorSubject, forkJoin, map, Observable, throwError} from 'rxjs';
import { Tag } from '../models/tag';
import {HttpClient} from "@angular/common/http";
import {RezeptService} from "./rezepte.service";
import {DEFAULT_TAGS} from "../models/default_tag";


@Injectable({
  providedIn: 'root'
})
export class TagService {
  private tagsSubject = new BehaviorSubject<Tag[]>([]);

  // BehaviorSubject hält die aktuellen selectedTags
  private selectedTagsSubject = new BehaviorSubject<string[]>([]);
  selectedTags$ = this.selectedTagsSubject.asObservable();

  constructor(private http: HttpClient) {}


  //Zum Hinzufügen und Entfernen von Tags (beides in Seiteneleiste und Entfernen auch in Filterkreisen)
  toggleTag(tag: string): void {
    const currentTags = this.selectedTagsSubject.value;
    let updatedTags: string[];

    if (currentTags.includes(tag)) {
      updatedTags = currentTags.filter(t => t !== tag);
      this.updateTagCount(tag, -1); // Zähler reduzieren, wenn Tag entfernt wird
    } else {
      updatedTags = [...currentTags, tag];
      this.updateTagCount(tag, 1); // Zähler erhöhen, wenn Tag hinzugefügt wird
    }

    this.setSelectedTags(updatedTags);
    this.updateSelectedTags(this.tagsSubject.value);
  }

// Hilfsfunktion zum Aktualisieren des Zählers eines Tags
  private updateTagCount(tag: string, delta: number): void {
    const updatedTags = this.tagsSubject.value.map(t => {
      if (t.label === tag) {
        t.count += delta; // Zähler aktualisieren
      }
      return t;
    });

    this.tagsSubject.next(updatedTags); // Das tagsSubject mit den aktualisierten Tags setzen
  }


  updateTag(tag: Tag) {
    if (!tag.id) {
      console.error('Versuch, ein Tag ohne ID zu aktualisieren:', tag);
      return throwError(() => new Error('Tag hat keine ID'));
    }
    return this.http.put<Tag>(`/${tag.id}`, tag);
  }

  //Hilfsfunktion essentiell für UpdateDates
  private updateSelectedTags(selectedTags: Tag[]): void {
    const validTags = selectedTags.filter(tag => tag.id !== undefined);

    if (validTags.length === 0) {
      return;
    }

    forkJoin(validTags.map(tag => this.updateTag(tag))).subscribe({
      next: (updatedTags) => {
        console.log('Alle Tags wurden erfolgreich aktualisiert', updatedTags);
        this.tagsSubject.next(updatedTags);
      },
      error: (error) => {
        console.error('Fehler beim Aktualisieren der Tags', error);
      }
    });
  }

  setSelectedTags(tags: string[]): void {
    this.selectedTagsSubject.next(tags);
  }
}
