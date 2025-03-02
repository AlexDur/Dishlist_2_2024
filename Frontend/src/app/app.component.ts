import {Component, HostListener, OnInit} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {AuthService} from "./services/auth.service";
import { filter } from 'rxjs/operators';
import {NavigationService} from "./services/navigation.service";
import {UserInterfaceService} from "./services/userInterface.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  title = 'fullStack_rezepteApp';
  isMobile: boolean = false;
  isAuthenticated: boolean = false;
  selectedTags: string[]=[];

  constructor(private authService: AuthService, private router: Router, private uiService: UserInterfaceService, private navigationService: NavigationService) {
    this.checkScreenSize();
    const isFirstLaunch = localStorage.getItem('isFirstLaunch');
    if (!isFirstLaunch) {
      console.log('Erster Start');
      localStorage.setItem('isFirstLaunch', 'false');
    }
  }

  ngOnInit() {

    this.uiService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe();

    this.authService.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
      console.log('Auth-Status:', status);
      this.redirectToLastVisitedRoute();
    });


  }

  private redirectToLastVisitedRoute() {
    const lastVisitedRoute = localStorage.getItem('lastVisitedRoute');
    if (this.isAuthenticated && lastVisitedRoute) {
      this.router.navigateByUrl(lastVisitedRoute);
    } else {
      this.router.navigate(['/landing']);
    }
  }

  /*@HostListener für Reaktion auf native Ereignisse wie Klicks etc. und eben Größenänderungen des Fensters.*/
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  onSelectedTagsChange(newSelectedTags: string[]): void {
    this.selectedTags = newSelectedTags;
    console.log('Erhaltene selectedTags von der Kindkomponente:', this.selectedTags);
  }
}

