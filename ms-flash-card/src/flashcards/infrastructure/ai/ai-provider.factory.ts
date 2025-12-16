import { OpenAiFlashcardsService } from './openai-flashcards.service';
import { GeminiFlashcardsService } from './gemini-flashcards.service';
import { AiProvider } from 'src/flashcards/domain/enums/ai-provider.enum';
import { AIFlashcardsProvider } from 'src/flashcards/domain/providers/ai-flashcards.provider';

export class AiProviderFactory {
  static create(provider: AiProvider): AIFlashcardsProvider {
    switch (provider) {
      case AiProvider.OPENAI:
        return new OpenAiFlashcardsService();
      case AiProvider.GEMINI:
        return new GeminiFlashcardsService();
    }
  }
}
