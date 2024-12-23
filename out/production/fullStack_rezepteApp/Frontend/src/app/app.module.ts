import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ContextMenuModule} from "primeng/contextmenu";
import {ListenContainerComponent} from "./listen-container/listen-container.component";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";
import { SplashScreenComponent } from './intro/splash-screen/splash-screen.component';
import { InfoScreenComponent } from './intro/info-screen/info-screen.component';
import {ButtonModule} from "primeng/button";
import {SharedModule} from "./shared/shared.module";
import {ToggleButtonModule} from "primeng/togglebutton";
import {RezepteModule} from "./listen-container/rezepte.module";
import {SeitenleisteModule} from "./listen-container/seitenleiste/seitenleiste.module";
import {LoginComponent} from "./intro/nutzer-anmeldung/nutzer-anmeldung.component";
import {RegistrierungComponent} from "./intro/registrierung/registrierung.component";
import {VerifikationComponent} from "./intro/verifikation/verifikation.component";
import {TableisteComponent} from "./listen-container/tableiste/tableiste.component";
import {DatenschutzComponent} from "./intro/datenschutz/datenschutz.component";
import { CommonModule } from '@angular/common';


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
    DatenschutzComponent

   ],

  // Wenn das AppModul das RezeptelistenModul importiert, kann das AppModul die exportierten Komponenten des
  // RezeptelistenModuls in seinen eigenen Komponenten oder in anderen Modulen, die es importiert, verwenden.
  imports: [
    BrowserModule,
    RezepteModule,
    SeitenleisteModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ContextMenuModule,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    SharedModule,
    ToggleButtonModule,
    CommonModule
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
