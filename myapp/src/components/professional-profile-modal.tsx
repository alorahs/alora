"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Img } from "react-image";
import { useAuth, API_URL } from "../context/auth_provider";
import { useToast } from "../hooks/use-toast";
import {
  Heart,
  Star,
  Phone,
  Mail,
  Calendar,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
} from "lucide-react";
import { User } from "../interfaces/user";
import { useParams, useNavigate } from "react-router-dom";

// Close Icon
const XIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Sample fallback data
const sampleReviews = [
  {
    id: 1,
    name: "Sarah Chen",
    rating: 5,
    comment:
      "Alex did an outstanding job with our bathroom remodel. Professional, timely, and the quality of work exceeded our expectations. Highly recommend!",
    date: "May 15, 2024",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Mark T. (Homeowner)",
    rating: 4,
    comment:
      "Needed a tricky electrical repair. Alex was knowledgeable and fixed it quickly. A bit pricey but worth it for the peace of mind.",
    date: "April 28, 2024",
    avatar: "/placeholder.svg",
  },
];

const availabilitySchedule = [
  { day: "Monday", slots: "9:00 AM - 5:00 PM" },
  { day: "Tuesday", slots: "9:00 AM - 5:00 PM" },
  { day: "Wednesday", slots: "9:00 AM - 1:00 PM" },
  { day: "Thursday", slots: "9:00 AM - 5:00 PM" },
  { day: "Friday", slots: "9:00 AM - 3:00 PM" },
  { day: "Saturday", slots: "Unavailable" },
  { day: "Sunday", slots: "Unavailable" },
];

const workGallery = [
  { id: 1, title: "Modern Bathroom Renovation", image: "/placeholder.svg" },
  {
    id: 2,
    title: "Custom Kitchen Cabinet Installation",
    image: "/placeholder.svg",
  },
  { id: 3, title: "Outdoor Deck Repair & Staining", image: "/placeholder.svg" },
];

const keySkills = [
  "Electrical Troubleshooting",
  "Plumbing Repair",
  "Carpentry & Woodwork",
  "Drywall Installation",
];

export default function ProfessionalProfileModal() {
  const [professional, setProfessional] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch professional if not passed via props
  useEffect(() => {
    const fetchProfessional = async () => {
      if (!id) return;
      try {
        const response = user
          ? await fetch(`${API_URL}/user/${id}`, { credentials: "include" })
          : await fetch(`${API_URL}/_/users/${id}`);
        if (!response.ok) {
          const data = await response.json();
          toast({
            title: "Error",
            description: data.message || "Failed to load professional.",
            variant: "destructive",
          });
          return;
        }
        const data = await response.json();
        console.log("Fetched professional:", data);
        setProfessional({ ...data });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load professional.",
          variant: "destructive",
        });
      }
    };
    fetchProfessional();
  }, [id, toast]);

  // Check if professional is favorited
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !professional?._id) return;
      try {
        const response = await fetch(
          `${API_URL}/favorite/${professional._id}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setIsFavorited(data.isFavorited);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
    checkFavoriteStatus();
  }, [user, professional?._id]);

  // Toggle favorite status
  const handleFavoriteToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add favorites.",
        variant: "destructive",
      });
      return;
    }

    if (!professional?._id) return;

    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(
          `${API_URL}/favorite/${professional._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (response.ok) {
          setIsFavorited(false);
          toast({
            title: "Success",
            description: "Removed from favorites",
          });
        } else {
          throw new Error("Failed to remove from favorites");
        }
      } else {
        // Add to favorites
        const response = await fetch(`${API_URL}/favorite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ professionalId: professional._id }),
          credentials: "include",
        });
        if (response.ok) {
          setIsFavorited(true);
          toast({
            title: "Success",
            description: "Added to favorites",
          });
        } else {
          const data = await response.json();
          throw new Error(data.message || "Failed to add to favorites");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Booking Handler
  const handleBookNow = () => {
    navigate(`/booking/${professional._id}`);
  };

  if (!professional) return null;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "gallery", label: "Gallery" },
    { id: "reviews", label: "Reviews" },
    { id: "contact", label: "Contact" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">
          {professional.fullName}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b shadow-sm">
          <div className="px-4 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar Navigation */}
        <div className="hidden lg:block bg-white shadow-sm border-r h-screen sticky top-0 z-10 w-64 flex-shrink-0">
          <div className="flex flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium text-left transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? "text-blue-600 bg-blue-50 border-r-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="p-4 sm:p-6 max-w-4xl mx-auto">
              {/* Professional Header */}
              <div className="bg-white rounded-lg p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <Img
                    src={professional.profilePicture || "/placeholder.svg"}
                    alt={professional.fullName}
                    width={80}
                    height={80}
                    className="rounded-full w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
                  />
                  <div className="text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      {professional.fullName}
                    </h1>
                    <p className="text-gray-600 mb-2">
                      @{professional.username || "pro_user"}
                    </p>
                    <p className="text-lg font-semibold text-blue-600 mb-3">
                      {professional.role || "Professional"}
                    </p>
                    {professional.hourlyRate && (
                      <p className="text-lg font-bold text-green-600 mb-3">
                        ₹{professional.hourlyRate}/hr
                      </p>
                    )}
                    <div className="inline-block bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                      {professional.category || "General Services"}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleBookNow}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Calendar className="h-4 w-4 mr-2" /> Book Now
                      </Button>
                      <Button
                        variant={isFavorited ? "default" : "outline"}
                        size="default"
                        onClick={handleFavoriteToggle}
                        disabled={favoriteLoading}
                        className={
                          isFavorited
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : ""
                        }
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 ${
                            isFavorited ? "fill-current" : ""
                          }`}
                        />
                        {favoriteLoading
                          ? "Loading..."
                          : isFavorited
                          ? "Remove from Favorites"
                          : "Add to Favorites"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Skills */}
              <div className="bg-white rounded-lg p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Key Skills
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {keySkills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm text-center"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability Schedule */}
              <div className="bg-white rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Availability Schedule
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[300px]">
                    <tbody>
                      {availabilitySchedule.map((schedule, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-2 sm:px-4 text-sm font-medium text-gray-900">
                            {schedule.day}
                          </td>
                          <td className="py-2 px-2 sm:px-4 text-sm text-gray-700">
                            {schedule.slots}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {workGallery.map((work) => (
                  <div key={work.id} className="group">
                    <div className="aspect-square relative rounded-lg overflow-hidden mb-3">
                      <Img
                        src={work.image}
                        alt={work.title}
                        className="object-cover hover:scale-105 transition-transform duration-300 w-full h-full"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {work.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
              {sampleReviews.map((review) => (
                <div key={review.id} className="flex gap-3 sm:gap-4">
                  <Img
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    width={40}
                    height={40}
                    className="rounded-full w-10 h-10 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{review.name}</h4>
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mb-1">
                      {review.comment}
                    </p>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "contact" && (
            <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm sm:text-base break-all">
                  {professional.phone || "+1 (555) 123-4567"}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm sm:text-base break-all">
                  {professional.email || "example@email.com"}
                </span>
              </div>
              <Button
                onClick={handleBookNow}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                <Calendar className="h-4 w-4 mr-2" /> Book Now
              </Button>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">
                    Manage your notification preferences
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Configure
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Privacy</h3>
                  <p className="text-sm text-gray-600">
                    Control your privacy settings
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Manage
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
