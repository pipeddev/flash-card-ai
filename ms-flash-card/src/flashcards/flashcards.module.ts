import { Module } from '@nestjs/common';
import { FlashcardsController } from './interface/flashcards.controller';
import { GenerateDeckUseCase } from './application/use-cases/generate-deck.uc';
import { OpenAiFlashcardsService } from './infrastructure/ai/openai-flashcards.service';
import { DeckInMemoryRepository } from './infrastructure/persistence/deck-inmemory.repository';

@Module({
  controllers: [FlashcardsController],
  providers: [
    GenerateDeckUseCase,
    OpenAiFlashcardsService,
    DeckInMemoryRepository,
    {
      provide: 'DeckRepository',
      useExisting: DeckInMemoryRepository,
    },
  ],
})
export class FlashcardsModule {}
