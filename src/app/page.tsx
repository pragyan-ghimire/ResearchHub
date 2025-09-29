import { getPapers } from '@/lib/data';
import SearchablePaperList from '@/components/papers/searchable-paper-list';
import type { Paper } from '@/lib/data';

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const papers = getPapers();
  const query = typeof searchParams?.query === 'string' ? searchParams.query : undefined;

  // In a real app, you would filter papers based on the query here if it exists.
  // For this version, we pass all papers and let the client component handle the search.

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchablePaperList initialPapers={papers} initialQuery={query} />
    </div>
  );
}
