import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SeitenleisteComponent} from "./seitenleiste.component";
import { FiltersComponent } from './filters/filters.component';
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    SeitenleisteComponent,
    FiltersComponent,
  ],
  exports: [
    SeitenleisteComponent
  ],
  imports: [
    CommonModule,
    CheckboxModule,
    FormsModule,
  ]
})
export class SeitenleisteModule { }
