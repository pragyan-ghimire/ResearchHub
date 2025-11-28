"use client";

import PaperList from '@/components/papers/paper-list';
import { BookCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import type { Paper } from "@/lib/data";
import { useToast } from '@/hooks/use-toast';

interface PaginatedResponse {
  papers: Paper[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

export default function BookmarksPage() {

  const { data: session } = useSession();
  const [bookmarkedPapers, setBookmarkedPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

    // Transform API response to match Paper type
  const transformApiPaper = (paper: any): Paper => ({
    id: paper.id,
    title: paper.title,
    abstract: paper.abstract,
    pdfUrl: paper.pdfUrl,
    publishedAt: paper.publishedAt,
    uploadedAt: paper.uploadedAt,
    updatedAt: paper.updatedAt,
    userId: paper.uploadedBy.id,
    uploadedBy: paper.uploadedBy,
    bookmarkedBy: paper.bookmarkedBy || [],
    authors: paper.authors,
    tags: paper.tags,
    categories: paper.categories,
    // Client-side properties
    bookmarked: paper.bookmarkedBy?.some((user: any) => user.id === session?.user?.id)
  });


  const fetchPapers = async () => {
  if (!session?.user) return;

  setIsLoading(true);

  try {
    const endpoint = "/api/papers/bookmarks";
    const response = await fetch(`${endpoint}?page=1&limit=10`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PaginatedResponse = await response.json();

     // Just store the papers array
    setBookmarkedPapers( data.papers.map(transformApiPaper));

  } catch (error) {
    console.error("Fetch error:", error);
    toast({
      title: "Error",
      description: `Failed to load bookmarks`,
      variant: "destructive",
    });
    // reset the list on error
    setBookmarkedPapers([]);

  } finally {
    setIsLoading(false);
  }
  };

   useEffect(() => {
      if (session?.user) {
        fetchPapers();
      }
    }, [session?.user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <BookCheck className="h-12 w-12 text-accent mb-4" />
        <h1 className="text-4xl font-bold font-headline">Your Bookmarks</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          All your saved research papers in one place.
        </p>
      </div>

      <PaperList papers={bookmarkedPapers} isLoading={isLoading} />
    </div>
  );
}
