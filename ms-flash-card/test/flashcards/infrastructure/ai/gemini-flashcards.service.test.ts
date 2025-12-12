import { GoogleGenAI } from '@google/genai';
import { Flashcard } from 'src/flashcards/domain/entities/flashcard.entity';
import { GeminiFlashcardsService } from 'src/flashcards/infrastructure/ai/gemini-flashcards.service';

jest.mock('@google/genai');
jest.mock('src/shared/config/environment', () => ({
  Environment: {
    GEMINI_API_KEY: 'test-api-key',
    GEMINI_MODEL: 'test-model',
  },
}));

describe('GeminiFlashcardsService', () => {
  let service: GeminiFlashcardsService;
  let mockClient: jest.Mocked<GoogleGenAI>;

  beforeEach(() => {
    const generateContentMock = jest.fn();
    mockClient = {
      models: {
        generateContent: generateContentMock,
      },
    } as any;

    (GoogleGenAI as jest.MockedClass<typeof GoogleGenAI>).mockImplementation(
      () => mockClient,
    );

    service = new GeminiFlashcardsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateFlashcards', () => {
    it('should generate flashcards from valid JSON response', async () => {
      const mockResponse = {
        text: JSON.stringify([
          {
            question: 'What is TypeScript?',
            answer: 'A typed superset of JavaScript',
            difficulty: 'basic',
            tag: 'concept',
          },
        ]),
      };
      (mockClient.models.generateContent as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await service.generateFlashcards('TypeScript', 'basic');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Flashcard);
      expect(result[0].question).toBe('What is TypeScript?');
      expect(mockClient.models.generateContent).toHaveBeenCalledWith({
        model: 'test-model',
        contents: expect.stringContaining('TypeScript'),
      });
    });

    it('should return empty array when response text is null', async () => {
      (mockClient.models.generateContent as jest.Mock).mockResolvedValue({
        text: null,
      });

      const result = await service.generateFlashcards('Topic', 'basic');

      expect(result).toEqual([]);
    });

    it('should return empty array when response is invalid JSON', async () => {
      (mockClient.models.generateContent as jest.Mock).mockResolvedValue({
        text: 'invalid json',
      });

      const result = await service.generateFlashcards('Topic', 'basic');

      expect(result).toEqual([]);
    });

    it('should return empty array when response is not an array', async () => {
      (mockClient.models.generateContent as jest.Mock).mockResolvedValue({
        text: JSON.stringify({ notAnArray: true }),
      });

      const result = await service.generateFlashcards('Topic', 'basic');

      expect(result).toEqual([]);
    });

    it('should handle multiple flashcards', async () => {
      const mockResponse = {
        text: JSON.stringify([
          {
            question: 'Q1',
            answer: 'A1',
            difficulty: 'basic',
            tag: 'concept',
          },
          {
            question: 'Q2',
            answer: 'A2',
            difficulty: 'intermediate',
            tag: 'example',
          },
        ]),
      };
      (mockClient.models.generateContent as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await service.generateFlashcards('Topic', 'advanced');

      expect(result).toHaveLength(2);
      expect(result[0].question).toBe('Q1');
      expect(result[1].question).toBe('Q2');
    });
  });
});
