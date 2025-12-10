import { type ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className='min-h-screen bg-[#f6f8f8] font-[Lexend]'>
      <div className='flex flex-col h-full'>
        {/* Header */}
        <header className='flex items-center justify-between border-b border-b-[#e7f3f3] px-6 sm:px-10 lg:px-20 py-3'>
          <div className='flex items-center gap-4 text-[#0d1b1b]'>
            <div className='size-6 text-[#13ecec]'>
              <svg
                fill='none'
                viewBox='0 0 48 48'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z'
                  fill='currentColor'
                />
              </svg>
            </div>
            <h2 className='text-lg font-bold tracking-[-0.015em]'>
              AI Flashcards
            </h2>
          </div>

          <div className='flex gap-2'>
            <button className='flex min-w-[84px] items-center justify-center rounded-xl h-10 px-4 bg-[#13ecec] text-[#0d1b1b] text-sm font-bold'>
              Sign Up
            </button>
            <button className='flex min-w-[84px] items-center justify-center rounded-xl h-10 px-4 bg-[#e7f3f3] text-[#0d1b1b] text-sm font-bold'>
              Log In
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className='flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-12'>
          <div className='mx-auto max-w-7xl'>{children}</div>
        </main>
      </div>
    </div>
  );
}
