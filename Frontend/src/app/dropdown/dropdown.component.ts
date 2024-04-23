/*
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from "primeng/api";
import {TagService} from "../services/tags.service";
import {Menu} from "primeng/menu";
import {BehaviorSubject} from "rxjs";
import {Rezept} from "../models/rezepte";
import {Tag} from "../models/tag";


@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit{
  @ViewChild('menu') menu!: Menu;
  @Input() currentRecipe: Rezept | undefined;
  @Input() editMode: boolean =false;
  items: MenuItem[] | undefined;



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
              this.addTag({ label: 'Vorspeise', severity: 'success' });
            }
          },
          {
            label: 'Haupt',
            icon: 'pi pi-folder-open',
            command: () => {
              this.addTag({ label: 'Haupt', severity: 'success' });
            }
          },
          {
            label: 'Nachtisch',
            icon: 'pi pi-print',
            command: () => {
              this.addTag({ label: 'Nachtisch', severity: 'success' });
            }
          },
          {
            label: 'Getränk',
            icon: 'pi pi-print',
            command: () => {
              this.addTag({ label: 'Getränk', severity: 'success' });
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
              this.addTag({ label: 'Chinesisch', severity: 'warning' });
            }
          },
          {
            label: 'Deutsch',
            icon: 'pi pi-times',
            command: () => {
              this.addTag({ label: 'Deutsch', severity: 'warning' });
            }
          },
          {
            label: 'Indisch',
            icon: 'pi pi-copy',
            command: () => {
              this.addTag({ label: 'Indisch', severity: 'warning' });
            }
          },
          {
            label: 'Italienisch',
            icon: 'pi pi-times',
            command: () => {
              this.addTag({ label: 'Italienisch', severity: 'warning' });
            }
          },
          {
            label: 'Japanisch',
            icon: 'pi pi-times',
            command: () => {
              this.addTag({ label: 'Japanisch', severity: 'warning' });
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
              this.addTag({ label: 'kalorienreich', severity: 'danger' });
            }
          },
          {
            label: 'proteinreich',
            icon: 'pi pi-times',
            command: () => {
              this.addTag({ label: 'proteinreich', severity: 'danger' });
            }
          },
          {
            label: 'schnell',
            icon: 'pi pi-copy',
            command: () => {
              this.addTag({ label: 'schnell', severity: 'danger' });
            }
          },
          {
            label: 'vegetarisch',
            icon: 'pi pi-times',
            command: () => {
              this.addTag({ label: 'vegetarisch', severity: 'danger' });
            }
          }
        ]
      }
    ]
  }

  addTag(tag: Tag): void {
    const currentTags = this.tagService.getSelectedTags();

    // Überprüfe, ob der Tag bereits vorhanden ist
    const tagExists = currentTags.some(existingTag => existingTag.label === tag.label);
    if (!tagExists) {
      // Füge den Tag hinzu und aktualisiere den TagService
      const updatedTags = [...currentTags, tag];
      this.tagService.updateTags(updatedTags);
    } else {
      console.log('Tag already exists:', tag.label);
    }
  }


  toggleEditMode(): void {
    this.editMode = !this.editMode
    if (event) {
      this.menu.toggle(event);
    }
  }

}
*/
