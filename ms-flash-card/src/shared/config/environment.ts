import 'dotenv/config';

export const Environment = {
  // App Configuration
  APP_NAME: process.env.APP_NAME ?? 'ms-flash-card',
  APP_PORT: +(process.env.APP_PORT ?? 3000),
  APP_ENV: process.env.APP_ENV ?? 'development',

  // OpenAI API
  OPENAI_API_KEY: String(process.env.OPENAI_API_KEY ?? ''),
  OPENAI_MODEL: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',

  // JWT (Auth)
  JWT_SECRET: process.env.JWT_SECRET ?? 'super_secret_key_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',

  // Rate Limiting
  RATE_LIMIT_TTL: +(process.env.RATE_LIMIT_TTL ?? 60),
  RATE_LIMIT_LIMIT: +(process.env.RATE_LIMIT_LIMIT ?? 100),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'debug',
};
