import { Component, ViewChild, OnInit, OnDestroy, ElementRef  } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import {filter, take, catchError } from 'rxjs/operators';
import { UserInterfaceService } from '../../services/userInterface.service';
import {Rezept} from "../../models/rezepte";
import { Subscription, of } from 'rxjs';
import { OpenAiService } from '../../services/openai.service';
import { RezeptService } from '../../services/rezepte.service';
import { TagService } from '../../services/tags.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-tableiste',
  templateUrl: './tableiste.component.html',
})
export class TableisteComponent implements OnInit, OnDestroy {
  @ViewChild('dropdownContent', { static: false }) dropdownContent!: ElementRef;
  private activeTabSubscription!: Subscription;

  activeTab: number = 2;
  rezepte: Rezept[] = [];
  
  // Overlay state properties
  isOverlayVisible = false;
  isAIOverlayVisible = false;
  selectedTags: string[] = [];
  isLoading = false;
  rezeptWunsch: string = '';
  isClicked = false;
  chatLog: { role: 'user' | 'ai', content: string }[] = [];
  isSavingRecipe = false;


  constructor(
    private router: Router, 
    private authService: AuthService, 
    private tabService: UserInterfaceService,
    private openAi: OpenAiService,
    private rezeptService: RezeptService,
    private tagService: TagService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.activeTabSubscription = this.tabService.activeTab$.subscribe(tab => {
      this.activeTab = tab;
    });
    
    // Subscribe to selected tags
    this.tagService.selectedTags$.subscribe(tags => {
      this.selectedTags = tags;
    });
  }

  ngOnDestroy(): void {
    if (this.activeTabSubscription) {
      this.activeTabSubscription.unsubscribe();
    }
  }

  navigateListe(event: Event): void {
    event.preventDefault();
    this.tabService.setActiveTab(2);
    this.router.navigate(['/listen-container']);
  }


  // Overlay methods
  toggleOverlay(event: Event) {
    console.log('toggleOverlay method called');
    event.stopPropagation();
    this.isOverlayVisible = !this.isOverlayVisible;
    console.log('Random overlay toggled, isOverlayVisible:', this.isOverlayVisible);

    if (this.isOverlayVisible) {
      this.loadSpoonRezepte();
    }
  }

  toggleOverlayAI(event: Event) {
    console.log('toggleOverlayAI method called');
    event.stopPropagation();
    this.isAIOverlayVisible = !this.isAIOverlayVisible;
    console.log('AI overlay toggled, isAIOverlayVisible:', this.isAIOverlayVisible);
  }

  loadSpoonRezepte(): void {
    this.isLoading = true;
    this.isClicked = false;
    this.rezeptService.fetchSpoonRezepte(this.selectedTags).subscribe({
      next: (rezepte) => {
        this.rezepte = rezepte;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Fehler beim Abrufen der Rezepte:', err);
        this.isLoading = false;
      }
    });
  }

  closeOverlayButton(event: MouseEvent): void {
    event.stopPropagation();
    this.isAIOverlayVisible = false;
    this.isOverlayVisible = false;
  }

