import { Inject, Injectable } from '@nestjs/common';
import { Deck } from 'src/flashcards/domain/entities/deck.entity';
import * as deckRepository from 'src/flashcards/domain/repositories/deck.repository';
import { AiProvider } from 'src/flashcards/domain/enums/ai-provider.enum';
import { AiProviderFactory } from 'src/flashcards/infrastructure/ai/ai-provider.factory';
import { Difficulty } from 'src/flashcards/domain/types/flashcard.types';
import { v4 as uuid } from 'uuid';

export interface GenerateDeckCommand {
  topic: string;
  difficulty: Difficulty;
  provider: AiProvider;
}

@Injectable()
export class GenerateDeckUseCase {
  constructor(
    @Inject('DeckRepository')
    private readonly deckRepository: deckRepository.DeckRepository,
  ) {}

  async execute(command: GenerateDeckCommand): Promise<Deck> {
    const aiProvider = AiProviderFactory.create(command.provider);

    const cards = await aiProvider.generateFlashcards(
      command.topic,
      command.difficulty,
    );

    const deck = new Deck(uuid(), command.topic, command.difficulty, cards);

    await this.deckRepository.save(deck);

    return deck;
  }
}
