import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {TagService} from "../services/tags.service";

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit{
  items: MenuItem[] | undefined;
  selectedTags: string[] = [];

  constructor(private tagService: TagService) {
  }

  ngOnInit() {
    this.items = [

      {
        label: 'Suche',
        icon: 'pi pi-share-alt',
      },
      {
        separator: true
      },
      {
        label: 'Gerichtart',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Vorspeise',
            icon: 'pi pi-plus',
            command: () => {
              this.addTag('Vorspeise', 'success');
            }
          },
          {
            label: 'Haupt',
            icon: 'pi pi-folder-open',
            command: () => {
              this.addTag('Haupt', 'success');
            }
          },
          {
            label: 'Nachtisch',
            icon: 'pi pi-print',
            command: () => {
              this.addTag('Nachtisch', 'success');
            }
          },
          {
            label: 'Getränk',
            icon: 'pi pi-print',
            command: () => {
              this.addTag('Getränk', 'success');
            }
          },
        ]
      },
      {
        label: 'Küchen',
        icon: 'pi pi-file-edit',
        items: [
          {
            label: 'Chinesisch',
            icon: 'pi pi-copy',
            command: () => {
              this.addTag('Chinesisch', 'warning');
            }
          },
          {
            label: 'Deutsch',
            icon: 'pi pi-times',
            command: () => {
              this.addTag('Deutsch', 'warning');
            }
          },
          {
            label: 'Indisch',
            icon: 'pi pi-copy',
            command: () => {
              this.addTag('Indisch', 'warning');
            }
          },
          {
            label: 'Italienisch',
            icon: 'pi pi-times',
            command: () => {
              this.addTag('Italienisch', 'warning');
            }
          }
          ,
          {
            label: 'Japanisch',
            icon: 'pi pi-times',
            command: () => {
              this.addTag('Japanisch', 'warning');
            }
          }
        ]
      },
      {
        label: 'Eigenschaften',
        icon: 'pi pi-file-edit',
        items: [
          {
            label: 'kalorienreich',
            icon: 'pi pi-copy',
            command: () => {
              this.addTag('kalorienreich', 'danger');
            }
          },
          {
            label: 'proteinreich',
            icon: 'pi pi-times',
            command: () => {
              this.addTag('proteinreich', 'danger');
            }
          },
          {
            label: 'schnell',
            icon: 'pi pi-copy',
            command: () => {
              this.addTag('schnell', 'danger');
            }
          },
          {
            label: 'vegetarisch',
            icon: 'pi pi-times',
            command: () => {
              this.addTag('vegetarisch', 'danger');
            }
          }
        ]
      }
    ]
  }

  addTag(label: string, severity: 'success' | 'info' | 'warning' | 'danger') {
    this.tagService.addTag({ label, severity });
  }


}
