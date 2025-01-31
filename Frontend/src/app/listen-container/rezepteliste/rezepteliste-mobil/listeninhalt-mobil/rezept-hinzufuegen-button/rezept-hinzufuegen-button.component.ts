import { Component, Input, Output, EventEmitter  } from '@angular/core';
import {Router} from "@angular/router";
import {RezeptService} from "../../../../../services/rezepte.service";

@Component({
  selector: 'app-rezept-hinzufuegen-button',
  templateUrl: './rezept-hinzufuegen-button.component.html'
})
export class RezeptHinzufuegenButtonComponent {
  @Input() isMobile?: boolean;
  @Input() activeTab!: number;
  @Output() tabChange = new EventEmitter<number>();

  constructor(private router: Router, private rezepteService: RezeptService) {}

  navigateForm(event: MouseEvent) {
    event.preventDefault();
    this.tabChange.emit(1);  
    this.rezepteService.clearCurrentRezept();
    this.router.navigate(['/rezepterstellung']);
  }
}
