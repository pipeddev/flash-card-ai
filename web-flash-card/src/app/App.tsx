import { MainLayout } from './layout/MainLayout';
import { FlashcardsPage } from '../features/flashcards/FlashcardsPage';

export function App() {
  return (
    <MainLayout>
      <FlashcardsPage />
    </MainLayout>
  );
}
