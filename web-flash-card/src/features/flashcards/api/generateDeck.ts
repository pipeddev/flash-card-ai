import { HttpClient } from '@/shared/lib/httpClient';
import { deckSchema, type GenerateDeckInput } from '../schemas';
import type { Deck } from '../types';

const http = new HttpClient();

export async function generateDeck(input: GenerateDeckInput): Promise<Deck> {
  const raw = await http.post<unknown, GenerateDeckInput>(
    '/flashcards/generate',
    input
  );

  // Validar la respuesta del backend
  const parsed = deckSchema.safeParse(raw);
  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error('Respuesta inválida del servidor.');
  }

  return parsed.data;
}
