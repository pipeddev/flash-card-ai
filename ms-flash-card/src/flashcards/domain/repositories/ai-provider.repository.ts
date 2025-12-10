import { GenerateDeckModel } from '../models/generate-deck.model';
import { Deck } from '../entities/deck.entity';

export interface AiProviderRepository {
  generateDeck(input: GenerateDeckModel): Promise<Deck>;
}
