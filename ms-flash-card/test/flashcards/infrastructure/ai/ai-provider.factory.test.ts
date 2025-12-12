import { AiProvider } from 'src/flashcards/domain/enums/ai-provider.enum';
import { AiProviderFactory } from 'src/flashcards/infrastructure/ai/ai-provider.factory';
import { GeminiFlashcardsService } from 'src/flashcards/infrastructure/ai/gemini-flashcards.service';
import { OpenAiFlashcardsService } from 'src/flashcards/infrastructure/ai/openai-flashcards.service';

import { BusinessError } from 'src/shared/error/business.error';

jest.mock('src/flashcards/infrastructure/ai/openai-flashcards.service');
jest.mock('src/flashcards/infrastructure/ai/gemini-flashcards.service');

describe('AiProviderFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create OpenAiFlashcardsService when provider is OPENAI', () => {
      const service = AiProviderFactory.create(AiProvider.OPENAI);

      expect(service).toBeInstanceOf(OpenAiFlashcardsService);
      expect(OpenAiFlashcardsService).toHaveBeenCalledTimes(1);
    });

    it('should create GeminiFlashcardsService when provider is GEMINI', () => {
      const service = AiProviderFactory.create(AiProvider.GEMINI);

      expect(service).toBeInstanceOf(GeminiFlashcardsService);
      expect(GeminiFlashcardsService).toHaveBeenCalledTimes(1);
    });

    it('should throw BusinessError when provider is unknown', () => {
      const unknownProvider = 'UNKNOWN' as AiProvider;

      expect(() => AiProviderFactory.create(unknownProvider)).toThrow(
        BusinessError,
      );
    });
  });
});
