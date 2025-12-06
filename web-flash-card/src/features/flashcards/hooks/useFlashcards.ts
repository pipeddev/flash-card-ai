import { useState } from 'react';
import { generateDeck } from '../api/generateDeck';
import type { Deck } from '../types';
import type { GenerateDeckInput } from '../schemas';
import { JSendFailError, JSendServerError } from '@/shared/lib/httpClient';

export function useFlashcards() {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<Record<
    string,
    unknown
  > | null>(null);

  async function handleGenerate(input: GenerateDeckInput) {
    try {
      setLoading(true);
      setErrorMessage(null);
      setErrorDetails(null);

      const newDeck = await generateDeck(input);
      setDeck(newDeck);
    } catch (err) {
      if (err instanceof JSendFailError) {
        setErrorMessage('Hay errores en los datos enviados.');
        setErrorDetails(
          (err.data as { messages?: Record<string, unknown> })?.messages || null
        );
      } else if (err instanceof JSendServerError) {
        setErrorMessage(`Error del servidor: ${err.message}`);
        setErrorDetails(
          (err.data as { messages?: Record<string, unknown> })?.messages || null
        );
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Error desconocido.');
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    deck,
    loading,
    errorMessage,
    errorDetails,
    generate: handleGenerate,
  };
}
