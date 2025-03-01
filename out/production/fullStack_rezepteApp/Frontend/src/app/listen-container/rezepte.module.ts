import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import {CameraComponent} from "./rezept-erstellung/camera/camera.component";
import {CropperComponent} from "./rezept-erstellung/foto-upload/cropper/cropper.component";
import { ReactiveFormsModule } from '@angular/forms';
import {
  FilterkreiseComponent
} from "./rezepteliste/rezepteliste-mobil/listeninhalt-mobil/filterkreise/filterkreise.component";
import {EmpfehlungenComponent} from "./tableiste/empfehlungen/empfehlungen.component";
import {FormatTagsPipe} from "../shared/pipes/spoonTags";
import { AsyncPipe } from '@angular/common';


@NgModule({
  declarations: [
    ListeninhaltMobilComponent,
    RezeptHinzufuegenButtonComponent,
    RezeptErstellungComponent,
    FotoUploadComponent,
    CameraComponent,
    CropperComponent,
    FilterkreiseComponent,
    EmpfehlungenComponent,
  ],
  exports: [
    ListeninhaltMobilComponent,
    RezeptHinzufuegenButtonComponent,
    RezeptErstellungComponent,
    FotoUploadComponent,
    CameraComponent,
    EmpfehlungenComponent,
  ],
  imports: [
    TableModule,
    HttpClientModule,
    FormsModule,
    TagModule,
    RatingModule,
    ButtonModule,
    CardModule,
    ToggleButtonModule,
    SharedModule,
    FileUploadModule,
    ReactiveFormsModule,
    FormatTagsPipe,
    AsyncPipe,
    CommonModule,
  ]
})
export class RezepteModule { }
