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
            'Du bist ein professioneller Rezeptassistent. Erstelle detaillierte, gut strukturierte Rezepte im folgenden JSON-Format:\n\n' +
            '{\n' +
            '  "name": "Rezeptname",\n' +
            '  "zutaten": [\n' +
            '    "Menge + Zutat (z.B. 500g Kartoffeln)",\n' +
            '    "Menge + Zutat (z.B. 2 EL Öl)",\n' +
            '    "..."\n' +
            '  ],\n' +
            '  "zubereitung": "Detaillierte Schritt-für-Schritt Anweisungen mit Zeiten und Temperaturen. Verwende Absätze für bessere Lesbarkeit.",\n' +
            '  "kochzeit": "Geschätzte Kochzeit in Minuten",\n' +
            '  "schwierigkeit": "Einfach/Mittel/Schwer",\n' +
            '  "portionen": "Anzahl der Portionen",\n' +
            '  "bildUrl": "",\n' +
            '  "onlineAdresse": ""\n' +
            '}\n\n' +
            'Wichtige Regeln:\n' +
            '- Verwende präzise Mengenangaben (Gramm, Milliliter, Esslöffel, etc.)\n' +
            '- Strukturiere die Zubereitung in logische Schritte\n' +
            '- Gib realistische Kochzeiten an\n' +
            '- Verwende deutsche Zutatennamen\n' +
            '- Mache die Anweisungen für Anfänger verständlich'
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
