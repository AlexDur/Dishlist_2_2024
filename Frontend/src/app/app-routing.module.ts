import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  RezeptErstellungComponent} from "./listen-container/rezept-erstellung/rezept-erstellung.component";
import {InfoScreenComponent} from "./intro/info-screen/info-screen.component";
import {SplashScreenComponent} from "./intro/splash-screen/splash-screen.component";
import {ListenContainerComponent} from "./listen-container/listen-container.component";
import {LoginComponent} from "./intro/nutzer-anmeldung/nutzer-anmeldung.component";
import {RegistrierungComponent} from "./intro/registrierung/registrierung.component";
import {VerifikationComponent} from "./intro/verifikation/verifikation.component";
import {DatenschutzComponent} from "./intro/datenschutz/datenschutz.component";


const routes: Routes = [
/*  { path: '', component: SplashScreenComponent },
  { path: 'intro', component: InfoScreenComponent },*/
  { path: 'listen-container', component: ListenContainerComponent},
  { path: 'anmeldung',component: LoginComponent},
  { path: 'verifikation', component: VerifikationComponent },
  { path: 'registrierung', component: RegistrierungComponent},
  { path: 'rezepterstellung', component: RezeptErstellungComponent },
  { path: 'anmeldung', component: LoginComponent},
  { path: 'datenschutzerklaerung', component: DatenschutzComponent },
  { path: '**', redirectTo: 'anmeldung' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
