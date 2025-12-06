import { Module } from '@nestjs/common';
import { FlashcardsController } from './interface/flashcards.controller';
import { GenerateDeckUseCase } from './application/use-cases/generate-deck.uc';
import { DeckInMemoryRepository } from './infrastructure/persistence/deck-inmemory.repository';

@Module({
  controllers: [FlashcardsController],
  providers: [
    GenerateDeckUseCase,
    DeckInMemoryRepository,
    {
      provide: 'DeckRepository',
      useExisting: DeckInMemoryRepository,
    },
  ],
})
export class FlashcardsModule {}
