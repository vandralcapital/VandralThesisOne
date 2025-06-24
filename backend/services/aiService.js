require('dotenv').config();
const axios = require('axios');

class AIService {
    constructor() {
        this.apiKey = process.env.OPENROUTER_KEY;
        this.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.model = 'google/gemma-3-27b-it:free';
    }

    async generatePresentation(storyline) {
        try {
            const chaptersPrompt = storyline.storyline.map(chapter =>
                `Chapter ${chapter.chapter}: ${chapter.title}\nDescription: ${chapter.description}`
            ).join('\n\n');

            const prompt = `Based on the following storyline, generate a complete presentation.

Presentation Title: "${storyline.title}"
Presentation Subtitle: "${storyline.subtitle}"

Storyline Chapters:
${chaptersPrompt}

For each chapter, create one slide. Each slide must contain:
- A title (it can be the chapter title or a more engaging version of it).
- 2-4 concise bullet points that expand on the chapter's description.
- A visual description for a relevant image (image_prompt).

Output as a single JSON object in this exact format, with no extra text or explanations:
{
  "slides": [
    {
      "title": "Slide 1 Title",
      "bullets": ["Point 1", "Point 2"],
      "image_prompt": "A visual description for slide 1."
    },
    {
      "title": "Slide 2 Title",
      "bullets": ["Point 1", "Point 2"],
      "image_prompt": "A visual description for slide 2."
    }
  ]
}`;

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://slidewise-ai.com',
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 3000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid response format from OpenRouter');
            }

            const content = data.choices[0].message.content;
            
            try {
                const jsonMatch = content.match(/```json\n([\s\S]*?)\n```|(\{[\s\S]*\})/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[1] || jsonMatch[2]);
                }
                return JSON.parse(content);
            } catch (parseError) {
                console.error("Failed to parse presentation JSON:", content);
                throw new Error('Failed to parse AI response as JSON');
            }

        } catch (error) {
            console.error('Error generating presentation:', error);
            throw new Error(`AI generation failed: ${error.message}`);
        }
    }

    async generateStoryline(topic) {
        try {
            const prompt = `Generate a presentation storyline for the topic: "${topic}".
The storyline should be a structured outline of the presentation. It should include:
1. A main title for the presentation.
2. A subtitle or a short introductory phrase.
3. A list of 5-7 chapters, each with:
    - A chapter title.
    - A brief description of the chapter's content (1-2 sentences).

Output as JSON in this exact format, with no extra text or explanations before or after the JSON block:
{
  "title": "Main Presentation Title",
  "subtitle": "Presentation Subtitle",
  "storyline": [
    {
      "chapter": 1,
      "title": "Chapter 1 Title",
      "description": "Description for chapter 1."
    },
    {
      "chapter": 2,
      "title": "Chapter 2 Title",
      "description": "Description for chapter 2."
    }
  ]
}`;

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://slidewise-ai.com',
                    'X-Title': 'SlideWise AI'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 2000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid response format from OpenRouter');
            }

            const content = data.choices[0].message.content;
            
            try {
                const jsonMatch = content.match(/```json\n([\s\S]*?)\n```|(\{[\s\S]*\})/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[1] || jsonMatch[2]);
                }
                return JSON.parse(content);
            } catch (parseError) {
                console.error("Failed to parse storyline JSON:", content);
                throw new Error('Failed to parse AI storyline response as JSON');
            }

        } catch (error) {
            console.error('Error generating storyline:', error);
            throw new Error(`AI storyline generation failed: ${error.message}`);
        }
    }

    async generateSlideContent(topic, slideType = 'content') {
        try {
            let prompt;
            
            switch (slideType) {
                case 'title':
                    prompt = `Create a compelling title slide for a presentation about "${topic}". 
                    Return only the title as a string, no JSON.`;
                    break;
                case 'content':
                    prompt = `Create 3-4 bullet points for a slide about "${topic}". 
                    Return as JSON: {"bullets": ["point 1", "point 2", "point 3"]}`;
                    break;
                case 'image':
                    prompt = `Generate a visual description for an image that would represent "${topic}". 
                    Return as JSON: {"image_prompt": "description"}`;
                    break;
                default:
                    prompt = `Generate content for a slide about "${topic}". 
                    Return as JSON: {"title": "slide title", "bullets": ["point 1", "point 2"], "image_prompt": "description"}`;
            }

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://slidewise-ai.com',
                    'X-Title': 'SlideWise AI'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            
            try {
                return JSON.parse(content);
            } catch (parseError) {
                // For title slides, return the content as is
                if (slideType === 'title') {
                    return { title: content.trim() };
                }
                throw new Error('Failed to parse AI response as JSON');
            }

        } catch (error) {
            console.error('Error generating slide content:', error);
            throw new Error(`AI generation failed: ${error.message}`);
        }
    }

    /**
     * Generate an image from a prompt using OpenRouter (Google Gemma 3 or other model)
     * @param {string} prompt
     * @returns {Promise<string>} image URL
     */
    async generateImage(prompt) {
        try {
            const response = await axios.post(
                'https://openrouter.ai/api/v1/images/generate', // Replace with correct endpoint if needed
                {
                    model: 'google/gemma-3-27b-it:free',
                    prompt,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            // Adjust this according to the actual response structure from OpenRouter
            const imageUrl = response.data.image_url || response.data.url || response.data.result?.url;
            if (!imageUrl) throw new Error('No image URL returned from AI');
            return imageUrl;
        } catch (err) {
            console.error('AI image generation failed:', err.response?.data || err.message);
            throw new Error('Image generation failed');
        }
    }
}

module.exports = new AIService(); 