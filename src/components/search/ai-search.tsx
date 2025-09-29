'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BrainCircuit, X } from 'lucide-react';

type AISearchProps = {
  onSearch: (query: string) => void;
  isSearching: boolean;
  initialQuery?: string;
};

export default function AISearch({ onSearch, isSearching, initialQuery = '' }: AISearchProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const clearSearch = () => {
    setQuery('');
    onSearch('');
  }

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="flex items-center gap-2 text-primary mb-4 justify-center">
        <BrainCircuit className="h-6 w-6" />
        <h1 className="text-4xl font-bold font-headline">Discover Research</h1>
      </div>
      <p className="text-lg text-muted-foreground mb-6">
        Use our AI-powered tool to find research papers semantically related to your interests.
      </p>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for papers on quantum computing, machine learning, etc."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 pl-10 pr-24 rounded-full text-base"
          aria-label="Search for papers"
        />
        {query && (
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            onClick={clearSearch}
            className="absolute right-24 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSearching}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-9 rounded-full px-6"
          aria-label="Submit search"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </form>
    </div>
  );
}
