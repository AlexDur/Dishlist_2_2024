import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/*import {TagsComponent} from "./rezepteliste-desktop/tags/tags.component";*/
/*import {ListeninhaltComponent} from "./rezepteliste/rezepteliste-desktop/listeninhalt/listeninhalt.component";*/
import {TableModule} from "primeng/table";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {TagModule} from "primeng/tag";
import {RatingModule} from "primeng/rating";
import {ButtonModule} from "primeng/button";
import {ListeninhaltMobilComponent} from "./rezepteliste/rezepteliste-mobil/listeninhalt-mobil/listeninhalt-mobil/listeninhalt-mobil.component";
import {CardModule} from "primeng/card";
import {
  RezeptHinzufuegenButtonComponent
} from "./rezepteliste/rezepteliste-mobil/listeninhalt-mobil/rezept-hinzufuegen-button/rezept-hinzufuegen-button.component";
import {
  RezeptErstellungComponent
} from "./rezept-erstellung/rezept-erstellung.component";
import {ToggleButtonModule} from "primeng/togglebutton";
import {SharedModule} from "../shared/shared.module";
import {FotoUploadComponent} from "./rezept-erstellung/foto-upload/foto-upload.component";
import { FileUploadModule } from 'primeng/fileupload';
import {SeitenleisteModule} from "./seitenleiste/seitenleiste.module";
import {
  SeitenleisteMobilComponent
} from "./seitenleiste/seitenleiste-mobil/seitenleiste-mobil/seitenleiste-mobil.component";

@NgModule({
  declarations: [
  /*  ListeninhaltComponent,*/
    ListeninhaltMobilComponent,
    RezeptHinzufuegenButtonComponent,
    RezeptErstellungComponent,
    FotoUploadComponent
  ],
  exports: [
    ListeninhaltMobilComponent,
    RezeptHinzufuegenButtonComponent,
    RezeptErstellungComponent,
    FotoUploadComponent
  ],
    imports: [
    CommonModule,
    TableModule,
    HttpClientModule,
    FormsModule,
    TagModule,
    SeitenleisteModule,
    RatingModule,
    ButtonModule,
    CardModule,
    ToggleButtonModule,
    SharedModule,
    FileUploadModule


    ]
})
export class RezepteModule { }
