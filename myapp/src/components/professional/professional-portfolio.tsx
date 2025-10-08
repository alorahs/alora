import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { proxyApiRequest, proxyUploadRequest } from "@/lib/apiProxy";
import { User } from "@/interfaces/user";

interface File {
  _id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  category: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PortfolioItem {
  _id?: string;
  title: string;
  description: string;
  images: (string | File)[];
  completionDate?: string;
}

interface ProfessionalPortfolioProps {
  user: User | null;
  professionalId: string;
}

export default function ProfessionalPortfolio({
  user,
  professionalId,
}: ProfessionalPortfolioProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<PortfolioItem, "_id">>({
    title: "",
    description: "",
    images: [],
    completionDate: "",
  });
  const [uploading, setUploading] = useState(false);

  const fetchPortfolioItems = useCallback(async () => {
    if (!professionalId) {
      return;
    }

    try {
      const response = await proxyApiRequest(
        `/professional/${professionalId}/portfolio`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio items (${response.status})`);
      }

      const data = await response.json();
      setPortfolioItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      toast({
        title: "Error",
        description: "Failed to load portfolio items",
        variant: "destructive",
      });
    }
  }, [professionalId, toast]);

  // Fetch portfolio items when component mounts
  useEffect(() => {
    void fetchPortfolioItems();
  }, [fetchPortfolioItems]);

  const handleAddItem = async () => {
    if (!newItem.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the portfolio item",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await proxyApiRequest(
        `/professional/${professionalId}/portfolio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: newItem,
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPortfolioItems(data.portfolioItems);
        setNewItem({
          title: "",
          description: "",
          images: [],
          completionDate: "",
        });
        toast({
          title: "Success",
          description: "Portfolio item added successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add portfolio item");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add portfolio item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (itemId: string, updates: Partial<PortfolioItem>) => {
    setLoading(true);
    try {
      const response = await proxyApiRequest(
        `/professional/${professionalId}/portfolio/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: updates,
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
  setPortfolioItems(data.portfolioItems);
        toast({
          title: "Success",
          description: "Portfolio item updated successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update portfolio item");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update portfolio item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    setLoading(true);
    try {
      const response = await proxyApiRequest(
        `/professional/${professionalId}/portfolio/${itemId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
  setPortfolioItems(data.portfolioItems);
        toast({
          title: "Success",
          description: "Portfolio item deleted successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete portfolio item");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete portfolio item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Mark uploaded files as public so they can be accessed without authentication
      formData.append("isPublic", "true");

      const response = await proxyUploadRequest("/files", formData, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const fileId = data.file._id;
        setNewItem((prev) => ({
          ...prev,
          images: [...prev.images, fileId],
        }));
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const removeImage = (imageId: string | File) => {
    setNewItem((prev) => ({
      ...prev,
      images: prev.images.filter((id) => {
        if (typeof id === "string") {
          return id !== imageId;
        }
        return id._id !== (imageId as File)._id;
      }),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio</h2>
        <p className="text-gray-600 mb-6">
          Showcase your completed work and projects.
        </p>
      </div>

      {/* Add New Portfolio Item */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add New Portfolio Item
        </h3>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Title
            </Label>
            <Input
              id="title"
              value={newItem.title}
              onChange={(e) =>
                setNewItem((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Project title"
            />
          </div>

          <div>
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Project description"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              Completion Date
            </Label>
            <Input
              type="date"
              value={newItem.completionDate}
              onChange={(e) =>
                setNewItem((prev) => ({ ...prev, completionDate: e.target.value }))
              }
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              Images
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {newItem.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={typeof image === 'string' ? `${import.meta.env.VITE_API_URL}/api/files/${image}` : image?.url || `${import.meta.env.VITE_API_URL}/api/files/${image?._id}`}
                    alt={`Uploaded ${index}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="max-w-xs"
              />
              {uploading && <span className="text-sm">Uploading...</span>}
            </div>
          </div>

          <Button onClick={handleAddItem} disabled={loading || uploading}>
            {loading ? "Adding..." : "Add Portfolio Item"}
          </Button>
        </div>
      </div>

      {/* Existing Portfolio Items */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Portfolio Items
        </h3>
        {portfolioItems.length === 0 ? (
          <p className="text-gray-500">No portfolio items yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                {item.images && item.images.length > 0 && (
                  <img
                    src={typeof item.images[0] === 'string' ? `${import.meta.env.VITE_API_URL}/api/files/${item.images[0]}` : item.images[0]?.url || `${import.meta.env.VITE_API_URL}/api/files/${item.images[0]?._id}`}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {item.description}
                  </p>
                  {item.completionDate && (
                    <p className="text-gray-500 text-xs mt-2">
                      Completed:{" "}
                      {new Date(item.completionDate).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteItem(item._id!)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}