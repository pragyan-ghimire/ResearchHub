"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { updateUserProfile } from "@/app/actions";
import { Loader2, Edit2, Upload } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import CldUploadWidget only if Cloudinary is configured
const CldUploadWidget = dynamic(
  () => import("next-cloudinary").then((mod) => mod.CldUploadWidget),
  { ssr: false, loading: () => null }
);

interface ProfileEditDialogProps {
  userName: string | null | undefined;
  userBio: string | null | undefined;
  userImage: string | null | undefined;
  onUpdate?: () => void;
}

export default function ProfileEditDialog({
  userName,
  userBio,
  userImage,
  onUpdate,
}: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: userName || "",
    bio: userBio || "",
    image: userImage || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (result: any) => {
    if (result?.event === "success") {
      const imageUrl = result.info.secure_url;
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          image: imageUrl,
        }));
        toast({
          title: "Success",
          description: "Image selected successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "User ID not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await updateUserProfile(session.user.id, {
        name: formData.name,
        bio: formData.bio,
        image: formData.image,
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setOpen(false);
      onUpdate?.();
      
      // Reload page with cache-busting to get updated session data from server
      const timestamp = new Date().getTime();
      window.location.href = `${window.location.pathname}?t=${timestamp}`;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit2 className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-16 w-16 rounded-full object-cover border border-gray-200"
                />
              )}
              <div className="flex flex-col gap-2 flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="flex-1"
                />
                <p className="text-xs text-muted-foreground">PNG, JPG or GIF (max. 5MB)</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a short bio about yourself..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
