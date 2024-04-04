import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Tag } from "../models/tag";
import { Rezept } from "../models/rezepte";
import { TagService } from "../services/tags.service";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnChanges {
  @Input() currentRecipe: Rezept | undefined;
  tags: Tag[] = [];

  constructor(private tagService: TagService) {
    this.tagService.tags$.subscribe(tags => {
      this.tags = tags;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentRecipe'] && this.currentRecipe) {
      this.tags = this.convertToTags(this.currentRecipe.tags || []);
    }
  }

  private convertToTags(tagLabels: string[]): Tag[] {
    return tagLabels.map(label => ({ label } as Tag));
  }
}
