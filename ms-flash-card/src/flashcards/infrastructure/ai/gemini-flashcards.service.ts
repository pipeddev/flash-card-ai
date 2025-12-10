import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { AIFlashcardsProvider } from 'src/flashcards/domain/providers/ai-flashcards.provider';
import { Environment } from 'src/shared/config/environment';
import {
  Difficulty,
  FlashcardRaw,
} from 'src/flashcards/domain/types/flashcard.types';
import { Flashcard } from 'src/flashcards/domain/entities/flashcard.entity';

@Injectable()
export class GeminiFlashcardsService implements AIFlashcardsProvider {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: Environment.GEMINI_API_KEY });
  }

  async generateFlashcards(
    topic: string,
    difficulty: Difficulty,
  ): Promise<Flashcard[]> {
    const prompt = `
Genera entre 5 y 8 flashcards de estudio sobre el tema: "${topic}".

Dificultad: ${difficulty}.

RESPONDE ESTRICTAMENTE EN JSON VÁLIDO.

Formato EXACTO:
[
  {
    "question": "....",
    "answer": "....",
    "difficulty": "basic|intermediate|advanced",
    "tag": "concept|example|use-case|warning|tip"
  }
]

No escribas nada de texto adicional, ni comentarios, ni markdown, ni bloques de código. SOLO el JSON.
    `;

    const response = await this.client.models.generateContent({
      model: Environment.GEMINI_MODEL,
      contents: prompt,
    });
    const text = response.text ?? '[]';

    return this.parseFlashcards(text);
  }

  private parseFlashcards(content: string): Flashcard[] {
    try {
      const data = JSON.parse(content) as FlashcardRaw[];
      if (!Array.isArray(data)) return [];
      return data.map(
        (item) =>
          new Flashcard(item.question, item.answer, item.difficulty, item.tag),
      );
    } catch {
      return [];
    }
  }
}
