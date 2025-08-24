import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'formatTags'
})
export class FormatTagsPipe implements PipeTransform {
  transform(tags: any[] | null | undefined): string { // Erlaube null und undefined
    if (!tags || tags.length === 0) { // Überprüfe auf null oder undefined *und* leeres Array
      return '';
    }
    return tags.map(tag => tag.label).join(' / ');
  }
}
