import { IsEnum, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { AiProvider } from 'src/flashcards/domain/enums/ai-provider.enum';

export class GenerateDeckDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsIn(['basic', 'intermediate', 'advanced'])
  difficulty: 'basic' | 'intermediate' | 'advanced';

  @IsEnum(AiProvider)
  @IsNotEmpty({ message: 'AI provider is required' })
  provider: AiProvider;
}
