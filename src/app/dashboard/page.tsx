"use client";

import { useEffect, useState, useCallback } from "react";
import PaperList from "@/components/papers/paper-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Bookmark, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

import type { Paper } from "@/lib/data";

interface PaginatedResponse {
  papers: Paper[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"uploads" | "bookmarks">(
    "uploads"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [papers, setPapers] = useState<{
    uploads: Paper[];
    bookmarks: Paper[];
  }>({
    uploads: [],
    bookmarks: [],
  });
  const [stats, setStats] = useState({
    uploads: 0,
    bookmarks: 0,
  });

  // Transform API response to match Paper type
  const transformApiPaper = (paper: any): Paper => ({
    id: paper.id,
    title: paper.title,
    abstract: paper.abstract,
    pdfUrl: paper.pdfUrl,
    publishedAt: paper.publishedAt,
    uploadedAt: paper.uploadedAt,
    updatedAt: paper.updatedAt,
    userId: paper.uploadedBy.id,
    uploadedBy: paper.uploadedBy,
    bookmarkedBy: paper.bookmarkedBy || [],
    authors: paper.authors,
    tags: paper.tags,
    categories: paper.categories,
    // Client-side properties
    imageUrl: "/paper-placeholder.jpg",
    bookmarked: paper.bookmarkedBy?.some((user: any) => user.id === session?.user?.id)
  });

  const fetchPapers = async (type: "uploads" | "bookmarks") => {
    if (!session?.user) return;

    setIsLoading(true);

    try {
      const endpoint =
        type === "uploads" ? "/api/papers/user" : "/api/papers/bookmarks";
      const response = await fetch(`${endpoint}?page=1&limit=10`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PaginatedResponse = await response.json();
      setPapers((prev) => ({
        ...prev,
        [type]: data.papers.map(transformApiPaper),
      }));
      setStats((prev) => ({
        ...prev,
        [type]: data.pagination.total,
      }));
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: `Failed to load ${type}`,
        variant: "destructive",
      });
      setPapers((prev) => ({
        ...prev,
        [type]: [],
      }));
      setStats((prev) => ({
        ...prev,
        [type]: 0,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      // Fetch both tabs on initial load to get accurate counts
      fetchPapers("uploads");
      fetchPapers("bookmarks");
    }
  }, [session?.user]);

  // Only fetch when actively switching to a tab
  useEffect(() => {
    if (session?.user && papers[activeTab].length === 0 && stats[activeTab] === 0) {
      fetchPapers(activeTab);
    }
  }, [activeTab, session?.user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: User Info & Stats */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage
                  src={`https://picsum.photos/id/30/200/300`}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback>
                  {session?.user?.name ?? "User".charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-headline">
                  {session?.user?.name ?? "User"}
                </CardTitle>
                <CardDescription>{session?.user?.email ?? ""}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Change your bio</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Papers Uploaded
                </CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.uploads}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Papers Bookmarked
                </CardTitle>
                <Bookmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.bookmarks}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Papers */}
        <div className="lg:col-span-2">
          <Tabs
            defaultValue="uploads"
            onValueChange={(value) =>
              setActiveTab(value as "uploads" | "bookmarks")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="uploads">My Uploads</TabsTrigger>
              <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
            </TabsList>
            <TabsContent value="uploads" className="mt-6">
              <h2 className="text-2xl font-headline font-bold mb-4">
                My Uploads
              </h2>
              <PaperList papers={papers.uploads} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="bookmarks" className="mt-6">
              <h2 className="text-2xl font-headline font-bold mb-4">
                My Bookmarks
              </h2>
              <PaperList papers={papers.bookmarks} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
