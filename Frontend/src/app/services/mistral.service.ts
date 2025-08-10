/*
// src/app/services/mistral.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MistralService {
  private apiUrl = 'https://api.mistral.ai/v1';

  constructor(private http: HttpClient) {}

  async query(prompt: string, model = 'mistral-tiny') {
    const headers = {
      'Authorization': `Bearer YOUR_API_KEY`,
      'Content-Type': 'application/json'
    };

    const body = {
      model,
      messages: [{role: "user", content: prompt}]
    };

    return this.http.post(`${this.apiUrl}/chat/completions`, body, { headers });
  }
}
*/
