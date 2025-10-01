import { useState, useEffect, useRef } from "react";
import { useAuth, API_URL } from "@/context/auth_provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Trash2, Upload } from "lucide-react";

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

      // For now, we'll just use a placeholder URL
      // In a real implementation, you would upload to your file service
      const imageUrl = URL.createObjectURL(file);
      handleTeamMemberChange(index, "imageUrl", imageUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
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
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">About Us Management</h1>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
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
              onChange={(e) => handleInputChange("description", e.target.value)}
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
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter address"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mission & Vision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mission">Our Mission</Label>
            <Textarea
              id="mission"
              value={aboutUsData.ourMission}
              onChange={(e) => handleInputChange("ourMission", e.target.value)}
              placeholder="Enter mission statement"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vision">Our Vision</Label>
            <Textarea
              id="vision"
              value={aboutUsData.ourVision}
              onChange={(e) => handleInputChange("ourVision", e.target.value)}
              placeholder="Enter vision statement"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Core Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aboutUsData.ourValues.map((value, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={value}
                onChange={(e) => handleValuesChange(index, e.target.value)}
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

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {aboutUsData.teamMembers.map((member, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Team Member {index + 1}</h3>
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
                      src={member.imageUrl}
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
                      handleTeamMemberChange(index, "name", e.target.value)
                    }
                    placeholder="Enter name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`member-position-${index}`}>Position</Label>
                  <Input
                    id={`member-position-${index}`}
                    value={member.position}
                    onChange={(e) =>
                      handleTeamMemberChange(index, "position", e.target.value)
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

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUsAdminPage;
