import { Component } from '@angular/core';
import {TagService} from "../services/tags.service";
import {Tag} from "../models/tag";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {

  tags: Tag[] = [];

  constructor(private tagService: TagService) {
    this.tagService.tags$.subscribe(tags => {
      this.tags = tags;
    });
  }
}
