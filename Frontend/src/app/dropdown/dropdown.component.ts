import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit{
  items: MenuItem[] | undefined;

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
          },
          {
            label: 'Haupt',
            icon: 'pi pi-folder-open'
          },
          {
            label: 'Nachtisch',
            icon: 'pi pi-print'
          },
          {
            label: 'Getränk',
            icon: 'pi pi-print'
          },
        ]
      },
      {
        label: 'Küchen',
        icon: 'pi pi-file-edit',
        items: [
          {
            label: 'Chinesisch',
            icon: 'pi pi-copy'
          },
          {
            label: 'Deutsch',
            icon: 'pi pi-times'
          },
          {
            label: 'Indisch',
            icon: 'pi pi-copy'
          },
          {
            label: 'Italienisch',
            icon: 'pi pi-times'
          }
          ,
          {
            label: 'Japanisch',
            icon: 'pi pi-times'
          }
        ]
      },
      {
        label: 'Eigenschaften',
        icon: 'pi pi-file-edit',
        items: [
          {
            label: 'kalorienreich',
            icon: 'pi pi-copy'
          },
          {
            label: 'proteinreich',
            icon: 'pi pi-times'
          },
          {
            label: 'schnell',
            icon: 'pi pi-copy'
          },
          {
            label: 'vegetarisch',
            icon: 'pi pi-times'
          }
          ,
          {
            label: 'Japanisch',
            icon: 'pi pi-times'
          }
        ]
      }
    ]
  }




}
