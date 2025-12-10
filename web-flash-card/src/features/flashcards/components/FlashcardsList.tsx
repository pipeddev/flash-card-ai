import type { Deck } from '../types';

interface FlashcardsListProps {
  deck: Deck | null;
}

export function FlashcardsList({ deck }: FlashcardsListProps) {
  if (!deck) {
    return (
      <p className='text-sm text-[#4c9a9a]'>
        Genera un deck para ver tus flashcards aquí.
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h2 className='text-2xl font-bold text-[#0d1b1b]'>
          Flashcards for: {deck.topic}
        </h2>
        <div className='mt-3 flex flex-wrap gap-2'>
          <span className='inline-flex items-center justify-center rounded-full bg-[#13ecec]/20 px-3 py-1 text-sm font-medium text-[#0d1b1b]'>
            Difficulty: {deck.difficulty}
          </span>
          <span className='inline-flex items-center justify-center rounded-full bg-[#13ecec]/20 px-3 py-1 text-sm font-medium text-[#0d1b1b]'>
            Total: {deck.cards.length} cards
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        {deck.cards.map((card, index) => (
          <div
            key={index}
            className='rounded-lg border border-[#e7f3f3] bg-[#f6f8f8] p-4'
          >
            <div className='flex items-center justify-between'>
              <span className='inline-flex items-center rounded bg-[#13ecec]/30 px-2 py-0.5 text-xs font-semibold text-[#0d1b1b]'>
                {card.tag}
              </span>
              <button
                type='button'
                className='flex h-8 w-8 items-center justify-center rounded-lg text-[#4c9a9a] hover:bg-[#e7f3f3]'
                title='Copy'
              >
                <span className='material-symbols-outlined text-base'>
                  content_copy
                </span>
              </button>
            </div>
            <div className='mt-2'>
              <p className='font-bold text-[#0d1b1b]'>{card.question}</p>
              <p className='mt-1 text-sm text-[#4c9a9a]'>{card.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
