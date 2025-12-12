import { Test, TestingModule } from '@nestjs/testing';
import { DeckRepository } from 'src/flashcards/domain/repositories/deck.repository';
import { ValidatorUtils } from '../../../../src/shared/utils/validator.utils';
import { AiProviderFactory } from 'src/flashcards/infrastructure/ai/ai-provider.factory';
import { AiProvider } from 'src/flashcards/domain/enums/ai-provider.enum';
import { Difficulty } from 'src/flashcards/domain/types/flashcard.types';
import { Deck } from 'src/flashcards/domain/entities/deck.entity';
import {
  GenerateDeckCommand,
  GenerateDeckUseCase,
} from 'src/flashcards/application/use-cases/generate-deck.uc';

jest.mock('uuid', () => ({ v4: jest.fn(() => 'mock-uuid') }));
jest.mock('src/flashcards/infrastructure/ai/ai-provider.factory');

describe('GenerateDeckUseCase', () => {
  let useCase: GenerateDeckUseCase;
  let deckRepository: jest.Mocked<DeckRepository>;
  let validatorUtils: jest.Mocked<ValidatorUtils>;

  const mockFlashcards = [
    { question: 'Q1', answer: 'A1' },
    { question: 'Q2', answer: 'A2' },
  ];

  const mockAiProvider = {
    generateFlashcards: jest.fn().mockResolvedValue(mockFlashcards),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateDeckUseCase,
        {
          provide: 'DeckRepository',
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: ValidatorUtils,
          useValue: {
            validateOrThrowBusinessError: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GenerateDeckUseCase>(GenerateDeckUseCase);
    deckRepository = module.get('DeckRepository');
    validatorUtils = module.get(ValidatorUtils);

    (AiProviderFactory.create as jest.Mock).mockReturnValue(mockAiProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should generate and save a deck successfully', async () => {
    const command: GenerateDeckCommand = {
      topic: 'TypeScript',
      difficulty: 'medium' as Difficulty,
      provider: AiProvider.OPENAI,
    };

    const result = await useCase.execute(command);

    expect(validatorUtils.validateOrThrowBusinessError).toHaveBeenCalledWith(
      command,
    );
    expect(AiProviderFactory.create).toHaveBeenCalledWith(command.provider);
    expect(mockAiProvider.generateFlashcards).toHaveBeenCalledWith(
      command.topic,
      command.difficulty,
    );
    expect(deckRepository.save).toHaveBeenCalledWith(expect.any(Deck));
    expect(result).toBeInstanceOf(Deck);
    expect(result.topic).toBe(command.topic);
    expect(result.difficulty).toBe(command.difficulty);
  });

  it('should throw error when validation fails', async () => {
    const command: GenerateDeckCommand = {
      topic: '',
      difficulty: 'easy' as Difficulty,
      provider: AiProvider.OPENAI,
    };

    const validationError = new Error('Validation failed');
    validatorUtils.validateOrThrowBusinessError.mockRejectedValue(
      validationError,
    );

    await expect(useCase.execute(command)).rejects.toThrow(validationError);
    expect(AiProviderFactory.create).not.toHaveBeenCalled();
    expect(deckRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when AI provider fails', async () => {
    const command: GenerateDeckCommand = {
      topic: 'JavaScript',
      difficulty: 'hard' as Difficulty,
      provider: AiProvider.OPENAI,
    };

    const aiError = new Error('AI generation failed');
    mockAiProvider.generateFlashcards.mockRejectedValue(aiError);

    await expect(useCase.execute(command)).rejects.toThrow(aiError);
    expect(deckRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when repository save fails', async () => {
    const command: GenerateDeckCommand = {
      topic: 'React',
      difficulty: 'easy' as Difficulty,
      provider: AiProvider.OPENAI,
    };

    const saveError = new Error('AI generation failed');
    deckRepository.save.mockRejectedValue(saveError);

    await expect(useCase.execute(command)).rejects.toThrow(saveError);
  });
});
