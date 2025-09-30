'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Paper } from '@/lib/data';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Download, BookCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

type PaperCardProps = {
  paper: Paper;
};

export default function PaperCard({ paper }: PaperCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(paper.bookmarked);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };
  
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(paper.pdfUrl, '_blank');
  }

  return (
    <Link href={`/papers/${paper.id}`} className="block">
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-40 w-full">
            <Image
              src={paper.imageUrl}
              alt={paper.title}
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint="research paper"
            />
          </div>
          <div className="p-4">
            <CardTitle className="text-lg leading-tight font-headline h-16 overflow-hidden">
              {paper.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4 pt-0">
          <p className="text-sm text-muted-foreground">
            {paper.authors.join(', ')}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {paper.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBookmark}
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
