'use server';

import { semanticSearch } from '@/ai/flows/semantic-search-research-papers';
import type { Paper } from '@/lib/data';
import { prisma } from '../../prisma/client';

export async function handleSearch(query: string): Promise<Paper[]> {
  if (!query) {
    return await prisma.paper.findMany({
      take: 20,
      orderBy: { uploadedAt: 'desc' },
      include: {
        authors: true,
        tags: true,
        categories: true,
        uploadedBy: true,
        bookmarkedBy: true
      }
    }).then(papers => papers.map(transformPaperResponse));
  }

  try {
    // Get semantically similar titles from AI
    const titles = await semanticSearch(query);
    
    // Search for papers with semantic matches or keyword matches
    const papers = await prisma.paper.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { abstract: { contains: query } },
          ...(titles.length > 0 ? [{ title: { in: titles } }] : [])
        ]
      },
      include: {
        authors: true,
        tags: true,
        categories: true,
        uploadedBy: true,
        bookmarkedBy: true
      }
    });

    return papers.map(transformPaperResponse);
  } catch (error) {
    console.error('Error during search:', error);
    
    // Fallback to basic keyword search on error
    const papers = await prisma.paper.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { abstract: { contains: query } }
        ]
      },
      include: {
        authors: true,
        tags: true,
        categories: true,
        uploadedBy: true,
        bookmarkedBy: true
      }
    });

    return papers.map(transformPaperResponse);
  }
}

function transformPaperResponse(paper: any): Paper {
  return {
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
    bookmarkedBy: paper.bookmarkedBy.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image
    })),
    authors: paper.authors.map((author: any) => ({
      id: author.id,
      name: author.name
    })),
    tags: paper.tags.map((tag: any) => ({
      id: tag.id,
      name: tag.name
    })),
    categories: paper.categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      description: category.description || undefined
    })),
    imageUrl: '/paper-placeholder.jpg',
    bookmarked: false
  };
}

export async function getPaperById(id: string): Promise<Paper | null> {
  try {
    const paper = await prisma.paper.findUnique({
      where: { id },
      include: {
        authors: true,
        tags: true,
        categories: true,
        uploadedBy: true,
        bookmarkedBy: true
      }
    });

    if (!paper) return null;
    return transformPaperResponse(paper);
  } catch (error) {
    console.error('Error fetching paper by ID:', error);
    return null;
  }
}
//       return results;
//     } else {
//         return allPapers.filter(paper => 
//             paper.title.toLowerCase().includes(query.toLowerCase()) || 
//             paper.abstract.toLowerCase().includes(query.toLowerCase())
//         );
//     }
//   } catch (error) {
//     console.error('Error during semantic search:', error);
//     // Fallback to simple search on error
//     const allPapers = getPapers();
//     return allPapers.filter(paper => 
//         paper.title.toLowerCase().includes(query.toLowerCase()) || 
//         paper.abstract.toLowerCase().includes(query.toLowerCase())
//     );
//   }
// }
