
import SearchablePaperList from '@/components/papers/searchable-paper-list';
import { prisma } from '../../prisma/client';

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Get recent papers with MINIMAL relations for fast initial render
  const papers = await prisma.paper.findMany({
    take: 20,
    orderBy: {
      uploadedAt: 'desc'
    },
    include: {
      authors: {
        select: { id: true, name: true }
      },
      tags: {
        select: { id: true, name: true },
        take: 3
      },
      categories: {
        select: { id: true, name: true },
        take: 2
      },
      uploadedBy: {
        select: { id: true, name: true, email: true, image: true }
      }
      // Don't fetch bookmarkedBy on initial load
    }
  });

  const query = typeof searchParams?.query === 'string' ? searchParams.query : undefined;

  // Transform the data to match the Paper interface
  const transformedPapers = papers.map(paper => ({
    id: paper.id,
    title: paper.title,
    abstract: paper.abstract,
    pdfUrl: paper.pdfUrl,
    publishedAt: paper.publishedAt,
    uploadedAt: paper.uploadedAt,
    updatedAt: paper.updatedAt,
    userId: paper.userId,
    uploadedBy: paper.uploadedBy,
    bookmarkedBy: [],
    authors: paper.authors,
    tags: paper.tags,
    categories: paper.categories,
    imageUrl: '/paper-placeholder.jpg',
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchablePaperList initialPapers={transformedPapers} initialQuery={query} />
    </div>
  );
}
