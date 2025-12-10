export function FlashcardsSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className='h-28 rounded-lg bg-gray-200 animate-pulse'
        ></div>
      ))}
    </div>
  );
}
