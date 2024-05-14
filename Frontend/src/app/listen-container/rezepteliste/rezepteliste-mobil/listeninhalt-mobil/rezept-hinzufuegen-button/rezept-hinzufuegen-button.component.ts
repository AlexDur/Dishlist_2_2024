import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-rezept-hinzufuegen-button',
  templateUrl: './rezept-hinzufuegen-button.component.html',
  styleUrls: ['./rezept-hinzufuegen-button.component.scss']
})
export class RezeptHinzufuegenButtonComponent {

  constructor(private router: Router) {}

  navigateForm(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/rezepterstellung']);
  }
}
