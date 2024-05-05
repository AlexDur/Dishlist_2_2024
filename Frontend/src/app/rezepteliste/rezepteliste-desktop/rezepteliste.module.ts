import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TagsComponent} from "./tags/tags.component";
import {ListeninhaltComponent} from "./listeninhalt/listeninhalt.component";
import {TableModule} from "primeng/table";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {TagModule} from "primeng/tag";
import {RatingModule} from "primeng/rating";
import {ButtonModule} from "primeng/button";
import {ListeninhaltMobilComponent} from "../rezepteliste-mobil/listeninhalt-mobil/listeninhalt-mobil.component";
import {CardModule} from "primeng/card";

@NgModule({
  declarations: [
    TagsComponent,
    ListeninhaltComponent,
    ListeninhaltMobilComponent,

  ],
  exports: [
    ListeninhaltComponent,
    ListeninhaltMobilComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    HttpClientModule,
    FormsModule,
    TagModule,
    RatingModule,
    ButtonModule,
    CardModule
  ]
})
export class RezeptelisteModule { }
