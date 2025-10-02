import { useState, useEffect } from "react";
import { useAuth, API_URL } from "@/context/auth_provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  MessageSquare,
  Star,
  BarChart3,
  Edit,
  Trash2,
  Plus,
  Briefcase,
  Mail,
  Eye,
  Calendar,
  Filter,
  BookOpen,
  MessageCircle,
  MailOpen,
} from "lucide-react";

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  phone: string;
  isActive: boolean;
  category?: string;
  createdAt: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category?: string;
  createdAt: string;
}

interface ServiceCategory {
  name: string;
  services: string[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    name: "All Services",
    services: [],
  },
  {
    name: "Home Repair",
    services: [
      "Plumber",
      "Electrician",
      "Appliance Repair",
      "Fixture Installation",
    ],
  },
  {
    name: "Tech Support",
    services: ["Technical", "Network Setup"],
  },
  {
    name: "Cleaning",
    services: ["Deep Cleaning", "Window Cleaning"],
  },
  {
    name: "Electrical",
    services: ["Electrician", "Fixture Installation"],
  },
  {
    name: "Plumbing",
    services: ["Plumber"],
  },
];

const PREDEFINED_COLORS = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Red", value: "#EF4444" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Orange", value: "#F97316" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Emerald", value: "#059669" },
  { name: "Rose", value: "#F43F5E" },
];

const PREDEFINED_ICONS = [
  { name: "Plumbing", value: "🔧", category: "Home Repair" },
  { name: "Electrical", value: "⚡", category: "Electrical" },
  { name: "Wrench", value: "🔨", category: "Home Repair" },
  { name: "Hammer", value: "🔨", category: "Home Repair" },
  { name: "Screwdriver", value: "🪛", category: "Home Repair" },
  { name: "Cleaning", value: "🧽", category: "Cleaning" },
  { name: "Vacuum", value: "🧹", category: "Cleaning" },
  { name: "Spray", value: "🧴", category: "Cleaning" },
  { name: "Computer", value: "💻", category: "Tech Support" },
  { name: "Phone", value: "📱", category: "Tech Support" },
  { name: "WiFi", value: "📶", category: "Tech Support" },
  { name: "Tools", value: "🛠️", category: "Home Repair" },
  { name: "Paint", value: "🎨", category: "Home Repair" },
  { name: "Brush", value: "🖌️", category: "Home Repair" },
  { name: "Lightbulb", value: "💡", category: "Electrical" },
  { name: "Plug", value: "🔌", category: "Electrical" },
  { name: "House", value: "🏠", category: "Home Repair" },
  { name: "Building", value: "🏗️", category: "Home Repair" },
  { name: "Gear", value: "⚙️", category: "Tech Support" },
  { name: "Shield", value: "🛡️", category: "Tech Support" },
  { name: "Key", value: "🔑", category: "Home Repair" },
  { name: "Lock", value: "🔒", category: "Home Repair" },
  { name: "Water", value: "💧", category: "Plumbing" },
  { name: "Toilet", value: "🚽", category: "Plumbing" },
  { name: "Shower", value: "🚿", category: "Plumbing" },
];

interface FAQ {
  _id: string;
  type: string;
  question: string;
  answer: string;
  createdAt: string;
}

interface Feedback {
  _id: string;
  rating: number;
  subject: string;
  message: string;
  createdAt: string;
  user?: {
    fullName: string;
    username: string;
    email: string;
  };
}

interface ReachUs {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  user?: {
    fullName: string;
    username: string;
    email: string;
  };
}

