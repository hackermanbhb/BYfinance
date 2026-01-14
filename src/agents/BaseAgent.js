import { generateContent } from '../services/llm';

class BaseAgent {
    constructor(name, role, apiKey) {
        this.name = name;
        this.role = role;
        this.apiKey = apiKey;
    }

    async analyze(context) {
        if (!this.apiKey) {
            return this.mockResponse();
        }

        const prompt = this.buildPrompt(context);
        try {
            const response = await generateContent(prompt, this.apiKey);
            return this.parseResponse(response);
        } catch (error) {
            console.error(`${this.name} failed:`, error);
            return this.mockResponse();
        }
    }

    buildPrompt(context) {
        throw new Error("buildPrompt must be implemented by subclass");
    }

    parseResponse(response) {
        // Default: try to parse JSON, fall back to string
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return { message: response };
        } catch (e) {
            return { message: response };
        }
    }

    mockResponse() {
        return { message: `[${this.name}] Mock Analysis: No API Key provided.` };
    }
}

export default BaseAgent;
