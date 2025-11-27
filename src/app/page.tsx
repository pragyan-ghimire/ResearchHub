
import SearchablePaperList from '@/components/papers/searchable-paper-list';
import { prisma } from '../../prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

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
      },
      // Fetch bookmarkedBy only for current user if logged in
      ...(userId ? {
        bookmarkedBy: {
          where: { id: userId },
          select: { id: true }
        }
      } : {})
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
    bookmarkedBy: paper.bookmarkedBy || [],
    authors: paper.authors,
    tags: paper.tags,
    categories: paper.categories,
    imageUrl: '/paper-placeholder.jpg',
    bookmarked: (paper.bookmarkedBy || []).length > 0,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchablePaperList initialPapers={transformedPapers} initialQuery={query} />
    </div>
  );
}
