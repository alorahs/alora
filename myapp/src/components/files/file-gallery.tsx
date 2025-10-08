import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { proxyApiRequest } from "@/lib/apiProxy";
import { useToast } from "@/hooks/use-toast";
import {
  Image,
  FileText,
  Film,
  Music,
  Archive,
  File,
  Download,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";

interface FileItem {
  _id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  category: string;
  isPublic: boolean;
  createdAt: string;
  sizeDisplay: string;
  typeCategory: string;
}

interface FileGalleryProps {
  userId?: string;
  category?: string;
  onSelectFile?: (file: FileItem) => void;
  showDelete?: boolean;
  showDownload?: boolean;
  showPreview?: boolean;
}

export default function FileGallery({
  userId,
  category,
  onSelectFile,
  showDelete = false,
  showDownload = true,
  showPreview = true,
}: FileGalleryProps) {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">(
    category || "all"
  );
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/files";
      if (userId) {
        url += `?owner=${userId}`;
      }
      if (selectedCategory && selectedCategory !== "all") {
        url += `${userId ? "&" : "?"}category=${selectedCategory}`;
      }

      const response = await proxyApiRequest(url, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, toast, userId]);

  useEffect(() => {
    void fetchFiles();
  }, [fetchFiles]);

  const deleteFile = async (fileId: string) => {
    try {
      const response = await proxyApiRequest(`/files/${fileId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
  setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
        toast({
          title: "Success",
          description: "File deleted successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete file");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (mimetype: string, typeCategory: string) => {
    if (typeCategory === "image") {
      return <Image className="h-6 w-6 text-blue-500" />;
    }

    if (typeCategory === "pdf") {
      return <FileText className="h-6 w-6 text-red-500" />;
    }

    if (typeCategory === "video") {
      return <Film className="h-6 w-6 text-purple-500" />;
    }

    if (typeCategory === "audio") {
      return <Music className="h-6 w-6 text-yellow-500" />;
    }

    if (typeCategory === "document" || typeCategory === "spreadsheet") {
      return <FileText className="h-6 w-6 text-green-500" />;
    }

    if (typeCategory === "archive") {
      return <Archive className="h-6 w-6 text-gray-500" />;
    }

    return <File className="h-6 w-6 text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const categories = [
    { value: "all", label: "All Files" },
    { value: "profile-picture", label: "Profile Pictures" },
    { value: "work-gallery", label: "Work Gallery" },
    { value: "document", label: "Documents" },
    { value: "attachment", label: "Attachments" },
    { value: "other", label: "Other" },
  ];

  const filteredFiles = selectedCategory === "all" 
    ? files 
    : files.filter(file => file.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900">File Gallery</h2>
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      selectedCategory === cat.value
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedCategory(cat.value);
                      setFilterOpen(false);
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <File className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No files found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedCategory === "all"
              ? "Get started by uploading a new file."
              : `No files found in the ${categories.find(c => c.value === selectedCategory)?.label} category.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file._id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-center mb-3">
                  {file.typeCategory === "image" ? (
                    <img
                      src={file.url}
                      alt={file.originalName}
                      className="h-32 w-full object-cover rounded"
                    />
                  ) : (
                    <div className="h-32 w-full flex items-center justify-center bg-gray-100 rounded">
                      {getFileIcon(file.mimetype, file.typeCategory)}
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {file.originalName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {file.category}
                  </span>
                  {file.isPublic && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Public
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex justify-between">
                <div className="flex space-x-2">
                  {showPreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(file.url, "_blank")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {showDownload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadFile(file.url, file.originalName)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {showDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteFile(file._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}