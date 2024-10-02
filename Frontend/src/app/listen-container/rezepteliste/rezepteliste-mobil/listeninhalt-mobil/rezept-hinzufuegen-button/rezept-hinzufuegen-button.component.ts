import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {RezeptService} from "../../../../../services/rezepte.service";

@Component({
  selector: 'app-rezept-hinzufuegen-button',
  templateUrl: './rezept-hinzufuegen-button.component.html',
  styleUrls: ['./rezept-hinzufuegen-button.component.scss']
})
export class RezeptHinzufuegenButtonComponent {

  constructor(private router: Router, private rezepteService: RezeptService) {}

  navigateForm(event: MouseEvent) {
    event.preventDefault();

    this.rezepteService.clearCurrentRezept();
    this.router.navigate(['/rezepterstellung']);
  }
}
