import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";



@NgModule({
  declarations: [
    DialogComponent
  ],
  exports: [
    DialogComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
  ]
})
export class SharedModule { }
