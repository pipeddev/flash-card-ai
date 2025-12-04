import { Inject, Injectable } from '@nestjs/common';
import { Deck } from 'src/flashcards/domain/entities/deck.entity';
import * as deckRepository from 'src/flashcards/domain/repositories/deck.repository';
import { OpenAiFlashcardsService } from 'src/flashcards/infrastructure/ai/openai-flashcards.service';
import { v4 as uuid } from 'uuid';

export interface GenerateDeckCommand {
  topic: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

@Injectable()
export class GenerateDeckUseCase {
  constructor(
    private readonly aiService: OpenAiFlashcardsService,
    @Inject('DeckRepository')
    private readonly deckRepository: deckRepository.DeckRepository,
  ) {}

  async execute(command: GenerateDeckCommand): Promise<Deck> {
    const cards = await this.aiService.generateFlashcards(
      command.topic,
      command.difficulty,
    );

    const deck = new Deck(uuid(), command.topic, command.difficulty, cards);

    await this.deckRepository.save(deck);

    return deck;
  }
}
