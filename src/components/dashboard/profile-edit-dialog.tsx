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
import { CldUploadWidget } from "next-cloudinary";

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
             <CldUploadWidget
              uploadPreset="z409w9o5"
              options={{
                maxFiles: 1,
                sources: ['local'],
                resourceType: "raw",
                clientAllowedFormats: ["pdf"],
                // resourceType: "image",
                // clientAllowedFormats: ["jpg", "jpeg"],
                // maxFileSize: 102400, // 100kb in bytes
              }}
              onSuccess={handleImageUpload}
            >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => open()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </Button>
                )}
              </CldUploadWidget>
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
