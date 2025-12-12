import { Deck } from 'src/flashcards/domain/entities/deck.entity';
import { DeckInMemoryRepository } from 'src/flashcards/infrastructure/persistence/deck-inmemory.repository';

describe('DeckInMemoryRepository', () => {
  let repository: DeckInMemoryRepository;

  beforeEach(() => {
    repository = new DeckInMemoryRepository();
  });

  describe('save', () => {
    it('should save a deck to the store', async () => {
      const deck = { id: '123', name: 'Test Deck' } as unknown as Deck;

      await repository.save(deck);

      const result = await repository.findById('123');
      expect(result).toEqual(deck);
    });

    it('should overwrite existing deck with same id', async () => {
      const deck1 = { id: '123', name: 'First Deck' } as unknown as Deck;
      const deck2 = { id: '123', name: 'Second Deck' } as unknown as Deck;

      await repository.save(deck1);
      await repository.save(deck2);

      const result = await repository.findById('123');
      expect(result).toEqual(deck2);
    });
  });

  describe('findById', () => {
    it('should return a deck when it exists', async () => {
      const deck = { id: '456', name: 'Test Deck' } as unknown as Deck;
      await repository.save(deck);

      const result = await repository.findById('456');

      expect(result).toEqual(deck);
    });

    it('should return null when deck does not exist', async () => {
      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });

    it('should return null for empty store', async () => {
      const result = await repository.findById('any-id');

      expect(result).toBeNull();
    });
  });
});
