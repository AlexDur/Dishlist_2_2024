import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {TableModule} from "primeng/table";
import { ListenContainerComponent } from './components/listen-container/listen-container.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {TagModule} from "primeng/tag";
import {RatingModule} from "primeng/rating";
import {ButtonModule} from "primeng/button";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SeitenleisteComponent} from "./seitenleiste/seitenleiste.component";
import {CheckboxModule} from "primeng/checkbox";
import {ContextMenuModule} from "primeng/contextmenu";
import { DropdownComponent } from './dropdown/dropdown.component';
import {TieredMenuModule} from "primeng/tieredmenu";
import {TagsComponent} from "./tags/tags.component";




@NgModule({
  declarations: [
    AppComponent,
    ListenContainerComponent,
    SeitenleisteComponent,
    DropdownComponent,
    TagsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    HttpClientModule,
    FormsModule,
    DropdownModule,
    TagModule,
    RatingModule,
    ButtonModule,
    BrowserAnimationsModule,
    CheckboxModule,
    ContextMenuModule,
    TieredMenuModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
