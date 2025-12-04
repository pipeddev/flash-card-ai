import { Injectable } from '@nestjs/common';
import { Deck } from 'src/flashcards/domain/entities/deck.entity';
import { DeckRepository } from 'src/flashcards/domain/repositories/deck.repository';

@Injectable()
export class DeckInMemoryRepository implements DeckRepository {
  private readonly store = new Map<string, Deck>();

  async save(deck: Deck): Promise<void> {
    this.store.set(deck.id, deck);
    return Promise.resolve();
  }

  async findById(id: string): Promise<Deck | null> {
    return Promise.resolve(this.store.get(id) ?? null);
  }
}
