import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface RecipeDetails {
  name: string;
  zutaten?: string[];
  zubereitung?: string;
  kochzeit?: string;
  schwierigkeit?: string;
  portionen?: string;
  isAIGenerated?: boolean;
}

@Component({
  selector: 'app-recipe-modal',
  template: `
    <div class="recipe-modal-overlay" *ngIf="isVisible" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ recipe?.name || 'Rezept' }}</h2>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>
        
        <div class="modal-body" *ngIf="recipe">
          <div class="recipe-info">
            <div class="info-item" *ngIf="recipe.portionen">
              <span class="icon">👥</span>
              <span><strong>Portionen:</strong> {{ recipe.portionen }}</span>
            </div>
            <div class="info-item" *ngIf="recipe.kochzeit">
              <span class="icon">⏱️</span>
              <span><strong>Kochzeit:</strong> {{ recipe.kochzeit }}</span>
            </div>
            <div class="info-item" *ngIf="recipe.schwierigkeit">
              <span class="icon">📊</span>
              <span><strong>Schwierigkeit:</strong> {{ recipe.schwierigkeit }}</span>
            </div>
          </div>

          <div class="recipe-section" *ngIf="recipe.zutaten && recipe.zutaten.length > 0">
            <h3>📝 Zutaten</h3>
            <ul class="ingredients-list">
              <li *ngFor="let zutat of recipe.zutaten">
                • {{ zutat }}
              </li>
            </ul>
          </div>

          <div class="recipe-section" *ngIf="recipe.zubereitung">
            <h3>👨‍🍳 Zubereitung</h3>
            <div class="instructions" [innerHTML]="formatInstructions(recipe.zubereitung)"></div>
          </div>

          <div class="ai-badge" *ngIf="recipe.isAIGenerated">
            <span class="ai-icon">🤖</span>
            <span>KI-generiertes Rezept</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recipe-modal-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background-color: rgba(0, 0, 0, 0.7) !important;
      background: rgba(0, 0, 0, 0.7) !important;
      opacity: 1 !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      z-index: 1000 !important;
      pointer-events: auto !important;
    }

    .modal-content {
      background: white;
      border-radius: 15px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 25px;
      border-bottom: 1px solid #eee;
      background: linear-gradient(135deg, #f6a257 0%, #b34f09 100%);
      color: white;
      border-radius: 15px 15px 0 0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.3s ease;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .modal-body {
      padding: 25px;
    }

    .recipe-info {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 25px;
      padding: 15px;
      background: #f0f9f8;
      border-radius: 10px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .icon {
      font-size: 16px;
    }

    .recipe-section {
      margin-bottom: 25px;
    }

    .recipe-section h3 {
      color: #f6a257;
      margin-bottom: 15px;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .ingredients-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .ingredients-list li {
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
    }

    .ingredients-list li:last-child {
      border-bottom: none;
    }

    .instructions {
      line-height: 1.6;
      font-size: 14px;
      white-space: pre-line;
    }

    .ai-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #f6a257 0%, #b34f09 100%);
      color: white;
      padding: 8px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 15px;
    }

    .ai-icon {
      font-size: 14px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        max-height: 90vh;
      }
      
      .recipe-info {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class RecipeModalComponent {
  @Input() recipe: RecipeDetails | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

  formatInstructions(instructions: string): string {
    return instructions
      .replace(/\n/g, '<br>')
      .replace(/(\d+\.)/g, '<strong>$1</strong>');
  }
} 