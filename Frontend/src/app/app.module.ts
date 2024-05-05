import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ContextMenuModule} from "primeng/contextmenu";
import {SeitenleisteModule} from "./seitenleiste/seitenleiste-desktop/seitenleiste.module";
import {ListenContainerComponent} from "./rezepteliste/rezepteliste-desktop/listen-container/listen-container.component";
import {RezeptelisteModule} from "./rezepteliste/rezepteliste-desktop/rezepteliste.module";



@NgModule({
  declarations: [
    AppComponent,
    ListenContainerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ContextMenuModule,
    SeitenleisteModule,
    RezeptelisteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
