import { Component, Input, OnInit, EventEmitter  } from '@angular/core';
import {Router} from "@angular/router";
import {RezeptService} from "../../../../../services/rezepte.service";
import {TabService} from "../../../../../services/tab.service";

@Component({
  selector: 'app-rezept-hinzufuegen-button',
  templateUrl: './rezept-hinzufuegen-button.component.html'
})
export class RezeptHinzufuegenButtonComponent implements OnInit{
  @Input() isMobile?: boolean;
  activeTab!: number;

  constructor(private router: Router, private rezepteService: RezeptService, private tabService: TabService) {}

  ngOnInit() {
    this.tabService.activeTab$.subscribe((tab) => {
      this.activeTab = tab;
    });
  }

  navigateForm(event: MouseEvent) {
    event.preventDefault();
    this.tabService.setActiveTab(1);
    this.rezepteService.clearCurrentRezept();
    this.router.navigate(['/rezepterstellung']);

  }

}
