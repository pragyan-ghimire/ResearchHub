'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Download, CalendarDays, Users, BookCheck } from 'lucide-react';
import { format } from 'date-fns';
import { getPaperById, toggleBookmark } from '@/app/actions';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import type { Paper } from '@/lib/data';

type PaperPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function PaperPage({ params }: PaperPageProps) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      try {
        const data = await getPaperById(resolvedParams.id);
        setPaper(data);
        setIsBookmarked(data?.bookmarked || false);
      } catch (error) {
        console.error('Failed to fetch paper:', error);
        setPaper(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  const handleBookmarkClick = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You need to be logged in to bookmark papers",
        variant: "destructive",
      });
      return;
    }

    if (!paper) return;

    setIsBookmarkLoading(true);
    try {
      const result = await toggleBookmark(paper.id, session.user.id);
      setIsBookmarked(result.bookmarked);
      toast({
        title: "Success",
        description: result.bookmarked ? "Paper bookmarked" : "Bookmark removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!paper?.pdfUrl) return;
    
    // Use our API endpoint to handle the download
    const encodedUrl = encodeURIComponent(paper.pdfUrl);
    const downloadUrl = `/api/papers/download?url=${encodedUrl}`;
    
    // Open in new tab to trigger download
    window.open(downloadUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-40 bg-muted rounded mt-8"></div>
        </div>
      </div>
    );
  }

  if (!paper) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <article>
            <div className="mb-6">
              <h1 className="text-4xl font-bold font-headline mb-4">{paper.title}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{paper.authors.map(a => a.name).join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{format(new Date(paper.uploadedAt), 'MMMM d, yyyy')}</span>
                </div>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="font-headline text-2xl">Abstract</h2>
              <p>{paper.abstract}</p>
            </div>
            
            <div className="mt-8">
                <h3 className="font-headline text-xl mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {paper.categories.map((category) => (
                        <Badge key={category.id} variant="default" className="text-sm px-3 py-1">{category.name}</Badge>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="font-headline text-xl mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {paper.tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="text-sm px-3 py-1">{tag.name}</Badge>
                    ))}
                </div>
            </div>

            <div className="mt-12">
              <h2 className="font-headline text-2xl mb-4">Paper Preview</h2>
              <div className="aspect-[4/5] rounded-lg border overflow-hidden">
                {paper.pdfUrl && <iframe src={paper.pdfUrl} width="100%" height="100%" />}
              </div>
            </div>
          </article>
        </div>
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleBookmarkClick}
                  disabled={isBookmarkLoading}
                >
                    {isBookmarked ? (
                      <BookCheck className="mr-2 h-4 w-4 text-accent" />
                    ) : (
                      <Bookmark className="mr-2 h-4 w-4" />
                    )}
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
                {paper.pdfUrl && (
                  <Button size="lg" onClick={handleDownloadPdf}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                  </Button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
