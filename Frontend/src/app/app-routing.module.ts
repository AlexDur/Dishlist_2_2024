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
import {NutzerAnmeldungComponent} from "./intro/nutzer-anmeldung/nutzer-anmeldung.component";
import {RegistrierungComponent} from "./intro/registrierung/registrierung.component";

const routes: Routes = [
  { path: 'splash', component: SplashScreenComponent },
  { path: 'intro', component: InfoScreenComponent },
  { path: 'listencontainer', component: ListenContainerComponent},
  { path: 'anmeldung', component: NutzerAnmeldungComponent },
  { path: 'registrierung', component: RegistrierungComponent },
  { path: 'rezepterstellung', component: RezeptErstellungComponent },
  { path: '**', redirectTo: '//listencontainer' } // Fallback für alle anderen ungültigen Routen
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
