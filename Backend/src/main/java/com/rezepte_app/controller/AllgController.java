package com.rezepte_app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AllgController {
    @GetMapping("/data")
    public ResponseEntity<String> getData() {

        String responseData = "Hello from the API!";
        ResponseEntity<String> ok = ResponseEntity.ok(responseData);
        return ok;
    }
}
