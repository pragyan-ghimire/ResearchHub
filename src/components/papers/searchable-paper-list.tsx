'use client';

import type { Paper } from '@/lib/data';
import { useState, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AISearch from '@/components/search/ai-search';
import PaperList from '@/components/papers/paper-list';
import { handleSearch } from '@/app/actions';

type SearchablePaperListProps = {
  initialPapers: Paper[];
  initialQuery?: string;
};

export default function SearchablePaperList({ initialPapers, initialQuery = '' }: SearchablePaperListProps) {
  const [papers, setPapers] = useState<Paper[]>(initialPapers);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState('Recent Uploads');
  const router = useRouter();

  const onSearch = async (query: string) => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (query) {
        params.set('query', query);
      } else {
        params.delete('query');
      }
      
      // Update URL without reload
      router.replace(`?${params.toString()}`, { scroll: false });

      // Start loading state
      startTransition(async () => {
        const results = await handleSearch(query);
        setPapers(results);
        setTitle(query ? `Search results for "${query}"` : 'Recent Uploads');
      });
    } catch (error) {
      console.error('Search error:', error);
      setPapers([]);
      setTitle('Error loading results');
    }
  };
  
  useEffect(() => {
    if (initialQuery) {
        onSearch(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  return (
    <div className="space-y-8">
      <AISearch onSearch={onSearch} isSearching={isPending} initialQuery={initialQuery} />
      
      <div className="mt-12">
        <h2 className="text-3xl font-headline font-bold mb-6">
          {title}
        </h2>
        <PaperList papers={papers} isLoading={isPending} />
      </div>
    </div>
  );
}
