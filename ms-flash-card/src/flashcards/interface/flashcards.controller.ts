import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GenerateDeckDto } from './dtos/generate-deck.dto';
import { GenerateDeckUseCase } from '../application/use-cases/generate-deck.uc';
import { DeckInMemoryRepository } from '../infrastructure/persistence/deck-inmemory.repository';
import { JSendDTO } from 'src/shared/dtos/jsend.dto';
import { Deck } from '../domain/entities/deck.entity';

@Controller('flashcards')
export class FlashcardsController {
  constructor(
    private readonly generateDeckUc: GenerateDeckUseCase,
    private readonly deckRepo: DeckInMemoryRepository,
  ) {}

  @Post('generate')
  async generate(@Body() dto: GenerateDeckDto): Promise<JSendDTO<Deck>> {
    const deck = await this.generateDeckUc.execute(dto);
    return JSendDTO.success(deck);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JSendDTO<Deck | null>> {
    const deck = await this.deckRepo.findById(id);
    return JSendDTO.success(deck);
  }
}
