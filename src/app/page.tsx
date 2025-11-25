
import SearchablePaperList from '@/components/papers/searchable-paper-list';
import { prisma } from '../../prisma/client';

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Get recent papers with full relations
  const papers = await prisma.paper.findMany({
    take: 20, // Limit to 20 most recent papers for performance
    orderBy: {
      uploadedAt: 'desc'
    },
    include: {
      authors: true,
      tags: true,
      categories: true,
      uploadedBy: true,
      bookmarkedBy: true
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
    uploadedBy: {
      id: paper.uploadedBy.id,
      name: paper.uploadedBy.name,
      email: paper.uploadedBy.email,
      image: paper.uploadedBy.image
    },
    bookmarkedBy: paper.bookmarkedBy.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image
    })),
    authors: paper.authors.map(author => ({
      id: author.id,
      name: author.name
    })),
    tags: paper.tags.map(tag => ({
      id: tag.id,
      name: tag.name
    })),
    categories: paper.categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || undefined
    })),
    // Client-side only properties
    imageUrl: 'https://picsum.photos/200/300',
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchablePaperList initialPapers={transformedPapers} initialQuery={query} />
    </div>
  );
}
