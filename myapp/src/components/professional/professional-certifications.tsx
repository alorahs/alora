import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { proxyApiRequest, proxyUploadRequest } from "@/lib/apiProxy";
import { User } from "@/interfaces/user";

interface Certification {
  _id?: string;
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expirationDate?: string;
  certificateUrl?: string;
}

interface ProfessionalCertificationsProps {
  user: User | null;
  professionalId: string;
}

export default function ProfessionalCertifications({
  user,
  professionalId,
}: ProfessionalCertificationsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [newCertification, setNewCertification] = useState<Omit<Certification, "_id">>({
    name: "",
    issuingOrganization: "",
    issueDate: "",
    expirationDate: "",
    certificateUrl: "",
  });
  const [uploading, setUploading] = useState(false);

  const fetchCertifications = useCallback(async () => {
    if (!professionalId) {
      return;
    }

    try {
      const response = await proxyApiRequest(`/professional/${professionalId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch certifications (${response.status})`);
      }

      const data = await response.json();
      setCertifications(Array.isArray(data.certifications) ? data.certifications : []);
    } catch (error) {
      console.error("Error fetching certifications:", error);
      toast({
        title: "Error",
        description: "Failed to load certifications",
        variant: "destructive",
      });
    }
  }, [professionalId, toast]);

  // Fetch certifications when component mounts
  useEffect(() => {
    void fetchCertifications();
  }, [fetchCertifications]);

  const handleAddCertification = async () => {
    if (!newCertification.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a certification name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await proxyApiRequest(
        `/professional/${professionalId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            certifications: [...certifications, newCertification],
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCertifications(data.certifications || []);
        setNewCertification({
          name: "",
          issuingOrganization: "",
          issueDate: "",
          expirationDate: "",
          certificateUrl: "",
        });
        toast({
          title: "Success",
          description: "Certification added successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add certification");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add certification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCertification = async (
    certIndex: number,
    updates: Partial<Certification>
  ) => {
    setLoading(true);
    try {
      const updatedCertifications = [...certifications];
      updatedCertifications[certIndex] = {
        ...updatedCertifications[certIndex],
        ...updates,
      };

      const response = await proxyApiRequest(
        `/professional/${professionalId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            certifications: updatedCertifications,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCertifications(data.certifications || []);
        toast({
          title: "Success",
          description: "Certification updated successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update certification");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update certification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertification = async (certIndex: number) => {
    setLoading(true);
    try {
      const updatedCertifications = certifications.filter(
        (_, index) => index !== certIndex
      );

      const response = await proxyApiRequest(
        `/professional/${professionalId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            certifications: updatedCertifications,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCertifications(data.certifications || []);
        toast({
          title: "Success",
          description: "Certification deleted successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete certification");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete certification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCertificateUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    certIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await proxyUploadRequest("/files", formData, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const fileId = data.file._id;
        const fileUrl = `${import.meta.env.VITE_API_URL}/files/${fileId}`;
        
        // Update the certification with the file URL
        handleUpdateCertification(certIndex, { certificateUrl: fileUrl });
        
        toast({
          title: "Success",
          description: "Certificate uploaded successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload certificate");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to upload certificate",
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

  const handleNewCertificateUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await proxyUploadRequest("/files", formData, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const fileId = data.file._id;
        const fileUrl = `${import.meta.env.VITE_API_URL}/files/${fileId}`;
        
        // Update the new certification with the file URL
        setNewCertification((prev) => ({
          ...prev,
          certificateUrl: fileUrl,
        }));
        
        toast({
          title: "Success",
          description: "Certificate uploaded successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload certificate");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to upload certificate",
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Certifications
        </h2>
        <p className="text-gray-600 mb-6">
          Manage your professional certifications and credentials.
        </p>
      </div>

      {/* Add New Certification */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add New Certification
        </h3>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="certName"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Certification Name *
            </Label>
            <Input
              id="certName"
              value={newCertification.name}
              onChange={(e) =>
                setNewCertification((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="e.g., Certified Electrician"
            />
          </div>

          <div>
            <Label
              htmlFor="issuingOrg"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Issuing Organization
            </Label>
            <Input
              id="issuingOrg"
              value={newCertification.issuingOrganization}
              onChange={(e) =>
                setNewCertification((prev) => ({
                  ...prev,
                  issuingOrganization: e.target.value,
                }))
              }
              placeholder="e.g., National Certification Board"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="issueDate"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Issue Date
              </Label>
              <Input
                id="issueDate"
                type="date"
                value={newCertification.issueDate}
                onChange={(e) =>
                  setNewCertification((prev) => ({
                    ...prev,
                    issueDate: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label
                htmlFor="expirationDate"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Expiration Date
              </Label>
              <Input
                id="expirationDate"
                type="date"
                value={newCertification.expirationDate}
                onChange={(e) =>
                  setNewCertification((prev) => ({
                    ...prev,
                    expirationDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              Certificate Document
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleNewCertificateUpload}
                disabled={uploading}
                className="max-w-xs"
              />
              {uploading && <span className="text-sm">Uploading...</span>}
              {newCertification.certificateUrl && (
                <a
                  href={newCertification.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Certificate
                </a>
              )}
            </div>
          </div>

          <Button onClick={handleAddCertification} disabled={loading || uploading}>
            {loading ? "Adding..." : "Add Certification"}
          </Button>
        </div>
      </div>

      {/* Existing Certifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Certifications
        </h3>
        {certifications.length === 0 ? (
          <p className="text-gray-500">No certifications added yet.</p>
        ) : (
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                      Certification Name
                    </Label>
                    <Input
                      value={cert.name}
                      onChange={(e) =>
                        handleUpdateCertification(index, {
                          name: e.target.value,
                        })
                      }
                      placeholder="Certification name"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                      Issuing Organization
                    </Label>
                    <Input
                      value={cert.issuingOrganization}
                      onChange={(e) =>
                        handleUpdateCertification(index, {
                          issuingOrganization: e.target.value,
                        })
                      }
                      placeholder="Issuing organization"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                      Issue Date
                    </Label>
                    <Input
                      type="date"
                      value={cert.issueDate || ""}
                      onChange={(e) =>
                        handleUpdateCertification(index, {
                          issueDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                      Expiration Date
                    </Label>
                    <Input
                      type="date"
                      value={cert.expirationDate || ""}
                      onChange={(e) =>
                        handleUpdateCertification(index, {
                          expirationDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Certificate Document
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleCertificateUpload(e, index)}
                      disabled={uploading}
                      className="max-w-xs"
                    />
                    {uploading && <span className="text-sm">Uploading...</span>}
                    {cert.certificateUrl && (
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Certificate
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteCertification(index)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}