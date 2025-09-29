'use server';

import { semanticSearch } from '@/ai/flows/semantic-search-research-papers';
import { getPapers, type Paper } from '@/lib/data';

export async function handleSearch(query: string): Promise<Paper[]> {
  if (!query) {
    return getPapers();
  }

  try {
    const titles = await semanticSearch(query);
    const allPapers = getPapers();

    // In a real app, you'd have a more robust way to map titles to papers, e.g., using IDs.
    // For this demo, we filter by exact title match.
    const results = allPapers.filter(paper => titles.some(title => paper.title.toLowerCase() === title.toLowerCase()));

    // If AI returns results, use them. Otherwise, perform a simple keyword search as a fallback.
    if (results.length > 0) {
      return results;
    } else {
        return allPapers.filter(paper => 
            paper.title.toLowerCase().includes(query.toLowerCase()) || 
            paper.abstract.toLowerCase().includes(query.toLowerCase())
        );
    }
  } catch (error) {
    console.error('Error during semantic search:', error);
    // Fallback to simple search on error
    const allPapers = getPapers();
    return allPapers.filter(paper => 
        paper.title.toLowerCase().includes(query.toLowerCase()) || 
        paper.abstract.toLowerCase().includes(query.toLowerCase())
    );
  }
}
