export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export interface Flashcard {
  question: string;
  answer: string;
  difficulty: Difficulty;
  tag: string;
}

export interface Deck {
  id: string;
  topic: string;
  difficulty: Difficulty;
  cards: Flashcard[];
}
