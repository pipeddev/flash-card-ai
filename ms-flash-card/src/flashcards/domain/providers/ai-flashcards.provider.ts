import { Difficulty } from '../types/flashcard.types';
import { Flashcard } from '../entities/flashcard.entity';

export interface AIFlashcardsProvider {
  generateFlashcards(
    topic: string,
    difficulty: Difficulty,
  ): Promise<Flashcard[]>;
}
