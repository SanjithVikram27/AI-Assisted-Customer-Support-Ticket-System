package com.warrior.helpdesk.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${spring.gemini.api.key}")
    private String apiKey;

    // 🔁 Easy model switch (change only here)
    private static final String MODEL = "gemini-2.5-flash";

    private static final String BASE_URL =
            "https://generativelanguage.googleapis.com/v1/models/";

    private static final String SYSTEM_PROMPT = """
        You are a powerful AI assistant like ChatGPT.

        Behavior rules:
        - If the user greets, greet back naturally.
        - If the user asks a question, answer it clearly and completely.
        - If the user asks about programming, explain with examples.
        - If the user describes a problem, respond empathetically.
        - NEVER reply with “Tell me what’s wrong” unless the input is empty.
        - Do NOT behave like a form or scripted bot.
        """;

    public String generateResponse(String userMessage) {

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(
                                        Map.of("text", SYSTEM_PROMPT),
                                        Map.of("text", userMessage)
                                )
                        )
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        try {
            String url = BASE_URL + MODEL + ":generateContent?key=" + apiKey;

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, request, Map.class);

            Map res = response.getBody();
            if (res == null) {
                return "⚠️ AI did not return a response.";
            }

            List candidates = (List) res.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                return "⚠️ AI could not generate an answer.";
            }

            Map content = (Map) ((Map) candidates.get(0)).get("content");
            List parts = (List) content.get("parts");

            Map firstPart = (Map) parts.get(0);
            return firstPart.get("text").toString();

        }
        // 🔴 EXPLICIT RATE LIMIT HANDLING
        catch (HttpClientErrorException.TooManyRequests e) {
            System.err.println("🚫 Gemini Rate Limit Exceeded (429)");
            return """
            🤖 AI is temporarily unavailable due to usage limits.

            Your request is important — please try again later.
            Meanwhile, your issue can still be logged as a support ticket.
            """;
        }
        // 🔴 OTHER CLIENT ERRORS (401, 403, etc.)
        catch (HttpClientErrorException e) {
            System.err.println("❌ Gemini API Error: " + e.getStatusCode());
            System.err.println(e.getResponseBodyAsString());

            return """
            ⚠️ AI service error occurred.

            Please try again later or contact support.
            """;
        }
        // 🔴 NETWORK / UNKNOWN ERRORS
        catch (Exception e) {
            e.printStackTrace();
            return """
            ⚠️ Temporary technical issue connecting to AI service.
            Please try again shortly.
            """;
        }
    }
}