  closeOverlay(event: Event): void {
    event.stopPropagation();
    this.isOverlayVisible = false;
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  sucheRezeptNachWunsch(): void {
    const frage = this.rezeptWunsch.trim();
    if (!frage) {
      this.notificationService.showError('Bitte gib einen Rezeptwunsch ein.');
      return;
    }

    // Benutzerfrage als Karte anzeigen
    this.chatLog.push({role: 'user', content: frage});
    this.rezeptWunsch = '';
    this.isLoading = true;

    this.openAi.frageRezept(frage).subscribe({
      next: (rezept: any) => {
        /* KI‑Antwort formatieren und anzeigen */
        const formattedContent = this.formatRecipeResponse(rezept);
        this.chatLog.push({
          role: 'ai',
          content: formattedContent
        });
        this.isLoading = false;
      },
      error: err => {
        this.chatLog.push({
          role: 'ai',
          content: 'Fehler bei der Abfrage der KI: ' + err.message
        });
        this.isLoading = false;
      }
    });
  }

  addRecipe(rezept: Rezept): void {
    if (this.isClicked) return; // Falls der Button schon einmal geklickt wurde, nichts tun

    this.isLoading = true;
    this.isClicked = true;

    this.rezeptService.addRezeptToList(rezept).pipe(
      catchError((error: any) => {
        this.isLoading = false;
        this.isClicked = false;
        console.error('Fehler beim Speichern des Rezepts:', error);
        return of(null);
      })
    ).subscribe(() => {
      this.isLoading = false;
    });
  }

  openUrlSpoon(url: string, type: 'image' | 'recipe'): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  private formatRecipeResponse(rezept: any): string {
    let formatted = '';
    
    if (rezept.name) {
      formatted += `🍽️ **${rezept.name}**\n\n`;
    }
    
    if (rezept.portionen) {
      formatted += `👥 **Portionen:** ${rezept.portionen}\n`;
    }
    
    if (rezept.kochzeit) {
      // Check if the value already contains "Minuten" or similar
      const kochzeit = rezept.kochzeit.toString();
      const hasTimeUnit = kochzeit.includes('Minuten') || kochzeit.includes('min') || kochzeit.includes('Stunden');
      formatted += `⏱️ **Kochzeit:** ${kochzeit}${hasTimeUnit ? '' : ' Minuten'}\n`;
    }
    
    if (rezept.schwierigkeit) {
      formatted += `📊 **Schwierigkeit:** ${rezept.schwierigkeit}\n`;
    }
    
    if (rezept.zutaten && Array.isArray(rezept.zutaten)) {
      formatted += `\n📝 **Zutaten:**\n`;
      rezept.zutaten.forEach((zutat: string, index: number) => {
        formatted += `${index + 1}. ${zutat}\n`;
      });
    }
    
    if (rezept.zubereitung) {
      formatted += `\n👨‍🍳 **Zubereitung:**\n${rezept.zubereitung}\n`;
    }
    
    return formatted;
  }

  saveGeneratedRecipe(content: string): void {
    this.isSavingRecipe = true;
    
    try {
      // Parse the recipe from the formatted content
      const recipeData = this.parseRecipeFromContent(content);
      
      if (recipeData) {
        // Create a recipe object with ChatGPT logo as image
        const recipe: Rezept = {
          name: recipeData.name,
          onlineAdresse: '', // No external link for generated recipes
          bildUrl: 'https://img.icons8.com/color/96/000000/chatgpt.png', // ChatGPT logo
          tags: [
            { id: 1, type: 'KI-Generiert', label: 'KI-Generiert', selected: false, count: 1 }
          ]
        };
        
        // Store the full recipe details in localStorage for later retrieval
        const fullRecipeDetails = {
          ...recipeData,
          isAIGenerated: true,
          savedAt: new Date().toISOString()
        };
        
        // Save to localStorage with recipe name as key
        localStorage.setItem(`ai_recipe_${recipeData.name}`, JSON.stringify(fullRecipeDetails));
        
        // Save the recipe
        this.rezeptService.addRezeptToList(recipe).subscribe({
          next: () => {
            console.log('KI-generiertes Rezept gespeichert:', recipe.name);
            this.isSavingRecipe = false;
            // Show success message
            this.showSuccessMessage('Rezept erfolgreich gespeichert!');
          },
          error: (error) => {
            console.error('Fehler beim Speichern des KI-Rezepts:', error);
            this.isSavingRecipe = false;
            this.showErrorMessage('Fehler beim Speichern des Rezepts');
          }
        });
      } else {
        this.isSavingRecipe = false;
        this.showErrorMessage('Rezept konnte nicht geparst werden');
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Rezepts:', error);
      this.isSavingRecipe = false;
      this.showErrorMessage('Fehler beim Speichern des Rezepts');
    }
  }

  private parseRecipeFromContent(content: string): any {
    try {
      // Extract recipe name from the formatted content
      const nameMatch = content.match(/\*\*(.*?)\*\*/);
      if (!nameMatch) return null;
      
      const name = nameMatch[1].replace('🍽️ ', '').trim();
      
      // Extract other recipe details
      const portionenMatch = content.match(/👥 \*\*Portionen:\*\* (.*?)\n/);
      const kochzeitMatch = content.match(/⏱️ \*\*Kochzeit:\*\* (.*?)\n/);
      const schwierigkeitMatch = content.match(/📊 \*\*Schwierigkeit:\*\* (.*?)\n/);
      
      // Extract ingredients
      const zutatenMatch = content.match(/📝 \*\*Zutaten:\*\*([\s\S]*?)(?=👨‍🍳 \*\*Zubereitung:\*\*|$)/);
      let zutaten: string[] = [];
      if (zutatenMatch) {
        zutaten = zutatenMatch[1]
          .split('\n')
          .filter(line => line.trim().match(/^\d+\./))
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(line => line.length > 0);
      }
      
      // Extract instructions
      const zubereitungMatch = content.match(/👨‍🍳 \*\*Zubereitung:\*\*([\s\S]*?)(?=🤖|$)/);
      let zubereitung = '';
      if (zubereitungMatch) {
        zubereitung = zubereitungMatch[1].trim();
      }
      
      return {
        name,
        portionen: portionenMatch ? portionenMatch[1].trim() : undefined,
        kochzeit: kochzeitMatch ? kochzeitMatch[1].trim() : undefined,
        schwierigkeit: schwierigkeitMatch ? schwierigkeitMatch[1].trim() : undefined,
        zutaten: zutaten.length > 0 ? zutaten : undefined,
        zubereitung: zubereitung || undefined
      };
    } catch (error) {
      console.error('Fehler beim Parsen des Rezepts:', error);
      return null;
    }
  }

  private showSuccessMessage(message: string): void {
    this.notificationService.showSuccess(message);
  }

  private showErrorMessage(message: string): void {
    this.notificationService.showError(message);
  }

  formatContent(content: string): string {
    // Convert markdown-style formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\n/g, '<br>') // Line breaks
      .replace(/🍽️/g, '<span style="font-size: 1.2em;">🍽️</span>')
      .replace(/👥/g, '<span style="font-size: 1.2em;">👥</span>')
      .replace(/⏱️/g, '<span style="font-size: 1.2em;">⏱️</span>')
      .replace(/📊/g, '<span style="font-size: 1.2em;">📊</span>')
      .replace(/📝/g, '<span style="font-size: 1.2em;">📝</span>')
      .replace(/👨‍🍳/g, '<span style="font-size: 1.2em;">👨‍🍳</span>');
  }

  logoutUser(event: Event)  {
    console.log('Logout angestoßen in Komponente')
    event.preventDefault();
    this.tabService.setActiveTab(-1);
    this.authService.logout().subscribe({
      next: () => {
        this.authService.setIsAuthenticated(false);
        this.authService.isAuthenticated$.pipe(
          filter((isAuthenticated: any) => !isAuthenticated), // Warten, bis false ist
          take(1)
        ).subscribe(() => {
          this.router.navigate(['/anmeldung']);
        });
      },
      error: (err) => {
        console.error('Fehler beim Logout', err);
      }
    });
  }

}
