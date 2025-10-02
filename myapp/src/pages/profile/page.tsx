import { useState, useEffect } from "react";
import { useAuth, API_URL } from "@/context/auth_provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Heart,
  Star,
  Phone,
  Mail,
  Calendar,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  PersonalDataSection,
  FavoritesSection,
  BookingsSection,
  PlaceholderSection,
} from "./index";

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

interface Favorite {
  _id: string;
  professional: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    category: string;
    rating: number;
    profilePicture?: string;
    hourlyRate?: number;
  };
  createdAt: string;
}

interface Booking {
  _id: string;
  service: string;
  professional: {
    _id: string;
    fullName: string;
    category: string;
  };
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  rating?: number;
  review?: string;
  createdAt: string;
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
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Fetch user's favorites
  const fetchFavorites = async () => {
    if (!user) return;

    setFavoritesLoading(true);
    try {
      const response = await fetch(`${API_URL}/favorite`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      } else {
        throw new Error("Failed to fetch favorites");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast({
        title: "Error",
        description: "Failed to load your favorites",
        variant: "destructive",
      });
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Fetch user's bookings
  const fetchBookings = async () => {
    if (!user) return;

    setBookingsLoading(true);
    try {
      const response = await fetch(`${API_URL}/booking`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        throw new Error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load your bookings",
        variant: "destructive",
      });
    } finally {
      setBookingsLoading(false);
    }
  };

  // Fetch data when sections are active
  useEffect(() => {
    if (activeSection === "favorites" && user) {
      fetchFavorites();
    } else if (activeSection === "bookings" && user) {
      fetchBookings();
    }
  }, [activeSection, user]);

  // Remove from favorites
  const handleRemoveFavorite = async (professionalId: string) => {
    try {
      const response = await fetch(`${API_URL}/favorite/${professionalId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setFavorites(
          favorites.filter((fav) => fav.professional._id !== professionalId)
        );
        toast({
          title: "Success",
          description: "Removed from favorites",
        });
      } else {
        throw new Error("Failed to remove from favorites");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    }
  };

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
        { id: "bookings", label: "My Bookings", icon: Calendar },
        { id: "favorites", label: "My Favorites", icon: Heart },
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
      const deleteResponse = await fetch(
        `${API_URL}/files/${profileData.profilePicture}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

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
    <PersonalDataSection
      profileData={profileData}
      isEditing={isEditing}
      loading={loading}
      pendingProfilePictureFile={pendingProfilePictureFile}
      previewImageUrl={previewImageUrl}
      API_URL={API_URL}
      handleInputChange={handleInputChange}
      setIsEditing={setIsEditing}
      setPendingProfilePictureFile={setPendingProfilePictureFile}
      setPreviewImageUrl={setPreviewImageUrl}
      handleSaveChanges={handleSaveChanges}
      handleOnSubmitProfilePicture={handleOnSubmitProfilePicture}
      handleDeleteProfilePicture={handleDeleteProfilePicture}
      user={user}
    />
  );

  const renderPlaceholderSection = (title: string) => (
    <PlaceholderSection title={title} />
  );

  const renderContent = () => {
    switch (activeSection) {
      case "personal-data":
        return renderPersonalDataSection();
      case "favorites":
        return (
          <FavoritesSection
            favorites={favorites}
            favoritesLoading={favoritesLoading}
            handleRemoveFavorite={handleRemoveFavorite}
            API_URL={API_URL}
          />
        );
      case "bookings":
        return (
          <BookingsSection
            bookings={bookings}
            bookingsLoading={bookingsLoading}
            API_URL={API_URL}
          />
        );
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile: Collapsible sidebar */}
        <div className="lg:hidden mb-4">
          <div className="bg-white rounded-lg shadow-sm">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-between w-full p-4 sm:p-6 cursor-pointer"
            >
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-900">Profile Menu</span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  mobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobileMenuOpen && (
              <div className="px-4 pb-4 sm:px-6 sm:pb-6 border-t border-gray-200">
                <div className="space-y-6">
                  {sidebarItems.map((category) => (
                    <div key={category.category}>
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        {category.category}
                      </h3>
                      <nav className="space-y-1">
                        {category.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeSection === item.id;

                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveSection(item.id);
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                isActive
                                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </button>
                          );
                        })}
                      </nav>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Desktop: Sidebar always visible */}
          <div className="hidden lg:block lg:w-80 bg-white rounded-lg shadow-sm p-6 h-fit">
            <div className="space-y-6">
              {sidebarItems.map((category) => (
                <div key={category.category}>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
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
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
