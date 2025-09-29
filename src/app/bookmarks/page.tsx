import { getBookmarkedPapers } from '@/lib/data';
import PaperList from '@/components/papers/paper-list';
import { BookCheck } from 'lucide-react';

export default function BookmarksPage() {
  const bookmarkedPapers = getBookmarkedPapers();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <BookCheck className="h-12 w-12 text-accent mb-4" />
        <h1 className="text-4xl font-bold font-headline">Your Bookmarks</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          All your saved research papers in one place.
        </p>
      </div>

      <PaperList papers={bookmarkedPapers} />
    </div>
  );
}
