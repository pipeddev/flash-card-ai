import { Module } from '@nestjs/common';
import { FlashcardsController } from './interface/flashcards.controller';
import { GenerateDeckUseCase } from './application/use-cases/generate-deck.uc';
import { DeckInMemoryRepository } from './infrastructure/persistence/deck-inmemory.repository';
import { ValidatorUtils } from 'src/shared/utils/validator.utils';

@Module({
  controllers: [FlashcardsController],
  providers: [
    GenerateDeckUseCase,
    DeckInMemoryRepository,
    {
      provide: 'DeckRepository',
      useExisting: DeckInMemoryRepository,
    },
    ValidatorUtils,
  ],
})
export class FlashcardsModule {}
