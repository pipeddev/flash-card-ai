import { Flashcard } from './flashcard.entity';

export class Deck {
  constructor(
    public readonly id: string,
    public readonly topic: string,
    public readonly difficulty: 'basic' | 'intermediate' | 'advanced',
    public readonly cards: Flashcard[],
  ) {}
}
