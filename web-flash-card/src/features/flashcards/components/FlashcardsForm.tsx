import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Difficulty } from '../types';
import { generateDeckSchema, type GenerateDeckInput } from '../schemas';
import type { ZodFormErrors } from '@/shared/validation/zod-helpers';

interface FlashcardsFormProps {
  onSubmit: (input: GenerateDeckInput) => void;
  loading?: boolean;
}

const difficulties: Difficulty[] = ['basic', 'intermediate', 'advanced'];

export function FlashcardsForm({ onSubmit, loading }: FlashcardsFormProps) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');
  const [errors, setErrors] = useState<
    ZodFormErrors<typeof generateDeckSchema>
  >({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const result = generateDeckSchema.safeParse({
      topic,
      difficulty,
      provider,
    });

    if (!result.success) {
      const fieldErrors: ZodFormErrors<typeof generateDeckSchema> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof typeof fieldErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      {/* Topic */}
      <label className='flex flex-col'>
        <span className='text-[#0d1b1b] text-base font-medium pb-2'>Topic</span>
        <input
          className='w-full rounded-xl border border-[#cfe7e7] bg-white h-14 px-4 text-base text-[#0d1b1b] placeholder:text-[#4c9a9a] focus:outline-none focus:border-[#13ecec]'
          placeholder='Ej: Google Cloud Pub/Sub'
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        {errors.topic && (
          <p className='mt-1 text-sm text-red-600'>{errors.topic}</p>
        )}
      </label>

      {/* Difficulty */}
      <div className='flex flex-col'>
        <span className='text-[#0d1b1b] text-base font-medium pb-2'>
          Difficulty
        </span>
        <div className='flex flex-wrap gap-3'>
          {difficulties.map((value) => {
            const isActive = difficulty === value;
            const label =
              value === 'basic'
                ? 'Basic'
                : value === 'intermediate'
                ? 'Intermediate'
                : 'Advanced';

            return (
              <button
                key={value}
                type='button'
                onClick={() => setDifficulty(value)}
                className={[
                  'flex-1 h-11 rounded-xl border px-4 text-sm font-medium flex items-center justify-center transition',
                  isActive
                    ? 'border-[3px] border-[#13ecec] font-bold'
                    : 'border-[#cfe7e7]',
                ].join(' ')}
              >
                {label}
              </button>
            );
          })}
        </div>
        {errors.difficulty && (
          <p className='mt-1 text-sm text-red-600'>{errors.difficulty}</p>
        )}
      </div>

      {/* AI Provider */}
      <div className='flex flex-col'>
        <span className='text-[#0d1b1b] text-base font-medium pb-2'>
          AI Model
        </span>
        <div className='flex gap-3'>
          <label
            className={[
              'flex-1 h-11 rounded-xl border px-4 flex items-center cursor-pointer transition',
              provider === 'gemini'
                ? 'border-[3px] border-[#13ecec] bg-[#f0fefe]'
                : 'border-[#cfe7e7] bg-white',
            ].join(' ')}
          >
            <input
              type='radio'
              value='gemini'
              name='provider'
              checked={provider === 'gemini'}
              onChange={() => setProvider('gemini')}
              className='w-4 h-4 text-[#13ecec] border-[#cfe7e7] focus:ring-[#13ecec] focus:ring-2'
            />
            <span
              className={[
                'ms-2 text-sm font-medium',
                provider === 'gemini'
                  ? 'text-[#0d1b1b] font-bold'
                  : 'text-[#4c9a9a]',
              ].join(' ')}
            >
              Gemini
            </span>
          </label>

          <label
            className={[
              'flex-1 h-11 rounded-xl border px-4 flex items-center cursor-pointer transition',
              provider === 'openai'
                ? 'border-[3px] border-[#13ecec] bg-[#f0fefe]'
                : 'border-[#cfe7e7] bg-white',
            ].join(' ')}
          >
            <input
              type='radio'
              value='openai'
              name='provider'
              checked={provider === 'openai'}
              onChange={() => setProvider('openai')}
              className='w-4 h-4 text-[#13ecec] border-[#cfe7e7] focus:ring-[#13ecec] focus:ring-2'
            />
            <span
              className={[
                'ms-2 text-sm font-medium',
                provider === 'openai'
                  ? 'text-[#0d1b1b] font-bold'
                  : 'text-[#4c9a9a]',
              ].join(' ')}
            >
              OpenAI
            </span>
          </label>
        </div>

        {errors.provider && (
          <p className='mt-1 text-sm text-red-600'>{errors.provider}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type='submit'
        disabled={loading}
        className='mt-2 h-12 w-full rounded-full bg-[#13ecec] text-[#0d1b1b] text-base font-bold tracking-[0.015em] disabled:bg-[#9aecec]'
      >
        {loading ? 'Generating...' : 'Generate deck'}
      </button>
    </form>
  );
}
