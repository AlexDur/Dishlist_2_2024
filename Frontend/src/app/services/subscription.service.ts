import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {environment} from "../../environments/environment";
import { TrialStatusResponse} from "../models/trial-status";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private backendUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


//  Server nach Trial-Status fragen und Antwort in TrialStatusResponse parsen
  getTrialStatus(userId: string): Observable<TrialStatusResponse | null> {
    return this.http.get<TrialStatusResponse | null>(`${this.backendUrl}/api/trialStatus?userId=${userId}`).pipe(
      catchError(error => {
        console.error('Fehler beim Abrufen des Trial-Status:', error);
        return of(null);
      })
    );
  }

  startTrial(userId: string): Observable<{ startDate: string }> {
    return this.http.post<{ startDate: string }>(
      `${this.backendUrl}/api/startTrial`,
      { userId }
    );
  }

}
