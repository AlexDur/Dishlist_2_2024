import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, Event } from '@angular/router';
import { AuthService } from "./services/auth.service";
import { filter } from 'rxjs/operators';
import { NavigationService } from "./services/navigation.service";
import { UserInterfaceService } from "./services/userInterface.service";
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'fullStack_rezepteApp';
  isMobile: boolean = false;
  isAuthenticated: boolean = false;
  selectedTags: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private uiService: UserInterfaceService,
    private navigationService: NavigationService
  ) {
    this.checkScreenSize();
    const isFirstLaunch = localStorage.getItem('isFirstLaunch');
    if (!isFirstLaunch) {
      console.log('Erster Start');
      localStorage.setItem('isFirstLaunch', 'false');
    }
  }

  ngOnInit() {

    // Statusleiste transparent und über WebView
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: 'transparent' });
    StatusBar.setStyle({ style: Style.Light }); // oder Style.Dark, je nach Layout

    this.uiService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    // Debugging: Überprüfe, welche Route aufgerufen wird
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log('NavigationStart:', event.url);
      }
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd:', event.url);
      }
      if (event instanceof NavigationError) {
        console.error('NavigationError:', event.error);
      }
    });


    // Überprüfe, ob der Auth-Status einen Redirect auslöst
    this.authService.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
      console.log('Auth-Status:', status);
      this.redirectToLastVisitedRoute();
    });



  }

  private redirectToLastVisitedRoute() {
    const lastVisitedRoute = localStorage.getItem('lastVisitedRoute');
    console.log('Letzte besuchte Route:', lastVisitedRoute);

    if (this.isAuthenticated && lastVisitedRoute) {
      // Prüfen, ob die Route gültig ist
      if (this.router.config.some(route => '/' + route.path === lastVisitedRoute)) {
        console.log('Weiterleitung zur letzten gültigen Route:', lastVisitedRoute);
        this.router.navigateByUrl(lastVisitedRoute);
      } else {
        console.warn('Ungültige Route gespeichert, keine Weiterleitung.');
      }
    } else {
      console.log('Keine gespeicherte Route oder nicht authentifiziert.');
    }
  }


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
