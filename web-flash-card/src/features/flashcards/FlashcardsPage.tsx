import { FlashcardsForm } from './components/FlashcardsForm';
import { FlashcardsList } from './components/FlashcardsList';
import { FlashcardsSkeleton } from './components/FlashcardsSkeleton';
import { useFlashcards } from './hooks/useFlashcards';

export function FlashcardsPage() {
  const { deck, loading, errorMessage, errorDetails, generate } =
    useFlashcards();

  return (
    <div className='grid grid-cols-1 gap-12 lg:grid-cols-3'>
      {/* Columna izquierda: formulario */}
      <div className='flex flex-col gap-8 lg:col-span-1'>
        <div>
          <p className='text-[#0d1b1b] text-4xl font-black leading-tight tracking-[-0.033em]'>
            Generate Flashcards
          </p>
        </div>

        <FlashcardsForm onSubmit={generate} loading={loading} />

        <p className='text-xs text-center text-[#4c9a9a] mt-2'>
          Tip: Provide a specific topic for better results.
        </p>

        {errorMessage && (
          <div className='mt-4 rounded-lg bg-red-100 p-3 text-red-700 text-sm'>
            <p>{errorMessage}</p>
            {errorDetails && (
              <pre className='mt-2 text-xs bg-red-200/70 rounded p-2 overflow-auto'>
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Columna derecha: resultados */}
      <div className='lg:col-span-2 rounded-3xl bg-white p-6 sm:p-8 shadow-[0px_4px_16px_rgba(17,17,26,0.05),0px_8px_32px_rgba(17,17,26,0.05)]'>
        {loading ? <FlashcardsSkeleton /> : <FlashcardsList deck={deck} />}
      </div>
    </div>
  );
}