interface Review {
  _id: string;
  reviewer: {
    _id: string;
    fullName: string;
    username: string;
  };
  reviewee: {
    _id: string;
    fullName: string;
    username: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

// Function to get icon emoji from icon name
const getIconEmoji = (iconName: string): string => {
  if (!iconName) return "📋"; // Default icon

  // Check if it's already an emoji
  if (/\p{Emoji}/u.test(iconName)) {
    return iconName;
  }

  // Find matching icon from predefined list
  const icon = PREDEFINED_ICONS.find(
    (predefined) =>
      predefined.name.toLowerCase() === iconName.toLowerCase() ||
      predefined.value === iconName
  );

  return icon ? icon.value : "📋"; // Return emoji or default
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for different sections
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [reachUsMessages, setReachUsMessages] = useState<ReachUs[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>({});

  // Loading states
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("All Services");

  // Dialog states
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [isEditFAQOpen, setIsEditFAQOpen] = useState(false);
  const [isEditFeedbackOpen, setIsEditFeedbackOpen] = useState(false);
  const [isEditReachUsOpen, setIsEditReachUsOpen] = useState(false);
  const [isEditReviewOpen, setIsEditReviewOpen] = useState(false);
  const [isViewReachUsOpen, setIsViewReachUsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Filter states for reach us
  const [reachUsFilter, setReachUsFilter] = useState<string>("all");
  const [reachUsSearchTerm, setReachUsSearchTerm] = useState<string>("");

  // Form states
  const [formData, setFormData] = useState<any>({});

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p className="text-center text-red-600">
              Access Denied: Admin privileges required
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch data functions
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`${API_URL}/faq`);
      if (response.ok) {
        const data = await response.json();
        setFAQs(data);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/feedback`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback || data);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const fetchReachUsMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/reachus`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setReachUsMessages(data);
      }
    } catch (error) {
      console.error("Error fetching reach us messages:", error);
    }
  };

  // Add fetchReviews function
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/review`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Fetch admin stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchServices();
    fetchFAQs();
    fetchFeedback();
    fetchReachUsMessages();
    fetchReviews();
    fetchStats();
  }, []);

  // CRUD Operations for Users
  const updateUser = async (userId: string, userData: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User updated successfully",
        });
        fetchUsers();
        setIsEditUserOpen(false);
      } else {
        throw new Error("Failed to update user");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        fetchUsers();
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations for Services
  const createService = async (serviceData: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Service created successfully",
        });
        fetchServices();
        setIsEditServiceOpen(false);
        setFormData({});
      } else {
        throw new Error("Failed to create service");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (serviceId: string, serviceData: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Service updated successfully",
        });
        fetchServices();
        setIsEditServiceOpen(false);
      } else {
        throw new Error("Failed to update service");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/services/${serviceId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
        fetchServices();
      } else {
        throw new Error("Failed to delete service");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations for FAQs
  const createFAQ = async (faqData: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/faq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(faqData),
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "FAQ created successfully",
        });
        fetchFAQs();
        setIsEditFAQOpen(false);
        setFormData({});
      } else {
        throw new Error("Failed to create FAQ");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create FAQ",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFAQ = async (faqId: string, faqData: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/faq/${faqId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(faqData),
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "FAQ updated successfully",
        });
        fetchFAQs();
        setIsEditFAQOpen(false);
      } else {
        throw new Error("Failed to update FAQ");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update FAQ",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFAQ = async (faqId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/faq/${faqId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "FAQ deleted successfully",
        });
        fetchFAQs();
      } else {
        throw new Error("Failed to delete FAQ");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations for Feedback
  const updateFeedback = async (feedbackId: string, feedbackData: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/feedback/${feedbackId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Feedback updated successfully",
        });
        fetchFeedback();
        setIsEditFeedbackOpen(false);
      } else {
        throw new Error(result.error || "Failed to update feedback");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update feedback",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (feedbackId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/feedback/${feedbackId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Feedback deleted successfully",
        });
        fetchFeedback();
      } else {
        throw new Error(result.error || "Failed to delete feedback");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete feedback",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations for Reach Us Messages
  const updateReachUsMessage = async (messageId: string, messageData: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/reachus/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Message updated successfully",
        });
        fetchReachUsMessages();
        setIsEditReachUsOpen(false);
      } else {
        throw new Error(result.error || "Failed to update message");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteReachUsMessage = async (messageId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/reachus/${messageId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Message deleted successfully",
        });
        fetchReachUsMessages();
      } else {
        throw new Error(result.error || "Failed to delete message");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations for Reviews
  const updateReview = async (reviewId: string, reviewData: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/review/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Review updated successfully",
        });
        fetchReviews();
        setIsEditReviewOpen(false);
      } else {
        throw new Error(result.message || "Failed to update review");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update review",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/review/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Review deleted successfully",
        });
        fetchReviews();
      } else {
        throw new Error(result.message || "Failed to delete review");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter reach us messages
  const filteredReachUsMessages = reachUsMessages.filter((message) => {
    const matchesSearch =
      message.fullName
        .toLowerCase()
        .includes(reachUsSearchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(reachUsSearchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(reachUsSearchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(reachUsSearchTerm.toLowerCase());

    if (reachUsFilter === "all") return matchesSearch;

    const messageDate = new Date(message.createdAt);
    const now = new Date();

    switch (reachUsFilter) {
      case "today":
        return (
          matchesSearch && messageDate.toDateString() === now.toDateString()
        );
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return matchesSearch && messageDate >= weekAgo;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return matchesSearch && messageDate >= monthAgo;
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your Alora platform</p>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button onClick={() => navigate("/admin/users")} variant="outline">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </Button>
            <Button
              onClick={() => navigate("/admin/services")}
              variant="outline"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Service Management
            </Button>
            <Button
              onClick={() => navigate("/admin/feedback")}
              variant="outline"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback Management
            </Button>
            <Button
              onClick={() => navigate("/admin/reachus")}
              variant="outline"
            >
              <Mail className="h-4 w-4 mr-2" />
              Reach Us Messages
            </Button>
            <Button
              onClick={() => navigate("/admin/rating-stats")}
              variant="outline"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Rating Statistics
            </Button>
            <Button
              onClick={() => navigate("/admin/booking-ratings")}
              variant="outline"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Booking Ratings
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="services">
              <Briefcase className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="faqs">
              <FileText className="h-4 w-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="reachus">
              <Mail className="h-4 w-4 mr-2" />
              Reach Us
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="h-4 w-4 mr-2" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {users.filter((u) => u.role === "customer").length}{" "}
                    customers,{" "}
                    {users.filter((u) => u.role === "professional").length}{" "}
                    professionals
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Services
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{services.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active service categories
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">FAQs</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{faqs.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Help center articles
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Feedback
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feedback.length}</div>
                  <p className="text-xs text-muted-foreground">
                    User feedback entries
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Reach Us
                  </CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reachUsMessages.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Contact messages
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reviews</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reviews.length}</div>
                  <p className="text-xs text-muted-foreground">User reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Rating Statistics */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Rating Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Booking Ratings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      Booking Ratings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-center">
                      {stats?.ratings?.avgBooking
                        ? stats.ratings.avgBooking.toFixed(2)
                        : "0.00"}
                      <span className="text-lg text-muted-foreground">/5</span>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-1">
                      Average Rating
                    </p>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Total Ratings:{" "}
                        {stats?.ratings?.totalBookingRatings || 0}
                      </p>
                      {stats?.ratings?.bookingDistribution && (
                        <div className="mt-2 space-y-1">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center">
                              <span className="text-sm w-4">{star}</span>
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1" />
                              <div className="flex-1 ml-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-yellow-500 h-2 rounded-full"
                                    style={{
                                      width: `${
                                        stats.ratings.totalBookingRatings > 0
                                          ? (stats.ratings.bookingDistribution[
                                              star
                                            ] /
                                              stats.ratings
                                                .totalBookingRatings) *
                                            100
                                          : 0
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-sm w-8 text-right">
                                {stats.ratings.bookingDistribution[star] || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback Ratings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                      Feedback Ratings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-center">
                      {stats?.ratings?.avgFeedback
                        ? stats.ratings.avgFeedback.toFixed(2)
                        : "0.00"}
                      <span className="text-lg text-muted-foreground">/5</span>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-1">
                      Average Rating
                    </p>
                  </CardContent>
                </Card>

                {/* Review Ratings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 text-green-500 mr-2" />
                      Review Ratings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-center">
                      {stats?.ratings?.avgReview
                        ? stats.ratings.avgReview.toFixed(2)
                        : "0.00"}
                      <span className="text-lg text-muted-foreground">/5</span>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-1">
                      Average Rating
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">User Management</h3>
              </div>

              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">
                            {user.fullName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "admin"
                                  ? "default"
                                  : user.role === "professional"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.isActive ? "default" : "destructive"
                              }
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.category || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedItem(user);
                                  setFormData(user);
                                  setIsEditUserOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteUser(user._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Service Management</h3>
                <div className="flex items-center space-x-4">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => {
                      setFormData({});
                      setIsEditServiceOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Icon</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services
                        .filter(
                          (service) =>
                            selectedCategory === "All Services" ||
                            service.category === selectedCategory
                        )
                        .map((service) => (
                          <TableRow key={service._id}>
                            <TableCell className="font-medium">
                              {service.title}
                            </TableCell>
                            <TableCell>{service.description}</TableCell>
                            <TableCell>{getIconEmoji(service.icon)}</TableCell>
                            <TableCell>
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: service.color }}
                              ></div>
                            </TableCell>
                            <TableCell>{service.category || "N/A"}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedItem(service);
                                    setFormData(service);
                                    setIsEditServiceOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteService(service._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faqs" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">FAQ Management</h3>
                <Button
                  onClick={() => {
                    setFormData({});
                    setIsEditFAQOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </div>

              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Answer</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faqs.map((faq) => (
                        <TableRow key={faq._id}>
                          <TableCell className="font-medium">
                            {faq.type}
                          </TableCell>
                          <TableCell>{faq.question}</TableCell>
                          <TableCell>{faq.answer}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedItem(faq);
                                  setFormData(faq);
                                  setIsEditFAQOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteFAQ(faq._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Feedback Management</h3>
              </div>

              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rating</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedback.map((fb) => (
                        <TableRow key={fb._id}>
                          <TableCell className="font-medium">
                            {fb.rating}
                          </TableCell>
                          <TableCell>{fb.subject}</TableCell>
                          <TableCell>{fb.message}</TableCell>
                          <TableCell>
                            {fb.user ? (
                              <div className="flex items-center space-x-2">
                                <span>{fb.user.fullName}</span>
                                <span>({fb.user.username})</span>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedItem(fb);
                                  setFormData(fb);
                                  setIsEditFeedbackOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteFeedback(fb._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reachus" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Reach Us Messages</h3>
                <div className="flex items-center space-x-4">
                  <Select
                    value={reachUsFilter}
                    onValueChange={setReachUsFilter}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Search..."
                    value={reachUsSearchTerm}
                    onChange={(e) => setReachUsSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReachUsMessages.map((message) => (
                        <TableRow key={message._id}>
                          <TableCell className="font-medium">
                            {message.fullName}
                          </TableCell>
                          <TableCell>{message.email}</TableCell>
                          <TableCell>{message.subject}</TableCell>
                          <TableCell>{message.message}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedItem(message);
                                  setFormData(message);
                                  setIsEditReachUsOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  deleteReachUsMessage(message._id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedItem(message);
                                  setIsViewReachUsOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Review Management</h3>
              </div>

              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reviewer</TableHead>
                        <TableHead>Reviewee</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => (
                        <TableRow key={review._id}>
                          <TableCell className="font-medium">
                            {review.reviewer.fullName}
                          </TableCell>
                          <TableCell>{review.reviewee.fullName}</TableCell>
                          <TableCell>{review.rating}</TableCell>
                          <TableCell>{review.comment}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedItem(review);
                                  setFormData(review);
                                  setIsEditReviewOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteReview(review._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* View Reach Us Message Dialog */}
        <Dialog open={isViewReachUsOpen} onOpenChange={setIsViewReachUsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Contact Message Details</DialogTitle>
              <DialogDescription>
                View the complete message from {selectedItem?.fullName}
              </DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <p className="text-sm mt-1">{selectedItem.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <p className="text-sm mt-1">{selectedItem.email}</p>
                  </div>
                </div>

                {selectedItem.user && (
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Registered User
                      </Label>
                      <p className="text-sm mt-1">
                        {selectedItem.user.fullName ||
                          selectedItem.user.username}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Username
                      </Label>
                      <p className="text-sm mt-1">
                        @{selectedItem.user.username}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Subject
                  </Label>
                  <p className="text-sm mt-1">{selectedItem.subject}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Message
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border text-sm whitespace-pre-wrap">
                    {selectedItem.message}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Received
                  </Label>
                  <p className="text-sm mt-1">
                    {new Date(selectedItem.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open(
                        `mailto:${selectedItem.email}?subject=Re: ${selectedItem.subject}`,
                        "_blank"
                      );
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      deleteReachUsMessage(selectedItem._id);
                      setIsViewReachUsOpen(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Message
                  </Button>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewReachUsOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and role
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={formData.role || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Status
                </Label>
                <Select
                  value={formData.isActive ? "true" : "false"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isActive: value === "true" })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => updateUser(selectedItem?._id, formData)}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Service Dialog */}
        <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedItem ? "Edit Service" : "Add Service"}
              </DialogTitle>
              <DialogDescription>
                {selectedItem
                  ? "Update service information"
                  : "Create a new service"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.filter(
                      (cat) => cat.name !== "All Services"
                    ).map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icon
                </Label>
                <Select
                  value={formData.icon || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, icon: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_ICONS.map((icon) => (
                      <SelectItem key={icon.name} value={icon.name}>
                        <div className="flex items-center">
                          <span className="mr-2">{icon.value}</span>
                          <span>{icon.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <Select
                  value={formData.color || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, color: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_COLORS.map((color) => (
                      <SelectItem key={color.name} value={color.value}>
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2 border"
                            style={{ backgroundColor: color.value }}
                          ></div>
                          <span>{color.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() =>
                  selectedItem
                    ? updateService(selectedItem._id, formData)
                    : createService(formData)
                }
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : selectedItem
                  ? "Save changes"
                  : "Create service"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit FAQ Dialog */}
        <Dialog open={isEditFAQOpen} onOpenChange={setIsEditFAQOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedItem ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
              <DialogDescription>
                {selectedItem ? "Update FAQ information" : "Create a new FAQ"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Input
                  id="type"
                  value={formData.type || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question" className="text-right">
                  Question
                </Label>
                <Input
                  id="question"
                  value={formData.question || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="answer" className="text-right">
                  Answer
                </Label>
                <Textarea
                  id="answer"
                  value={formData.answer || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() =>
                  selectedItem
                    ? updateFAQ(selectedItem._id, formData)
                    : createFAQ(formData)
                }
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : selectedItem
                  ? "Save changes"
                  : "Create FAQ"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Feedback Dialog */}
        <Dialog open={isEditFeedbackOpen} onOpenChange={setIsEditFeedbackOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Feedback</DialogTitle>
              <DialogDescription>Update feedback information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Rating
                </Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rating: parseInt(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={formData.subject || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={formData.message || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => updateFeedback(selectedItem?._id, formData)}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Reach Us Message Dialog */}
        <Dialog open={isEditReachUsOpen} onOpenChange={setIsEditReachUsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Message</DialogTitle>
              <DialogDescription>Update message information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={formData.subject || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={formData.message || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() =>
                  updateReachUsMessage(selectedItem?._id, formData)
                }
                disabled={loading}
              >
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Review Dialog */}
        <Dialog open={isEditReviewOpen} onOpenChange={setIsEditReviewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Review</DialogTitle>
              <DialogDescription>Update review information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Rating
                </Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rating: parseInt(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comment" className="text-right">
                  Comment
                </Label>
                <Textarea
                  id="comment"
                  value={formData.comment || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => updateReview(selectedItem?._id, formData)}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
