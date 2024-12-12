import { Component, Input } from '@angular/core';
import {Router} from "@angular/router";
import {RezeptService} from "../../../../../services/rezepte.service";

@Component({
  selector: 'app-rezept-hinzufuegen-button',
  templateUrl: './rezept-hinzufuegen-button.component.html'
})
export class RezeptHinzufuegenButtonComponent {
  @Input() isMobile?: boolean;

  constructor(private router: Router, private rezepteService: RezeptService) {}

  navigateForm(event: MouseEvent) {
    event.preventDefault();

    this.rezepteService.clearCurrentRezept();
    this.router.navigate(['/rezepterstellung']);
  }
}
