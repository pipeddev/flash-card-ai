import { Flashcard } from 'src/flashcards/domain/entities/flashcard.entity';
import OpenAI from 'openai';
import { OpenAiFlashcardsService } from 'src/flashcards/infrastructure/ai/openai-flashcards.service';

jest.mock('openai');
jest.mock('src/shared/config/environment', () => ({
  Environment: {
    OPENAI_API_KEY: 'test-api-key',
    OPENAI_MODEL: 'gpt-4o-mini',
  },
}));

describe('OpenAiFlashcardsService', () => {
  let service: OpenAiFlashcardsService;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    mockCreate = jest.fn();

    const mockClient = {
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    };

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(
      () => mockClient as any as OpenAI,
    );

    service = new OpenAiFlashcardsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateFlashcards', () => {
    it('should generate flashcards successfully', async () => {
      const mockResponse = [
        {
          question: 'What is TypeScript?',
          answer: 'A typed superset of JavaScript',
          difficulty: 'basic',
          tag: 'concept',
        },
        {
          question: 'What are generics?',
          answer: 'Reusable type-safe components',
          difficulty: 'intermediate',
          tag: 'concept',
        },
      ];

      mockCreate.mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(mockResponse) } }],
      });

      const result = await service.generateFlashcards('TypeScript', 'basic');

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Flashcard);
      expect(result[0].question).toBe('What is TypeScript?');
      expect(mockCreate).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: expect.any(String) }],
        temperature: 0.7,
      });
    });

    it('should return empty array when API returns invalid JSON', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'invalid json' } }],
      });

      const result = await service.generateFlashcards('TypeScript', 'basic');

      expect(result).toEqual([]);
    });

    it('should return empty array when API returns non-array', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: '{"key": "value"}' } }],
      });

      const result = await service.generateFlashcards('TypeScript', 'basic');

      expect(result).toEqual([]);
    });

    it('should return empty array when content is undefined', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: {} }],
      });

      const result = await service.generateFlashcards('TypeScript', 'basic');

      expect(result).toEqual([]);
    });

    it('should handle empty choices array', async () => {
      mockCreate.mockResolvedValue({
        choices: [],
      });

      const result = await service.generateFlashcards('TypeScript', 'basic');

      expect(result).toEqual([]);
    });

    it('should include topic and difficulty in prompt', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: '[]' } }],
      });

      await service.generateFlashcards('JavaScript', 'advanced');

      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.messages[0].content).toContain('JavaScript');
      expect(callArgs.messages[0].content).toContain('advanced');
    });

    it('should generate flashcards with different difficulties', async () => {
      const mockResponse = [
        {
          question: 'What is a variable?',
          answer: 'A container for storing data',
          difficulty: 'basic',
          tag: 'concept',
        },
      ];

      mockCreate.mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(mockResponse) } }],
      });

      const result = await service.generateFlashcards(
        'Variables',
        'intermediate',
      );

      expect(result).toHaveLength(1);
      expect(result[0].difficulty).toBe('basic');
    });

    it('should handle API errors gracefully', async () => {
      mockCreate.mockRejectedValue(new Error('API Error'));

      await expect(
        service.generateFlashcards('TypeScript', 'basic'),
      ).rejects.toThrow('API Error');
    });

    it('should parse flashcards with all tag types', async () => {
      const mockResponse = [
        { question: 'Q1', answer: 'A1', difficulty: 'basic', tag: 'example' },
        { question: 'Q2', answer: 'A2', difficulty: 'basic', tag: 'use-case' },
        { question: 'Q3', answer: 'A3', difficulty: 'basic', tag: 'warning' },
        { question: 'Q4', answer: 'A4', difficulty: 'basic', tag: 'tip' },
      ];

      mockCreate.mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(mockResponse) } }],
      });

      const result = await service.generateFlashcards('Testing', 'basic');

      expect(result).toHaveLength(4);
      expect(result.map((f) => f.tag)).toEqual([
        'example',
        'use-case',
        'warning',
        'tip',
      ]);
    });

    it('should handle empty response content', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: '' } }],
      });

      const result = await service.generateFlashcards('TypeScript', 'basic');

      expect(result).toEqual([]);
    });

    it('should use default model when OPENAI_MODEL is not set', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: '[]' } }],
      });

      await service.generateFlashcards('TypeScript', 'basic');

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'gpt-4o-mini' }),
      );
    });
  });
});
