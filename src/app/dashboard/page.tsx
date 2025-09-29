import { getBookmarkedPapers, getUploadedPapersByUserId } from '@/lib/data';
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
import { Upload, Bookmark } from 'lucide-react';

export default function DashboardPage() {
  // In a real app, you'd get the user ID from the session.
  const userId = 'user-123';
  const user = {
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    avatarUrl: 'https://picsum.photos/seed/avatar/100/100',
    bio: 'Researcher in the field of Artificial Intelligence and Machine Learning, with a focus on semantic search and natural language processing.',
  };

  const bookmarkedPapers = getBookmarkedPapers();
  const uploadedPapers = getUploadedPapersByUserId(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: User Info & Stats */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-headline">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{user.bio}</p>
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
