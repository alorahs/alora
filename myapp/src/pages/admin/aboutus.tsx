import { useState, useEffect, useRef } from "react";
import { useAuth, API_URL } from "@/context/auth_provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Save, Trash2, Upload, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  imageUrl?: string;
}

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

interface AboutUsData {
  _id?: string;
  title: string;
  description: string;
  ourMission: string;
  ourVision: string;
  ourValues: string[];
  teamMembers: TeamMember[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: SocialLinks;
}

const AboutUsAdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [aboutUsData, setAboutUsData] = useState<AboutUsData>({
    title: "",
    description: "",
    ourMission: "",
    ourVision: "",
    ourValues: [""],
    teamMembers: [{ name: "", position: "", bio: "", imageUrl: "" }],
    contactEmail: "",
    contactPhone: "",
    address: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetchAboutUsData();
  }, []);

  const fetchAboutUsData = async () => {
    try {
      const response = await fetch(`${API_URL}/aboutus`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAboutUsData(data);
      } else if (response.status === 404) {
        // Initialize with default data
        await initializeAboutUsData();
      }
    } catch (error) {
      console.error("Error fetching About Us data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch About Us data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeAboutUsData = async () => {
    try {
      const response = await fetch(`${API_URL}/aboutus/initialize`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAboutUsData(data);
        toast({
          title: "Success",
          description: "About Us data initialized successfully",
        });
      }
    } catch (error) {
      console.error("Error initializing About Us data:", error);
      toast({
        title: "Error",
        description: "Failed to initialize About Us data",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = aboutUsData._id
        ? `${API_URL}/aboutus/${aboutUsData._id}`
        : `${API_URL}/aboutus`;

      const method = aboutUsData._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aboutUsData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAboutUsData(data);
        toast({
          title: "Success",
          description: "About Us data saved successfully",
        });
      } else {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving About Us data:", error);
      toast({
        title: "Error",
        description: "Failed to save About Us data",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof AboutUsData, value: any) => {
    setAboutUsData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialLinksChange = (field: keyof SocialLinks, value: string) => {
    setAboutUsData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value },
    }));
  };

  const handleValuesChange = (index: number, value: string) => {
    const newValues = [...aboutUsData.ourValues];
    newValues[index] = value;
    handleInputChange("ourValues", newValues);
  };

  const addValue = () => {
    handleInputChange("ourValues", [...aboutUsData.ourValues, ""]);
  };

  const removeValue = (index: number) => {
    const newValues = aboutUsData.ourValues.filter((_, i) => i !== index);
    handleInputChange("ourValues", newValues);
  };

  const handleTeamMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const newTeamMembers = [...aboutUsData.teamMembers];
    newTeamMembers[index] = { ...newTeamMembers[index], [field]: value };
    handleInputChange("teamMembers", newTeamMembers);
  };

  const addTeamMember = () => {
    handleInputChange("teamMembers", [
      ...aboutUsData.teamMembers,
      { name: "", position: "", bio: "", imageUrl: "" },
    ]);
  };

  const removeTeamMember = (index: number) => {
    const newTeamMembers = aboutUsData.teamMembers.filter(
      (_, i) => i !== index
    );
    handleInputChange("teamMembers", newTeamMembers);
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload file to backend
      const response = await fetch(`${API_URL}/files`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        // Store the file ID instead of the temporary URL
        handleTeamMemberChange(index, "imageUrl", result.file._id);

        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const triggerFileInput = (index: number) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]?.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/admin")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              About Us Management
            </h1>
            <p className="text-gray-600">Loading content...</p>
          </div>
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/admin")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              About Us Management
            </h1>
          </div>
          <Card className="p-6">
            <CardContent>
              <p className="text-center text-red-600">
                Access Denied: Admin privileges required
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/admin")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              About Us Management
            </h1>
            <p className="text-gray-600">
              Manage your company's about page content
            </p>
          </div>

          <div className="flex gap-2">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>About Us Page Preview</DialogTitle>
                  <DialogDescription>
                    This is how your about page will look to visitors
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {aboutUsData.title || "Our Company"}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {aboutUsData.description ||
                        "Company description will appear here"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Our Mission</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          {aboutUsData.ourMission ||
                            "Mission statement will appear here"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Our Vision</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          {aboutUsData.ourVision ||
                            "Vision statement will appear here"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Core Values</h3>
                    <div className="flex flex-wrap gap-2">
                      {aboutUsData.ourValues.map(
                        (value, index) =>
                          value && (
                            <Badge key={index} variant="secondary">
                              {value}
                            </Badge>
                          )
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Meet Our Team
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {aboutUsData.teamMembers.map(
                        (member, index) =>
                          member.name && (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-4">
                                  {member.imageUrl ? (
                                    <img
                                      src={`${API_URL}/files/${member.imageUrl}`}
                                      alt={member.name}
                                      className="w-16 h-16 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-500 text-2xl">
                                        👤
                                      </span>
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-semibold">
                                      {member.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {member.position}
                                    </p>
                                  </div>
                                </div>
                                <p className="mt-3 text-sm text-gray-700">
                                  {member.bio}
                                </p>
                              </CardContent>
                            </Card>
                          )
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSave} disabled={saving} size="sm">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="mission">Mission & Vision</TabsTrigger>
            <TabsTrigger value="values">Core Values</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-5 mt-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={aboutUsData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter page title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={aboutUsData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter description"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      value={aboutUsData.contactEmail}
                      onChange={(e) =>
                        handleInputChange("contactEmail", e.target.value)
                      }
                      placeholder="Enter contact email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={aboutUsData.contactPhone}
                      onChange={(e) =>
                        handleInputChange("contactPhone", e.target.value)
                      }
                      placeholder="Enter contact phone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={aboutUsData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter address"
                  />
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-3">
                    Social Media Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={aboutUsData.socialLinks.facebook || ""}
                        onChange={(e) =>
                          handleSocialLinksChange("facebook", e.target.value)
                        }
                        placeholder="Enter Facebook URL"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={aboutUsData.socialLinks.twitter || ""}
                        onChange={(e) =>
                          handleSocialLinksChange("twitter", e.target.value)
                        }
                        placeholder="Enter Twitter URL"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={aboutUsData.socialLinks.instagram || ""}
                        onChange={(e) =>
                          handleSocialLinksChange("instagram", e.target.value)
                        }
                        placeholder="Enter Instagram URL"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={aboutUsData.socialLinks.linkedin || ""}
                        onChange={(e) =>
                          handleSocialLinksChange("linkedin", e.target.value)
                        }
                        placeholder="Enter LinkedIn URL"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mission" className="space-y-5 mt-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Mission & Vision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="mission">Our Mission</Label>
                  <Textarea
                    id="mission"
                    value={aboutUsData.ourMission}
                    onChange={(e) =>
                      handleInputChange("ourMission", e.target.value)
                    }
                    placeholder="Enter mission statement"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vision">Our Vision</Label>
                  <Textarea
                    id="vision"
                    value={aboutUsData.ourVision}
                    onChange={(e) =>
                      handleInputChange("ourVision", e.target.value)
                    }
                    placeholder="Enter vision statement"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="values" className="space-y-5 mt-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Core Values</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aboutUsData.ourValues.map((value, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={value}
                      onChange={(e) =>
                        handleValuesChange(index, e.target.value)
                      }
                      placeholder={`Value ${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeValue(index)}
                      disabled={aboutUsData.ourValues.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={addValue} variant="outline" className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Value
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-5 mt-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Team Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {aboutUsData.teamMembers.map((member, index) => (
                  <div key={index} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">
                        Team Member {index + 1}
                      </h3>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeTeamMember(index)}
                        disabled={aboutUsData.teamMembers.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Image Upload Section */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {member.imageUrl ? (
                          <img
                            src={`${API_URL}/files/${member.imageUrl}`}
                            alt={member.name || "Team Member"}
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          ref={(el) => (fileInputRefs.current[index] = el)}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(index, e.target.files[0]);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => triggerFileInput(index)}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        {member.imageUrl && (
                          <Button
                            variant="outline"
                            className="ml-2"
                            onClick={() =>
                              handleTeamMemberChange(index, "imageUrl", "")
                            }
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`member-name-${index}`}>Name</Label>
                        <Input
                          id={`member-name-${index}`}
                          value={member.name}
                          onChange={(e) =>
                            handleTeamMemberChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Enter name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`member-position-${index}`}>
                          Position
                        </Label>
                        <Input
                          id={`member-position-${index}`}
                          value={member.position}
                          onChange={(e) =>
                            handleTeamMemberChange(
                              index,
                              "position",
                              e.target.value
                            )
                          }
                          placeholder="Enter position"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`member-bio-${index}`}>Bio</Label>
                      <Textarea
                        id={`member-bio-${index}`}
                        value={member.bio}
                        onChange={(e) =>
                          handleTeamMemberChange(index, "bio", e.target.value)
                        }
                        placeholder="Enter bio"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <Button onClick={addTeamMember} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AboutUsAdminPage;
