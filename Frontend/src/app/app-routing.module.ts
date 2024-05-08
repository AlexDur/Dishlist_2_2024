import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ListeninhaltMobilComponent
} from "./listen-container/rezepteliste/rezepteliste-mobil/listeninhalt-mobil/listeninhalt-mobil/listeninhalt-mobil.component";
import {
  RezeptErstellungComponent
} from "./listen-container/rezept-erstellung/rezept-erstellung.component";
import {InfoScreenComponent} from "./intro/info-screen/info-screen.component";
import {SplashScreenComponent} from "./intro/splash-screen/splash-screen.component";
import {ListenContainerComponent} from "./listen-container/listen-container.component";
import {SeitenleisteComponent} from "./listen-container/seitenleiste/seitenleiste-desktop/seitenleiste.component";

const routes: Routes = [
  { path: 'splash', component: SplashScreenComponent },
  { path: 'intro', component: InfoScreenComponent },
  { path: 'listencontainer', component: ListenContainerComponent},
/*  { path: 'listeninhalt', component: ListeninhaltMobilComponent },*/
  { path: 'rezepterstellung', component: RezeptErstellungComponent },
  { path: 'seitenleiste', component: SeitenleisteComponent },
  { path: '**', redirectTo: '//listeninhalt' } // Fallback für alle anderen ungültigen Routen
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
