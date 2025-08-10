package com.rezepte_app.controller;

import com.rezepte_app.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/openai")
public class OpenAIController {

    @Autowired
    private OpenAiService openAiService;

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody Map<String, String> body) {

        String prompt = body.get("prompt");
        if (prompt == null || prompt.isBlank()) {   // ◀︎ Eingabe validieren
            return ResponseEntity.badRequest().body("prompt darf nicht leer sein");
        }

        String result = openAiService.frageRezeptvorschlag(prompt);
        return ResponseEntity.ok(result);
    }

/*    @GetMapping("/chat")
    public ResponseEntity<String> testGet() {
        return ResponseEntity.ok("Endpoint erreichbar");
    }*/
}
