import { GenerateDeckDto } from 'src/flashcards/interface/dtos/generate-deck.dto';
import { GenerateDeckModel } from '../models/generate-deck.model';

export class GenerateDeckMapper {
  static fromDto(dto: GenerateDeckDto): GenerateDeckModel {
    return {
      topic: dto.topic,
      difficulty: dto.difficulty,
      provider: dto.provider,
    };
  }
}
