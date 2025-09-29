import type { Paper } from '@/lib/data';
import PaperCard from './paper-card';
import { Skeleton } from '@/components/ui/skeleton';

type PaperListProps = {
  papers: Paper[];
  isLoading?: boolean;
};

export default function PaperList({ papers, isLoading = false }: PaperListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <h3 className="text-xl font-semibold">No Papers Found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} />
      ))}
    </div>
  );
}
