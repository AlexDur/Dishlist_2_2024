import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ContextMenuModule } from "primeng/contextmenu";

import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { SplashScreenComponent } from './intro/splash-screen/splash-screen.component';
import { InfoScreenComponent } from './intro/info-screen/info-screen.component';
import { ButtonModule } from "primeng/button";
import { SharedModule } from "./shared/shared.module";
import { ToggleButtonModule } from "primeng/togglebutton";
import { RezepteModule } from "./listen-container/rezepte.module";
import { LoginComponent } from "./intro/nutzer-anmeldung/nutzer-anmeldung.component";
import { RegistrierungComponent } from "./intro/registrierung/registrierung.component";
import { VerifikationComponent } from "./intro/verifikation/verifikation.component";
import { TableisteComponent } from "./listen-container/tableiste/tableiste.component";
import { DatenschutzComponent } from "./intro/datenschutz/datenschutz.component";
import { LandingComponent } from './landing/landing.component';
import { ReactiveFormsModule } from '@angular/forms';
import {FormatTagsPipe} from "./shared/pipes/spoonTags";
import {
  SeitenleisteMobilComponent
} from "./listen-container/seitenleiste/seitenleiste-mobil/seitenleiste-mobil/seitenleiste-mobil.component";
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';
import { ListenContainerComponent } from "./listen-container/listen-container.component";


@NgModule({
  declarations: [
    AppComponent,
    ListenContainerComponent,
    SplashScreenComponent,
    InfoScreenComponent,
    LoginComponent,
    RegistrierungComponent,
    VerifikationComponent,
    TableisteComponent,
    DatenschutzComponent,
    LandingComponent,
    SeitenleisteMobilComponent
  ],
  imports: [
    BrowserModule,
    RezepteModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ContextMenuModule,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    SharedModule,
    ToggleButtonModule,
    ReactiveFormsModule,
    FormatTagsPipe,
    CommonModule,
    CheckboxModule,
    FormsModule,
    OverlayPanelModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
