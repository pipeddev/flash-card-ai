import { Test, TestingModule } from '@nestjs/testing';
import { GenerateDeckUseCase } from 'src/flashcards/application/use-cases/generate-deck.uc';
import { Deck } from 'src/flashcards/domain/entities/deck.entity';
import { DeckInMemoryRepository } from 'src/flashcards/infrastructure/persistence/deck-inmemory.repository';
import { GenerateDeckDto } from 'src/flashcards/interface/dtos/generate-deck.dto';
import { FlashcardsController } from 'src/flashcards/interface/flashcards.controller';

describe('FlashcardsController', () => {
  let controller: FlashcardsController;
  let generateDeckUseCase: jest.Mocked<GenerateDeckUseCase>;
  let deckRepository: jest.Mocked<DeckInMemoryRepository>;

  beforeEach(async () => {
    const mockGenerateDeckUseCase = {
      execute: jest.fn(),
    };

    const mockDeckRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardsController],
      providers: [
        {
          provide: GenerateDeckUseCase,
          useValue: mockGenerateDeckUseCase,
        },
        {
          provide: DeckInMemoryRepository,
          useValue: mockDeckRepository,
        },
      ],
    }).compile();

    controller = module.get<FlashcardsController>(FlashcardsController);
    generateDeckUseCase = module.get(GenerateDeckUseCase);
    deckRepository = module.get(DeckInMemoryRepository);
  });

  describe('generate', () => {
    it('should generate a deck and return success response', async () => {
      const dto: GenerateDeckDto = { topic: 'TypeScript' } as GenerateDeckDto;
      const mockDeck = { id: '123', topic: 'TypeScript' } as Deck;

      generateDeckUseCase.execute.mockResolvedValue(mockDeck);

      const result = await controller.generate(dto);

      expect(generateDeckUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        status: 'success',
        data: mockDeck,
      });
    });
  });

  describe('findOne', () => {
    it('should find a deck by id and return success response', async () => {
      const mockDeck = { id: '123', topic: 'TypeScript' } as Deck;

      deckRepository.findById.mockResolvedValue(mockDeck);

      const result = await controller.findOne('123');

      expect(deckRepository.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual({
        status: 'success',
        data: mockDeck,
      });
    });

    it('should return null when deck is not found', async () => {
      deckRepository.findById.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(deckRepository.findById).toHaveBeenCalledWith('999');
      expect(result).toEqual({
        status: 'success',
        data: null,
      });
    });
  });
});
