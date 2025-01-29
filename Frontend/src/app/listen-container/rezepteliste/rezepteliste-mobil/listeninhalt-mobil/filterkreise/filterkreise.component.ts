import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-filterkreise',
  templateUrl: './filterkreise.component.html',
})
export class FilterkreiseComponent {
  @Input() label: string = '';
  @Input() tag: string = '';
}
