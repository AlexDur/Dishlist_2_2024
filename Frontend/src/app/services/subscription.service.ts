import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface TrialStatusResponse {
  startDate: string;
  trialExpired: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor() { }

  getTrialStatus(userId: string): Observable<TrialStatusResponse | null> {
    // Mock implementation - replace with actual API call
    return of({
      startDate: new Date().toISOString(),
      trialExpired: false
    });
  }

  startTrial(userId: string): Observable<any> {
    // Mock implementation - replace with actual API call
    return of({ success: true });
  }

  subscribeViaPlayStore(): void {
    // Mock implementation - replace with actual Play Store integration
    console.log('Redirecting to Play Store for subscription...');
  }
} 