import { Component, Input, OnInit, EventEmitter  } from '@angular/core';
import {Router} from "@angular/router";
import {RezeptService} from "../../../../../services/rezepte.service";
import {TabService} from "../../../../../services/tab.service";
import { Observable, take} from "rxjs";

@Component({
  selector: 'app-rezept-hinzufuegen-button',
  templateUrl: './rezept-hinzufuegen-button.component.html'
})
export class RezeptHinzufuegenButtonComponent implements OnInit{
  @Input() isMobile?: boolean;
  activeTab!: number;
  isBildSelected$: Observable<boolean>;
  image?: null;


  constructor(private router: Router, private rezepteService: RezeptService, private tabService: TabService) {
    this.isBildSelected$ = this.rezepteService.isBildSelected$
  }

  ngOnInit() {
    this.tabService.activeTab$.subscribe((tab) => {
      this.activeTab = tab;
    });
  }

  navigateForm(event: MouseEvent) {
    event.preventDefault();
    this.tabService.setActiveTab(1);
    this.rezepteService.clearCurrentRezept();
    this.rezepteService.setIsBildSelected(false);
    this.rezepteService.setImageSelected(false);
    this.image = null;
    this.isBildSelected$.pipe(take(1)).subscribe(value => { // Abonniere das Observable
      console.log('isBildSelected nach + Dish - Klick in Tab ', value); // Gib den booleschen Wert aus
    });

    this.router.navigate(['/rezepterstellung']);

  }

}
