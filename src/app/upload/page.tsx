"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useToast } from "@/hooks/use-toast";
import { CldUploadWidget } from 'next-cloudinary';

const popularCategories = [
  "Technology",
  "Science",
  "Health",
  "Business",
  "Arts & Humanities",
];

export default function UploadPage() {
  const { toast } = useToast();
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const handlePdfUpload = (result: any) => {
    // console.log("Upload result:", result);
    setPdfUrl(result.info.secure_url);
    toast({
      title: "Success",
      description: "PDF uploaded successfully",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!pdfUrl) {
        toast({
          title: "Error",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const otherCategory = showOtherCategory
        ? formData.get("other-category")?.toString()
        : "";
      const allCategories = [
        ...selectedCategories,
        ...(otherCategory ? otherCategory.split(",").map((c) => c.trim()) : []),
      ];

      const data = {
        title: formData.get("title"),
        abstract: formData.get("abstract"),
        authors: formData
          .get("authors")
          ?.toString()
          .split(",")
          .map((a) => a.trim()),
        categories: allCategories,
        tags: formData
          .get("tags")
          ?.toString()
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        pdfUrl: pdfUrl,
      };
      console.log("Submitting data:", data);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload paper");
      }

      toast({
        title: "Success!",
        description: "Paper uploaded successfully",
      });

      // Reset the form
      (e.currentTarget as HTMLFormElement).reset();
      setSelectedCategories([]);
      setShowOtherCategory(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload paper",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="title">Paper Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="A Novel Approach to..."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="authors">Authors</Label>
                <Input
                  id="authors"
                  name="authors"
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
                  name="abstract"
                  placeholder="Start with a brief summary of your research..."
                  required
                  rows={6}
                />
              </div>
              <div className="grid gap-2">
                <Label>Categories</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {popularCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        value={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked: CheckedState) => {
                          if (checked) {
                            setSelectedCategories([
                              ...selectedCategories,
                              category,
                            ]);
                          } else {
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== category)
                            );
                          }
                        }}
                      />
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
                      name="other-category"
                      placeholder="Please specify your category"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Separate categories with a comma.
                    </p>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags / Keywords</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="Machine Learning, AI, Semantic Search"
                />
                <p className="text-sm text-muted-foreground">
                  Separate tags with a comma.
                </p>
              </div>
              <div className="grid gap-2">
                <Label>PDF File</Label>
                <CldUploadWidget
                  uploadPreset="z409w9o5"
                  options={{
                    maxFiles: 1,
                    sources: ['local'],
                    resourceType: "raw",
                    clientAllowedFormats: ["pdf"],
                  }}
                  onSuccess={handlePdfUpload}
                >
                  {({ open }) => (
                    <div className="flex flex-col gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                      >
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload PDF
                      </Button>
                      {pdfUrl && (
                        <p className="text-sm text-muted-foreground">
                          PDF uploaded successfully
                        </p>
                      )}
                    </div>
                  )}
                </CldUploadWidget>
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={loading}>
                  {loading ? "Uploading..." : "Upload Paper"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
