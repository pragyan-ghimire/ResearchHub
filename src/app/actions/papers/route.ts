import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { z } from "zod";

// Validation schemas
const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

const GetPapersQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  sortBy: z.enum(['recent', 'title', 'author']).default('recent'),
});

const GetPapersByTagsSchema = PaginationSchema.extend({
  tags: z.array(z.string()).nonempty("At least one tag is required"),
});

const GetPapersByCategoriesSchema = PaginationSchema.extend({
  categories: z.array(z.string()).nonempty("At least one category is required"),
});

const GetPapersByAuthorsSchema = PaginationSchema.extend({
  authors: z.array(z.string()).nonempty("At least one author is required"),
});

// Helper function to handle errors
const handleError = (error: unknown) => {
  console.error('Error:', error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
};

// GET all papers with pagination and search
export async function getAllPapers(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const validatedParams = GetPapersQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      sortBy: searchParams.get('sortBy'),
    });

    const { page, limit, search, sortBy } = validatedParams;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { title: { contains: search } },
        { abstract: { contains: search } },
        { authors: { some: { name: { contains: search } } } },
        { categories: { some: { name: { contains: search } } } },
        { tags: { some: { name: { contains: search } } } },
      ],
    } : {};

    const orderBy = {
      [sortBy === 'recent' ? 'uploadedAt' : 
       sortBy === 'title' ? 'title' : 
       'uploadedAt']: 'desc'
    };

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          authors: true,
          categories: true,
          tags: true,
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.paper.count({ where }),
    ]);

    return NextResponse.json({
      papers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

// GET papers by user ID
export async function getPapersByUserId(userId: string, req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { page, limit } = PaginationSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });

    const skip = (page - 1) * limit;

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where: { userId },
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: limit,
        include: {
          authors: true,
          categories: true,
          tags: true,
        },
      }),
      prisma.paper.count({
        where: { userId },
      }),
    ]);

    return NextResponse.json({
      papers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

// GET papers by tags
export async function getPapersByTags(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const validatedParams = GetPapersByTagsSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      tags: searchParams.getAll('tags'),
    });

    const { page, limit, tags } = validatedParams;
    const skip = (page - 1) * limit;

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where: {
          tags: {
            some: {
              name: {
                in: tags,
              },
            },
          },
        },
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: limit,
        include: {
          authors: true,
          categories: true,
          tags: true,
          uploadedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.paper.count({
        where: {
          tags: {
            some: {
              name: {
                in: tags,
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      papers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

// GET papers uploaded by current user
export async function getPapersByCurrentUser(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const { page, limit } = PaginationSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });

    const skip = (page - 1) * limit;

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where: {
          uploadedBy: {
            id: session.user.id
          },
        },
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: limit,
        include: {
          authors: true,
          categories: true,
          tags: true,
          uploadedBy: {
            select: {
              id: true,
              name: true,
            },
          },
          bookmarkedBy: {
            where: {
              id: session.user.id
            },
            select: {
              id: true
            }
          }
        },
      }),
      prisma.paper.count({
        where: {
          uploadedBy: {
            id: session.user.id
          },
        },
      }),
    ]);

    return NextResponse.json({
      papers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

// GET papers by authors
export async function getPapersByAuthors(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const validatedParams = GetPapersByAuthorsSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      authors: searchParams.getAll('authors'),
    });

    const { page, limit, authors } = validatedParams;
    const skip = (page - 1) * limit;

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where: {
          authors: {
            some: {
              name: {
                in: authors,
              },
            },
          },
        },
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: limit,
        include: {
          authors: true,
          categories: true,
          tags: true,
          uploadedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.paper.count({
        where: {
          authors: {
            some: {
              name: {
                in: authors,
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      papers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

// GET bookmarked papers
export async function getPapersByBookmarks(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const { page, limit } = PaginationSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });

    const skip = (page - 1) * limit;

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where: {
          bookmarkedBy: {
            some: {
              id: session.user.id as string,
            },
          },
        },
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: limit,
        include: {
          authors: true,
          categories: true,
          tags: true,
          uploadedBy: {
            select: {
              id: true,
              name: true,
            },
          },
          bookmarkedBy: {
            where: {
              id: session.user.id as string
            },
            select: {
              id: true
            }
          }
        },
      }),
      prisma.paper.count({
        where: {
          bookmarkedBy: {
            some: {
              id: session.user.id as string,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      papers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

// GET papers by categories
export async function getPapersByCategories(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const validatedParams = GetPapersByCategoriesSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      categories: searchParams.getAll('categories'),
    });

    const { page, limit, categories } = validatedParams;
    const skip = (page - 1) * limit;

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where: {
          categories: {
            some: {
              name: {
                in: categories,
              },
            },
          },
        },
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: limit,
        include: {
          authors: true,
          categories: true,
          tags: true,
          uploadedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.paper.count({
        where: {
          categories: {
            some: {
              name: {
                in: categories,
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      papers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
