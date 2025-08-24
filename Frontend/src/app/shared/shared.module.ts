import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { RecipeModalComponent } from './recipe-modal/recipe-modal.component';
import { NotificationComponent } from './notification/notification.component';
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";



@NgModule({
  declarations: [
    DialogComponent,
    RecipeModalComponent,
    NotificationComponent
  ],
  exports: [
    DialogComponent,
    RecipeModalComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
  ]
})
export class SharedModule { }
