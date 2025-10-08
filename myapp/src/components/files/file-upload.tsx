import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { proxyUploadRequest } from "@/lib/apiProxy";
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Film, 
  Music, 
  Archive,
  X,
  CheckCircle
} from "lucide-react";

interface FileUploadProps {
  onUploadComplete?: (fileId: string, fileUrl: string) => void;
  category?: string;
  accept?: string;
  maxFileSize?: number; // in MB
  multiple?: boolean;
}

export default function FileUpload({
  onUploadComplete,
  category = "other",
  accept = "*/*",
  maxFileSize = 10,
  multiple = false,
}: FileUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string;
    name: string;
    size: number;
    status: "uploading" | "success" | "error";
    url?: string;
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    
    // Validate files
    for (const file of filesArray) {
      if (file.size > maxFileSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the maximum file size of ${maxFileSize}MB`,
          variant: "destructive",
        });
        return;
      }
    }

    // Add files to uploadedFiles state with uploading status
    const newFiles = filesArray.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: "uploading" as const,
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Upload files
    filesArray.forEach((file, index) => {
      uploadFile(file, newFiles[index].id);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (file: File, fileId: string) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      
      // Add metadata
      formData.append("metadata[originalName]", file.name);
      formData.append("metadata[fileSize]", file.size.toString());
      formData.append("metadata[fileType]", file.type);

      const response = await proxyUploadRequest("/files", formData, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const fileIdResponse = data.file._id;
        const fileUrl = `${import.meta.env.VITE_API_URL}/files/${fileIdResponse}`;
        
        // Update file status to success
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, status: "success", url: fileUrl } 
              : f
          )
        );
        
        // Call onUploadComplete callback
        if (onUploadComplete) {
          onUploadComplete(fileIdResponse, fileUrl);
        }
        
        toast({
          title: "Success",
          description: `${file.name} uploaded successfully`,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload file");
      }
    } catch (error) {
      // Update file status to error
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: "error" } 
            : f
        )
      );
      
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return <Image className="h-4 w-4" />;
    }
    
    if (["pdf"].includes(extension)) {
      return <FileText className="h-4 w-4" />;
    }
    
    if (["mp4", "avi", "mov", "wmv"].includes(extension)) {
      return <Film className="h-4 w-4" />;
    }
    
    if (["mp3", "wav", "ogg"].includes(extension)) {
      return <Music className="h-4 w-4" />;
    }
    
    if (["zip", "rar", "7z", "tar"].includes(extension)) {
      return <Archive className="h-4 w-4" />;
    }
    
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Select Files"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {multiple ? "Select one or more files" : "Select a file"} to upload
        </p>
        <p className="text-xs text-gray-500">
          Max file size: {maxFileSize}MB
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">Uploads</h3>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className="flex items-center text-gray-400">
                  {getFileIcon(file.name)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {file.status === "uploading" && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                )}
                {file.status === "success" && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {file.status === "error" && (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}