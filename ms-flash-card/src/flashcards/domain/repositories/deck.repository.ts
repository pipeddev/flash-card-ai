import { Deck } from '../entities/deck.entity';

export interface DeckRepository {
  save(deck: Deck): Promise<void>;
  findById(id: string): Promise<Deck | null>;
}
