import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'formatTags'
})
export class FormatTagsPipe implements PipeTransform {
  transform(tags: any[]): string {
    if (!tags || tags.length === 0) {
      return '';
    }
    return tags.map(tag => tag.label).join(' / '); // .label verwenden
  }
}
