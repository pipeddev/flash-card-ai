import { z } from 'zod';

export const generateDeckSchema = z.object({
  topic: z
    .string()
    .min(5, 'El tema debe tener al menos 5 caracteres.')
    .max(200, 'El tema es demasiado largo.'),
  difficulty: z.enum(['basic', 'intermediate', 'advanced'], {
    message: 'La dificultad es requerida.',
  }),
  provider: z.enum(['openai', 'gemini'], {
    message: 'El Model AI es requerido.',
  }),
});

export type GenerateDeckInput = z.infer<typeof generateDeckSchema>;

export const flashcardSchema = z.object({
  question: z.string(),
  answer: z.string(),
  difficulty: z.enum(['basic', 'intermediate', 'advanced']),
  tag: z.string(),
});

export const deckSchema = z.object({
  id: z.string(),
  topic: z.string(),
  difficulty: z.enum(['basic', 'intermediate', 'advanced']),
  cards: z.array(flashcardSchema),
});

export type DeckDTO = z.infer<typeof deckSchema>;
