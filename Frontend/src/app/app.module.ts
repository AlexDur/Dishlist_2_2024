import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ContextMenuModule} from "primeng/contextmenu";
import {SeitenleisteModule} from "./listen-container/seitenleiste/seitenleiste.module";
import {ListenContainerComponent} from "./listen-container/listen-container.component";
import {RezeptelisteModule} from "./listen-container/rezepteliste/rezepteliste.module";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";
import { SplashScreenComponent } from './intro/splash-screen/splash-screen.component';
import { InfoScreenComponent } from './intro/info-screen/info-screen.component';
import {ButtonModule} from "primeng/button";
import {RouterModule} from "@angular/router";
import {SharedModule} from "./shared/shared.module";
import {RezeptErstellungComponent} from "./listen-container/rezept-erstellung/rezept-erstellung.component";
import {ToggleButtonModule} from "primeng/togglebutton";



@NgModule({
  declarations: [
    AppComponent,
    ListenContainerComponent,
    SplashScreenComponent,
    InfoScreenComponent,
   ],

  // Wenn das AppModul das RezeptelistenModul importiert, kann das AppModul die exportierten Komponenten des
  // RezeptelistenModuls in seinen eigenen Komponenten oder in anderen Modulen, die es importiert, verwenden.
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ContextMenuModule,
    SeitenleisteModule,
    RezeptelisteModule,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    SharedModule,
    ToggleButtonModule
  ],
  providers: [],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
