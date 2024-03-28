import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Tag} from "../models/tag";

@Injectable({
  providedIn: 'root'
})

export class TagService {
  private tags = new BehaviorSubject<Tag[]>([]);
  tags$ = this.tags.asObservable();

  addTag(tag: { severity: "success" | "info" | "warning" | "danger"; label: string }) {
    const currentTags = this.tags.getValue();
    this.tags.next([...currentTags, tag]);
  }
}
