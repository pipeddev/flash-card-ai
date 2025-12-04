import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ValidatorUtils } from './shared/utils/validator.utils';
import { FlashcardsModule } from './flashcards/flashcards.module';

@Module({
  imports: [HealthModule, AuthModule, FlashcardsModule],
  providers: [ValidatorUtils],
  exports: [ValidatorUtils],
})
export class AppModule {}
