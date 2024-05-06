import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ContextMenuModule} from "primeng/contextmenu";
import {SeitenleisteModule} from "./seitenleiste/seitenleiste.module";
import {ListenContainerComponent} from "./rezepteliste/listen-container/listen-container.component";
import {RezeptelisteModule} from "./rezepteliste/rezepteliste-desktop/rezepteliste.module";
import { RezeptErstellungComponent } from './rezepteliste/rezepteliste-mobil/listeninhalt-mobil/rezept-erstellung/rezept-erstellung.component';
import { RezeptHinzufuegenButtonComponent } from './rezepteliste/rezepteliste-mobil/listeninhalt-mobil/rezept-hinzufuegen-button/rezept-hinzufuegen-button.component';
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    AppComponent,
    ListenContainerComponent,
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
    FormsModule
  ],
  providers: [],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
