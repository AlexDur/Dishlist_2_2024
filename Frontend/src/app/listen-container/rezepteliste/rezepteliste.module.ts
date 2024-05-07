import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TagsComponent} from "./rezepteliste-desktop/tags/tags.component";
import {ListeninhaltComponent} from "./rezepteliste-desktop/listeninhalt/listeninhalt.component";
import {TableModule} from "primeng/table";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {TagModule} from "primeng/tag";
import {RatingModule} from "primeng/rating";
import {ButtonModule} from "primeng/button";
import {ListeninhaltMobilComponent} from "./rezepteliste-mobil/listeninhalt-mobil/listeninhalt-mobil/listeninhalt-mobil.component";
import {CardModule} from "primeng/card";
import {
  RezeptHinzufuegenButtonComponent
} from "./rezepteliste-mobil/listeninhalt-mobil/rezept-hinzufuegen-button/rezept-hinzufuegen-button.component";
import {
  RezeptErstellungComponent
} from "../rezept-erstellung/rezept-erstellung.component";

@NgModule({
  declarations: [
    TagsComponent,
    ListeninhaltComponent,
    ListeninhaltMobilComponent,
    RezeptHinzufuegenButtonComponent,
    RezeptErstellungComponent,
  ],
  exports: [
    ListeninhaltComponent,
    ListeninhaltMobilComponent,
    RezeptHinzufuegenButtonComponent,
    RezeptErstellungComponent,
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
