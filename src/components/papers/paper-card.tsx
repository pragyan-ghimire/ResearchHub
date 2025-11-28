'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Paper } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Download, BookCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { toggleBookmark as toggleBookmarkAction } from '@/app/actions';

type PaperCardProps = {
  paper: Paper;
};

export default function PaperCard({ paper }: PaperCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(paper.bookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You need to be logged in to bookmark papers",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleBookmarkAction(paper.id, session.user.id);
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
      setIsLoading(false);
    }
  };
  
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (paper.pdfUrl) {
      window.open(paper.pdfUrl, '_blank');
    }
  }

  return (
    <Link href={`/papers/${paper.id}`} className="block">
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-4">
          <CardTitle className="text-lg leading-tight font-headline h-16 overflow-hidden">
            {paper.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-3">
            {paper.abstract}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-4 pt-0">
          <p className="text-sm text-muted-foreground">
            {paper.authors.map(author => author.name).join(', ')}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {paper.tags.slice(0, 2).map(tag => (
              <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleBookmark}
            disabled={isLoading}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            className="text-muted-foreground hover:text-primary"
          >
            {isBookmarked ? (
              <BookCheck className="h-5 w-5 text-accent" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
