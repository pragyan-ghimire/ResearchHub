"use client";

import { useEffect, useState } from 'react';
import PaperList from '@/components/papers/paper-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Bookmark, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

import type { Paper } from '@/lib/data';

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
  const [uploadedPapers, setUploadedPapers] = useState<Paper[]>([]);
  const [bookmarkedPapers, setBookmarkedPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    uploads: 0,
    bookmarks: 0,
  });

  // Transform API response to match Paper type
  const transformApiPaper = (paper: any): Paper => ({
    id: paper.id,
    title: paper.title,
    authors: paper.authors.map((a: any) => a.name),
    abstract: paper.abstract,
    imageUrl: '/paper-placeholder.jpg', // You can add a default image or get from API
    pdfUrl: paper.pdfUrl || '',
    bookmarked: false, // This should come from API
    uploadDate: paper.uploadedAt,
    tags: paper.tags.map((t: any) => t.name),
    categories: paper.categories.map((c: any) => c.name),
    uploaderId: paper.uploadedBy?.id,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user's uploaded papers
        const uploadsRes = await fetch('/api/papers?page=1&limit=10');
        const uploadsData: PaginatedResponse = await uploadsRes.json();

        // Fetch user's bookmarked papers
        const bookmarksRes = await fetch('/api/papers/bookmarks?page=1&limit=10');
        const bookmarksData: PaginatedResponse = await bookmarksRes.json();

        setUploadedPapers(uploadsData.papers.map(transformApiPaper));
        setBookmarkedPapers(bookmarksData.papers.map(transformApiPaper));
        setStats({
          uploads: uploadsData.pagination.total,
          bookmarks: bookmarksData.pagination.total,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!session || !session.user) {
      fetchUserData();
    }
  }, [session, toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: User Info & Stats */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={`https://picsum.photos/id/30/200/300`} alt={session?.user?.name || "User"} />
                <AvatarFallback>{session?.user?.name ?? 'User'.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-headline">
                  {session?.user?.name ?? 'User'}
                </CardTitle>
                <CardDescription>
                  {session?.user?.email ?? ''}
                </CardDescription>
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
                <div className="text-2xl font-bold">{uploadedPapers.length}</div>
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
                <div className="text-2xl font-bold">{bookmarkedPapers.length}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Papers */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="uploads">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="uploads">My Uploads</TabsTrigger>
              <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
            </TabsList>
            <TabsContent value="uploads" className="mt-6">
                <h2 className="text-2xl font-headline font-bold mb-4">My Uploads</h2>
                <PaperList papers={uploadedPapers} />
            </TabsContent>
            <TabsContent value="bookmarks" className="mt-6">
                <h2 className="text-2xl font-headline font-bold mb-4">My Bookmarks</h2>
                <PaperList papers={bookmarkedPapers} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
