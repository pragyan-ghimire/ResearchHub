// Types matching Prisma schema
export interface Author {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  pdfUrl?: string | null;
  publishedAt?: Date | null;
  uploadedAt: Date;
  updatedAt: Date;
  userId: string;
  uploadedBy: User;
  bookmarkedBy: User[];
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  // Client-side only properties
  bookmarked?: boolean;
}
