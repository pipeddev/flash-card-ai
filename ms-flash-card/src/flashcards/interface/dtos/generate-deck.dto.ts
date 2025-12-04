import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class GenerateDeckDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsIn(['basic', 'intermediate', 'advanced'])
  difficulty: 'basic' | 'intermediate' | 'advanced';
}
