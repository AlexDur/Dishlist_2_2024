import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SeitenleisteComponent} from "./seitenleiste-desktop/seitenleiste.component";
import { FiltersComponent } from './seitenleiste-desktop/filters/filters.component';
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";
import {SeitenleisteMobilComponent} from "./seitenleiste-mobil/seitenleiste-mobil/seitenleiste-mobil.component";



@NgModule({
  declarations: [
    SeitenleisteComponent,
    SeitenleisteMobilComponent,
    FiltersComponent,
  ],
  exports: [
    SeitenleisteComponent,
    SeitenleisteMobilComponent
  ],
  imports: [
    CommonModule,
    CheckboxModule,
    FormsModule,
  ]
})
export class SeitenleisteModule { }
