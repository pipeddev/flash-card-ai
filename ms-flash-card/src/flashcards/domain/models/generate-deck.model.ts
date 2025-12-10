import { AiProvider } from '../enums/ai-provider.enum';

export interface GenerateDeckModel {
  topic: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  provider: AiProvider;
}
