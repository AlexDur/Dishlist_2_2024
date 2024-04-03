import {Component, Input} from '@angular/core';
import {TagService} from "../services/tags.service";
import {Tag} from "../models/tag";
import {Rezept} from "../models/rezepte";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  @Input() currentRecipe: Rezept | undefined;
  tags: Tag[] = [];

  constructor(private tagService: TagService) {
    this.tagService.tags$.subscribe(tags => {
      this.tags = tags;
    });
  }

  getSelectedTags(): string[] {
    return this.tags.map(tag => tag.label);
  }
}
