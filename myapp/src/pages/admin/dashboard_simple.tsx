import { useState, useEffect } from "react";
import { useAuth, API_URL } from "@/context/auth_provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  MessageSquare,
  Star,
  BarChart3,
  Briefcase,
  Mail,
  BookOpen,
  Info,
} from "lucide-react";
import RatingStats from "@/components/admin/RatingStats";

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

export default function AdminDashboardSimple() {
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

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 w-full max-w-md">
          <CardContent>
            <p className="text-center text-red-600 text-lg">
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

  useEffect(() => {
    fetchUsers();
    fetchServices();
    fetchFAQs();
    fetchFeedback();
    fetchReachUsMessages();
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your Alora platform
          </p>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              onClick={() => navigate("/admin/users")}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
            >
              <Users className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">User Management</span>
            </Button>
            <Button
              onClick={() => navigate("/admin/services")}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
            >
              <Briefcase className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Service Management</span>
            </Button>
            <Button
              onClick={() => navigate("/admin/feedback")}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
            >
              <MessageSquare className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Feedback</span>
            </Button>
            <Button
              onClick={() => navigate("/admin/reachus")}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
            >
              <Mail className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Reach Us</span>
            </Button>
            <Button
              onClick={() => navigate("/admin/rating-stats")}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
            >
              <BarChart3 className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Rating Stats</span>
            </Button>
            <Button
              onClick={() => navigate("/admin/booking-ratings")}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
            >
              <BookOpen className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Booking Ratings</span>
            </Button>
            <Button
              onClick={() => navigate("/admin/aboutus")}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
            >
              <Info className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">About Us</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-6">
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-xl sm:text-2xl font-bold">
                {users.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {users.filter((u) => u.role === "customer").length} customers,{" "}
                {users.filter((u) => u.role === "professional").length} pros
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Services
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-xl sm:text-2xl font-bold">
                {services.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active categories
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                FAQs
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-xl sm:text-2xl font-bold">{faqs.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Help articles
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Feedback
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-xl sm:text-2xl font-bold">
                {feedback.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                User feedback
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Reach Us
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-xl sm:text-2xl font-bold">
                {reachUsMessages.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Contact messages
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Reviews
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-xl sm:text-2xl font-bold">
                {reviews.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">User reviews</p>
            </CardContent>
          </Card>
        </div>

        <RatingStats />
      </div>
    </div>
  );
}
