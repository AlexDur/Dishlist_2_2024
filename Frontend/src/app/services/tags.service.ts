import { Injectable } from '@angular/core';
import {BehaviorSubject, forkJoin, map, Observable, throwError} from 'rxjs';
import { Tag } from '../models/tag';
import {HttpClient} from "@angular/common/http";
import {RezeptService} from "./rezepte.service";
import {environment} from "../../environments/environment";
import {DEFAULT_TAGS} from "../models/default_tag";


@Injectable({
  providedIn: 'root'
})
export class TagService {
  private tagsSubject = new BehaviorSubject<Tag[]>([]);
  public tags$ = this.tagsSubject.asObservable();
  private backendUrl = environment.apiUrl;
  tags: Tag[] = DEFAULT_TAGS

  constructor(private http: HttpClient, private rezepteService: RezeptService) {}

  getTags(): Tag[] {
    return this.tags;
  }

  updateTag(tag: Tag) {
    if (!tag.id) {
      console.error('Versuch, ein Tag ohne ID zu aktualisieren:', tag);
      return throwError(() => new Error('Tag hat keine ID'));
    }
    return this.http.put<Tag>(`/${tag.id}`, tag);
  }

  updateSelectedTags(selectedTags: Tag[]): void {
    const validTags = selectedTags.filter(tag => tag.id !== undefined);

    if (validTags.length === 0) {
      console.error('Keine gültigen Tags zum Aktualisieren gefunden.');
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

  getSelectedTags(): Tag[] {
    return this.tagsSubject.getValue();
  }

  countTags(tagLabel: string): Observable<number> {
    return this.rezepteService.rezepte$.pipe(
      map(rezepte =>
        rezepte.reduce((count, rezept) => {
          const tagExists = rezept.tags?.some(tag => tag.label === tagLabel);
          return count + (tagExists ? 1 : 0);
        }, 0)
      )
    );
  }

  getGerichtartenTags(): Tag[] {
    return this.tags.filter(tag => tag.type === 'Gänge');
  }

  getKuechenTags(): Tag[] {
    return this.tags.filter(tag => tag.type === 'Küche');
  }

  getNaehrwertTags(): Tag[] {
    return this.tags.filter(tag => tag.type === 'Nährwert');
  }
}
