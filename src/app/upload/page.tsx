'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { CheckedState } from '@radix-ui/react-checkbox';

const popularCategories = [
  'Technology',
  'Science',
  'Health',
  'Business',
  'Arts & Humanities',
];

export default function UploadPage() {
  const [showOtherCategory, setShowOtherCategory] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center mb-8">
          <UploadCloud className="h-12 w-12 text-accent mb-4" />
          <h1 className="text-4xl font-bold font-headline">
            Upload Your Research
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Share your work with the community. Fill out the form below.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Paper Details</CardTitle>
            <CardDescription>
              Provide information about the research paper you are uploading.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Paper Title</Label>
                <Input
                  id="title"
                  placeholder="A Novel Approach to..."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="authors">Authors</Label>
                <Input
                  id="authors"
                  placeholder="John Doe, Jane Smith"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Separate author names with a comma.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="abstract">Abstract</Label>
                <Textarea
                  id="abstract"
                  placeholder="Start with a brief summary of your research..."
                  required
                  rows={6}
                />
              </div>
              <div className="grid gap-2">
                <Label>Categories</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {popularCategories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox id={`category-${category}`} value={category} />
                      <Label
                        htmlFor={`category-${category}`}
                        className="font-normal"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="category-other"
                      onCheckedChange={(checked: CheckedState) =>
                        setShowOtherCategory(!!checked)
                      }
                    />
                    <Label htmlFor="category-other" className="font-normal">
                      Other
                    </Label>
                  </div>
                </div>
                {showOtherCategory && (
                  <div className="mt-2">
                    <Input
                      id="other-category"
                      placeholder="Please specify your category"
                    />
                     <p className="text-sm text-muted-foreground mt-2">Separate categories with a comma.</p>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags / Keywords</Label>
                <Input
                  id="tags"
                  placeholder="Machine Learning, AI, Semantic Search"
                />
                <p className="text-sm text-muted-foreground">
                  Separate tags with a comma.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pdf-file">PDF File</Label>
                <Input
                  id="pdf-file"
                  type="file"
                  accept=".pdf"
                  required
                  className="pt-2"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="lg">
                  Upload Paper
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
