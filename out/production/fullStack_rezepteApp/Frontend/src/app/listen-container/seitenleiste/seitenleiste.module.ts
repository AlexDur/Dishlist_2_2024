import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";
import {SeitenleisteMobilComponent} from "./seitenleiste-mobil/seitenleiste-mobil/seitenleiste-mobil.component";
import { OverlayPanelModule } from 'primeng/overlaypanel';


@NgModule({
  declarations: [
    SeitenleisteMobilComponent
  ],
  exports: [
    SeitenleisteMobilComponent
  ],
  imports: [
    CommonModule,
    CheckboxModule,
    FormsModule,
    OverlayPanelModule
  ]
})
export class SeitenleisteModule { }