// NOTE - Old API has been changed and might not work
// Keep the base URL clean, // The endpoint explicitly mandates the model and the action (:generateContent)
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export const generateGeminiResponse = async (prompt) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        // 1. Safety check for the API key
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is undefined. Make sure dotenv.config() is called at the entry point of your server (e.g., index.js or server.js).");
        }

        // 2. Build the URL dynamically per request
        const dynamicUrl = `${GEMINI_BASE_URL}?key=${apiKey}`;

        // 3. Send the HTTP POST request to the Google Gemini API
        const response = await fetch(dynamicUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ],
                // Hinting the model to output strict JSON data
                generationConfig: {
                    responseMimeType: "application/json"
                    // Optional: If you continue to see errors, you may need to define 
                    // a 'responseSchema' object here matching your expected notes format.
                }
            })
        });

        // 4. Catch detailed Google errors before throwing
        if (!response.ok) {
            const errDetails = await response.json().catch(() => ({}));
            console.error("Detailed Gemini API Error Body:", JSON.stringify(errDetails, null, 2));
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // 5. Extract the raw text using optional chaining to prevent crashes on blocked/empty prompts
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            throw new Error("No text content returned from Gemini. The response might have been blocked by safety filters.");
        }

        // 6. Security Sanitization: Strip out markdown block wrappers (```json ... ```) 
        // in case the model bypasses the responseMimeType configuration instruction.
        const cleanText = rawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // 7. Parse the cleaned string back into a valid structured JavaScript object
        return JSON.parse(cleanText);

    } catch (error) {
        console.error("Error generating response:", error);
        throw error;
    }
};
/*
NOTE - Constructing raw HTTP requests works, but handling complex multi-turn chats or multi-modal inputs 
manually gets messy quickly. Google provides an official package (@google/genai) that handles the URL generation and data structures cleanly.
first npm install @google/genai

import { GoogleGenAI } from '@google/genai';

// Automatically picks up process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({}); 

export const generateGeminiResponse = async (prompt) => {
    try {
        // Switch to the modern Interactions API engine
        const interaction = await ai.interactions.create({
            model: 'gemini-2.5-flash',
            input: prompt, // Uses 'input' instead of 'contents'
            // Force the model to return strict JSON structurally
            generation_config: {
                response_mime_type: "application/json"
            }
        });
        
        const rawText = interaction.output_text;

        // Clean up markdown block wrappers securely
        const cleanText = rawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // Parse and return the structured JSON object
        return JSON.parse(cleanText);

    } catch (error) {
        console.error("Gemini SDK Error:", error);
        throw error;
    }
};
*/