import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <BookOpen className="h-7 w-7 text-primary" />
      <span className="text-2xl font-bold font-headline text-foreground">
        ResearchHub
      </span>
    </Link>
  );
}
