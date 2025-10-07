import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "../../../../prisma/client";
import { z } from "zod";

// Define validation schemas
const AuthorSchema = z.string().min(1, "Author name is required");
const CategorySchema = z.string().min(1, "Category name is required");
const TagSchema = z.string().min(1, "Tag name is required");

const UploadPaperSchema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(1, "Abstract is required"),
  authors: z.array(AuthorSchema).min(1, "At least one author is required"),
  categories: z.array(CategorySchema).min(1, "At least one category is required"),
  tags: z.array(TagSchema).optional().default([]),
  pdfUrl: z.string().url("Invalid PDF URL"),
});

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated session
    const session = await getServerSession(authOptions);

    // Parse and validate request body
    const body = await req.json();
    const validationResult = UploadPaperSchema.safeParse(body);
    console.error(body)

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      console.error("Validation errors:", errorMessages);
      
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: errorMessages 
        },
        { status: 400 }
      );
    }

    const { title, abstract, authors: authorNames, categories: categoryNames, tags: tagNames = [], pdfUrl } = validationResult.data;

    // Create paper and relationships in a transaction
    const paper = await prisma.$transaction(async (tx) => {
      // Create or get authors
      const authors = await Promise.all(
        authorNames.map(name =>
          tx.author.upsert({
            where: { name },
            update: {},
            create: { name },
          })
        )
      );

      // Create or get categories
      const categories = await Promise.all(
        categoryNames.map(name =>
          tx.category.upsert({
            where: { name },
            update: {},
            create: { name },
          })
        )
      );

      // Create or get tags
      const tags = await Promise.all(
        tagNames.map(name =>
          tx.tag.upsert({
            where: { name },
            update: {},
            create: { name },
          })
        )
      );

      // Create the paper with all relationships
      return await tx.paper.create({
        data: {
          title,
          abstract,
          pdfUrl,
          uploadedBy: {
            connect: { 
              email: session?.user?.email || '' 
            },
          },
          authors: {
            connect: authors.map(author => ({
              id: author.id,
            })),
          },
          categories: {
            connect: categories.map(category => ({
              id: category.id,
            })),
          },
          tags: {
            connect: tags.map(tag => ({
              id: tag.id,
            })),
          },
        },
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
      });
    });

    return NextResponse.json(
      {
        success: true,
        paper,
        message: "Paper uploaded successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading paper:", error);
    return NextResponse.json(
      {
        error: "Internal server error while uploading paper",
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
