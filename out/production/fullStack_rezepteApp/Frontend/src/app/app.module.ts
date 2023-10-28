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
import { RezeptFormComponent } from './components/rezept-form/rezept-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ListenContainerComponent,
    RezeptFormComponent
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
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
