import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import type { ChatCompletion } from 'openai/resources/chat/completions';
import { Flashcard } from '../../domain/entities/flashcard.entity';
import { Environment } from 'src/shared/config/environment';

type Difficulty = 'basic' | 'intermediate' | 'advanced';

interface FlashcardRaw {
  question: string;
  answer: string;
  difficulty: Difficulty;
  tag: string;
}

@Injectable()
export class OpenAiFlashcardsService {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: Environment.OPENAI_API_KEY,
    });
  }

  async generateFlashcards(
    topic: string,
    difficulty: Difficulty,
  ): Promise<Flashcard[]> {
    const prompt = `
Genera entre 5 y 8 flashcards de estudio sobre el tema: "${topic}".

Dificultad: ${difficulty}.

Formato JSON:
[
  {
    "question": "....",
    "answer": "....",
    "difficulty": "basic|intermediate|advanced",
    "tag": "concept|example|use-case|warning|tip"
  }
]
No incluyas texto fuera del JSON.
    `;

    const completion = (await this.client.chat.completions.create({
      model: Environment.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })) as ChatCompletion;

    const content = completion.choices[0]?.message?.content ?? '[]';

    return this.parseFlashcards(content);
  }

  private parseFlashcards(content: unknown): Flashcard[] {
    if (typeof content !== 'string') return [];

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
