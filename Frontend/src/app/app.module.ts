import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {TableModule} from "primeng/table";
import { ListenContainerComponent } from './listen-container/listen-container.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {TagModule} from "primeng/tag";
import {RatingModule} from "primeng/rating";

@NgModule({
  declarations: [
    AppComponent,
    ListenContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    HttpClientModule,
    FormsModule,
    DropdownModule,
    TagModule,
    RatingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
