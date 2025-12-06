export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export type FlashcardTag =
  | 'concept'
  | 'example'
  | 'use-case'
  | 'warning'
  | 'tip';

export interface FlashcardRaw {
  question: string;
  answer: string;
  difficulty: Difficulty;
  tag: string;
}
