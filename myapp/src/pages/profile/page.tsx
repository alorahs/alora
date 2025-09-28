import { useState, useEffect } from "react";
import { useAuth, API_URL } from "@/context/auth_provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  CreditCard,
  Shield,
  Globe,
  Bell,
  Trash2,
  HelpCircle,
  Eye,
  FileText,
  Upload,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  profilePicture?: string;
  category?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("personal-data");
  const [profileData, setProfileData] = useState<UserProfile>({
    fullName: "",
    email: "",
    phone: "",
    profilePicture: "",
    category: "",
    bio: "",
    skills: [],
    hourlyRate: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingProfilePictureFile, setPendingProfilePictureFile] =
    useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        profilePicture: user.profilePicture || "",
        category: user.category || "",
        bio: user.bio || "",
        skills: user.skills || [],
        hourlyRate: user.hourlyRate || 0,
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]:
        field === "hourlyRate" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // First, handle any pending profile picture upload
      let finalProfilePicture = profileData.profilePicture;

      // If there's a new profile picture file to upload
      if (pendingProfilePictureFile) {
        const formData = new FormData();
        formData.append("file", pendingProfilePictureFile);
        if (user.profilePicture) {
          fetch(`${API_URL}/files/${user.profilePicture}`, {
            method: "DELETE",
            credentials: "include",
          });
        }
        const uploadResponse = await fetch(`${API_URL}/files`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload profile picture");
        }

        const uploadResult = await uploadResponse.json();
        finalProfilePicture = uploadResult.file._id;
      }

      // Update user profile with all data including the new file ID
      const response = await fetch(`${API_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profileData,
          profilePicture: finalProfilePicture,
        }),
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setIsEditing(false);
        setPendingProfilePictureFile(null);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    {
      category: "Personal Info",
      items: [
        {
          id: "personal-data",
          label: "Personal Data",
          icon: User,
          active: true,
        },
        { id: "payment-account", label: "Payment Account", icon: CreditCard },
        { id: "account-security", label: "Account Security", icon: Shield },
      ],
    },
    {
      category: "General",
      items: [
        { id: "languages", label: "Languages", icon: Globe },
        { id: "push-notification", label: "Push Notification", icon: Bell },
        { id: "clear-cache", label: "Clear Cache", icon: Trash2 },
      ],
    },
    {
      category: "Support",
      items: [
        { id: "help-center", label: "Help Center", icon: HelpCircle },
        { id: "privacy-policy", label: "Privacy & Policy", icon: Eye },
        { id: "about-app", label: "About App", icon: Settings },
        { id: "terms-conditions", label: "Terms & Conditions", icon: FileText },
      ],
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p className="text-center">Please log in to view your profile.</p>
            <div className="mt-4 text-center">
              <Button asChild>
                <Link to="/auth/login">Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  const handleOnSubmitProfilePicture = async () => {
    // Create a file input element and trigger click
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      console.log("file", file);
      if (file) {
        // Check file size (15MB limit)
        if (file.size > 15 * 1024 * 1024) {
          toast({
            title: "Error",
            description: "File size must be under 15MB",
            variant: "destructive",
          });
          return;
        }

        // If in editing mode, store the file for later upload when saving
        if (isEditing) {
          setPendingProfilePictureFile(file);
          // Create preview URL
          const previewUrl = URL.createObjectURL(file);
          setPreviewImageUrl(previewUrl);

          toast({
            title: "Image Selected",
            description: "Image will be uploaded when you save changes",
          });
        } else {
          // If not in editing mode, upload immediately
          try {
            setLoading(true);

            // Create FormData for file upload
            const formData = new FormData();
            formData.append("file", file); // ✅ Synchronous — no `await` here

            console.log("formData", formData);
            for (const [key, value] of formData.entries()) {
              console.log(`${key}:`, value);
            }

            // Upload file to backend using file route
            const uploadResponse = await fetch(`${API_URL}/files`, {
              method: "POST",
              credentials: "include",
              body: formData,
            });

            if (!uploadResponse.ok) {
              throw new Error("Failed to upload file");
            }

            const uploadResult = await uploadResponse.json();
            const fileId = uploadResult.file._id;

            // Update user profile with file ID
            const updateResponse = await fetch(`${API_URL}/user`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                ...profileData,
                profilePicture: fileId,
              }),
            });

            if (!updateResponse.ok) {
              throw new Error("Failed to update profile");
            }

            // Update local state
            handleInputChange("profilePicture", fileId);

            toast({
              title: "Success",
              description: "Profile picture updated successfully",
            });
          } catch (error) {
            console.error("Upload error:", error);
            toast({
              title: "Error",
              description:
                "Failed to upload profile picture. Please try again.",
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }
        }
      }
    };
    fileInput.click();
  };

  const handleDeleteProfilePicture = async () => {
    if (!profileData.profilePicture) return;

    try {
      setLoading(true);

      // Delete file from backend
      const deleteResponse = await fetch(`${API_URL}/files/${profileData.profilePicture}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!deleteResponse.ok) {
        throw new Error("Failed to delete file");
      }

      // Update user profile to remove profile picture
      const updateResponse = await fetch(`${API_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...profileData,
          profilePicture: null,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update profile");
      }

      // Clear the profile picture locally
      handleInputChange("profilePicture", "");

      toast({
        title: "Success",
        description: "Profile picture deleted successfully",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const renderPersonalDataSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal data</h2>
        <p className="text-gray-600 mb-6">
          Real-time information and activities of your prototype.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Picture Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Data
          </h3>

          <div className="flex items-center space-x-6 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={
                  previewImageUrl ||
                  (profileData.profilePicture
                    ? `${API_URL}/files/${profileData.profilePicture}`
                    : undefined)
                }
                alt="Profile"
              />
              <AvatarFallback className="text-lg">
                {profileData.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Profile picture
                  </h4>
                  <p className="text-sm text-gray-500">PNG, JPEG under 15MB</p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleOnSubmitProfilePicture();
                    }}
                    disabled={!isEditing && !loading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {loading
                      ? "Uploading..."
                      : pendingProfilePictureFile
                      ? "Change Picture"
                      : isEditing
                      ? "Select Picture"
                      : "Upload new picture"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={handleDeleteProfilePicture}
                    disabled={!isEditing}
                  >
                    {!isEditing && loading ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              First name
            </Label>
            <Input
              id="firstName"
              value={profileData.fullName.split(" ")[0] || ""}
              onChange={(e) => {
                const lastName = profileData.fullName
                  .split(" ")
                  .slice(1)
                  .join(" ");
                handleInputChange(
                  "fullName",
                  `${e.target.value} ${lastName}`.trim()
                );
              }}
              disabled={!isEditing}
              className="w-full"
            />
          </div>

          <div>
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Last name
            </Label>
            <Input
              id="lastName"
              value={profileData.fullName.split(" ").slice(1).join(" ") || ""}
              onChange={(e) => {
                const firstName = profileData.fullName.split(" ")[0] || "";
                handleInputChange(
                  "fullName",
                  `${firstName} ${e.target.value}`.trim()
                );
              }}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
        </div>

        {/* Contact Email Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Contact email
          </h3>
          <p className="text-gray-600 mb-4">
            Allows for accurate identification and communication with you.
          </p>

          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              className="w-full max-w-md"
            />
          </div>
        </div>

        {/* Phone Number Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Phone number
          </h3>
          <p className="text-gray-600 mb-4">
            The phone number is an important data field that helps identify and
            directly communicate with an individual.
          </p>

          <div>
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Phone number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
              className="w-full max-w-md"
              placeholder="(+1) (409) 124-1241"
            />
          </div>
        </div>

        {/* Professional Work Section */}
        {user && user.role === "professional" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Professional Information
            </h3>
            <p className="text-gray-600 mb-4">
              Your professional details and services you provide.
            </p>

            <div className="space-y-6">
              {/* Work Category */}
              <div>
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Work Category
                </Label>
                <Select
                  value={profileData.category || ""}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder="Select your profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="carpentry">Carpentry</SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bio/Description */}
              <div>
                <Label
                  htmlFor="bio"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Professional Bio
                </Label>
                <Textarea
                  id="bio"
                  value={profileData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                  placeholder="Describe your experience, expertise, and services..."
                  rows={4}
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <Label
                  htmlFor="hourlyRate"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Hourly Rate (₹)
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={profileData.hourlyRate || ""}
                  onChange={(e) =>
                    handleInputChange("hourlyRate", e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full max-w-md"
                  placeholder="Enter your hourly rate"
                  min="0"
                />
              </div>

              {/* Skills */}
              <div>
                <Label
                  htmlFor="skills"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Skills & Expertise
                </Label>
                <Input
                  id="skills"
                  value={profileData.skills?.join(", ") || ""}
                  onChange={(e) => {
                    const skillsArray = e.target.value
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter((skill) => skill.length > 0);
                    setProfileData((prev) => ({
                      ...prev,
                      skills: skillsArray,
                    }));
                  }}
                  disabled={!isEditing}
                  className="w-full"
                  placeholder="Enter skills separated by commas (e.g., Pipe Installation, Leak Repair, Emergency Services)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple skills with commas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6">
          {isEditing ? (
            <>
              <Button
                onClick={handleSaveChanges}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setPendingProfilePictureFile(null);
                  setPreviewImageUrl("");
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderPlaceholderSection = (title: string) => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">This section is coming soon.</p>
      </div>

      <Card className="p-8 text-center">
        <CardContent>
          <div className="text-gray-400 mb-4">
            <Settings className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Feature Coming Soon
          </h3>
          <p className="text-gray-600">
            We're working on this feature. It will be available in a future
            update.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "personal-data":
        return renderPersonalDataSection();
      case "payment-account":
        return renderPlaceholderSection("Payment Account");
      case "account-security":
        return renderPlaceholderSection("Account Security");
      case "languages":
        return renderPlaceholderSection("Languages");
      case "push-notification":
        return renderPlaceholderSection("Push Notifications");
      case "clear-cache":
        return renderPlaceholderSection("Clear Cache");
      case "help-center":
        return renderPlaceholderSection("Help Center");
      case "privacy-policy":
        return renderPlaceholderSection("Privacy & Policy");
      case "about-app":
        return renderPlaceholderSection("About App");
      case "terms-conditions":
        return renderPlaceholderSection("Terms & Conditions");
      default:
        return renderPersonalDataSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 bg-white rounded-lg shadow-sm p-6 h-fit">
            <div className="space-y-6">
              {sidebarItems.map((category) => (
                <div key={category.category}>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    {category.category}
                  </h3>
                  <nav className="space-y-1">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                          {item.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
