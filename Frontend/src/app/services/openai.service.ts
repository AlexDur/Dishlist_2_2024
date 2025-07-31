import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Rezept } from '../models/rezepte';
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class OpenAiService {

  /** Backend‑URL zur Weiterleitung der Anfrage an OpenAI */
  private readonly backendUrl = environment.openAiProxy;

  constructor(private readonly http: HttpClient) {}


  /** OpenAI‑Call, angepasst auf gpt‑4o‑mini mit erzwungenem JSON‑Output */
  frageRezept(prompt: string): Observable<Rezept> {

    const body = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Du bist ein Rezeptassistent. Es soll NUR JSON ausgegeben werden: ' +
            '{"name":"...","zutaten":["..."],"zubereitung":"...","bildUrl":"","onlineAdresse":""}'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,

      /* gpt‑4o unterstützt response_format; JSON wird damit garantiert erzwungen */
      response_format: { type: 'json_object' }
    };

    /* Backend wird per POST angesprochen; Rückgabe erfolgt als String und anschließend geparst */
    return this.http.post<string>(this.backendUrl, body, { responseType: 'text' as 'json' })
      .pipe(
        map((raw: string) => JSON.parse(raw) as Rezept)
      );
  }

}
