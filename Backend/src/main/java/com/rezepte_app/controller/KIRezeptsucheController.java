package com.rezepte_app.controller;

import com.rezepte_app.service.OpenAiService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class KIRezeptsucheController {

    private final OpenAiService openAiService;

    public KIRezeptsucheController(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    @PostMapping("/ki-rezeptsuche")
    public Map<String, Object> rezeptSuche(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");

        String gptAntwort = openAiService.frageRezeptvorschlag(prompt);

        Map<String, Object> result = new HashMap<>();
        result.put("rezepte", List.of(gptAntwort)); // später parsen
        return result;
    }
}
