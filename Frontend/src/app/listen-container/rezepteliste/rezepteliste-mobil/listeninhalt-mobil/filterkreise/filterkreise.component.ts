import { Component, Input, EventEmitter, Output  } from '@angular/core';
import {TagService} from "../../../../../services/tags.service";

@Component({
  selector: 'app-filterkreise',
  templateUrl: './filterkreise.component.html',
})
export class FilterkreiseComponent {
  @Input() label: string = '';
  @Output() tagRemoved = new EventEmitter<string>();

  constructor(private tagService: TagService) {}

  removeTag(): void {
    this.tagService.toggleTag(this.label);
  }
}
