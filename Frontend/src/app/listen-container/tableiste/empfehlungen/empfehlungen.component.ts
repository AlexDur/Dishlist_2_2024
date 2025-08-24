import { Component,Input, HostListener, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import {RezeptService} from "../../../services/rezepte.service";
import {Rezept} from "../../../models/rezepte";
import {Router} from "@angular/router";
import { Subscription, of, finalize, Observable, timeout } from 'rxjs';
import {TagService} from "../../../services/tags.service";
import { catchError } from 'rxjs/operators';
import {OpenAiService} from "../../../services/openai.service";
import { NotificationService } from '../../../services/notification.service';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

@Component({
  selector: 'app-empfehlungen',
  templateUrl: './empfehlungen.component.html',
  styles: [`
    .save-recipe-section {
      margin-top: 15px;
      text-align: center;
    }
    
    .save-recipe-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .save-recipe-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    
    .save-recipe-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .chatgpt-logo {
      font-size: 18px;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    .chat-card.chat-ai {
      border-left: 4px solid #667eea;
      background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
    }
  `]
})
export class EmpfehlungenComponent implements OnInit, OnDestroy {
  @Input() rezepte: Rezept[] = [];

  private tagsSubscription: Subscription | undefined;
  private subscription: Subscription | undefined;

  gefilterteRezepte$: Observable<Rezept[]>;
  isOverlayVisible = false;
  isLoading = false;
  errorMessage: string | null = null;
  selectedTags: string[] = [];
  isClicked = false;
  rezeptWunsch: string = '';
  isAIInputVisible = false;
  hasAIInputBeenVisible = false;
  isAIOverlayVisible: boolean = false;
  isWishButtonActive = false;
  chatLog: { role: 'user' | 'ai', content: string }[] = [];
  isSavingRecipe: boolean = false;

  constructor(
    private readonly openAi: OpenAiService, 
    private rezeptService: RezeptService, 
    private tagService: TagService, 
    private router: Router, 
    private cdRef: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {
    this.gefilterteRezepte$ = this.rezeptService.gefilterteRezepte$;
  }

  ngOnInit(): void {
    this.tagsSubscription = this.tagService.selectedTags$.subscribe(tags => {
      this.selectedTags = tags;
    });
    this.gefilterteRezepte$ = this.rezeptService.gefilterteRezepte$;

  }

  get hasFilter(): boolean {
    return this.selectedTags.length > 0;
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  closeOverlay(event: Event): void {
    const content = document.querySelector('.overlay-content');
    if (content && !content.contains(event.target as Node)) {
      this.isOverlayVisible = false;
    }
  }


  // Verhindert das Schließen des Overlays, wenn innerhalb des Overlays geklickt wird
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }


  closeOverlayButton(event: MouseEvent): void {
    event.stopPropagation();


    this.isAIOverlayVisible = false;
    this.isOverlayVisible = false;
    this.isAIInputVisible = false;


    this.cdRef.detectChanges();

    // Navigate after a short delay
    setTimeout(() => {
      this.router.navigate(['/listen-container']);
    }, 10);
  }


  // Öffnet oder schließt das Overlay
  toggleOverlay(event: Event) {
    event.stopPropagation();
    this.isOverlayVisible = !this.isOverlayVisible;

    if (this.isOverlayVisible) {
      this.loadSpoonRezepte();
    }
  }


  toggleOverlayAI(event: Event) {
    event.stopPropagation();
    this.isAIOverlayVisible = !this.isAIOverlayVisible;
    this.hasAIInputBeenVisible = true;
    this.rezeptWunsch = '';
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




  starteSuche() {
    if (this.rezeptWunsch.trim() !== '') {
      this.isLoading = true;
      console.log('Nutzer sucht nach:', this.rezeptWunsch);
      this.isAIInputVisible = false;
    }
  }


  loadSpoonRezepte(): void {
    this.isLoading = true;
    this.isClicked = false;
    this.errorMessage = null; // Setze die Fehlermeldung zurück

    const TIMEOUT_DURATION = 5000;


    this.rezeptService.fetchSpoonRezepte(this.selectedTags).pipe(
      timeout(TIMEOUT_DURATION),
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          console.error('Die Anfrage hat das Zeitlimit überschritten.');
          this.errorMessage = 'Die Anfrage hat das Zeitlimit überschritten. Bitte versuche es später noch einmal.';
        } else {
          console.error('Fehler beim Abrufen der Rezepte:', error);
          this.errorMessage = 'Ein Fehler ist beim Abrufen der Rezepte aufgetreten. Bitte versuche es später noch einmal.';
        }
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
       /* this.cdRef.detectChanges();*/
      })
    ).subscribe((rezepte) => {
      console.log('Empfangene Rezepte:', rezepte);
      this.rezepte = rezepte.map((rezept) => ({
        ...rezept,
        tags: rezept.tags ?? []
      }));

    });
  }

  openUrlSpoon(url: string, type: 'image' | 'recipe'): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.error('Ungültige URL: ', url, 'Type:', type);
    }
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



  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.tagsSubscription) {
      this.tagsSubscription.unsubscribe();
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
}
