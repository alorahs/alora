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
}

interface ReachUs {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
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
  const { toast } = useToast();

  // State for different sections
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [reachUsMessages, setReachUsMessages] = useState<ReachUs[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("All Services");

  // Dialog states
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [isEditFAQOpen, setIsEditFAQOpen] = useState(false);
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

  useEffect(() => {
    fetchUsers();
    fetchServices();
    fetchFAQs();
    fetchFeedback();
    fetchReachUsMessages();
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

  // Operations for Reach Us Messages
  const deleteReachUsMessage = async (messageId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/reachus/${messageId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Message deleted successfully",
        });
        fetchReachUsMessages();
      } else {
        throw new Error("Failed to delete message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
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
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
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
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
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
                      setSelectedItem(null);
                      setFormData({});
                      setIsEditServiceOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </div>

              {/* Category Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {SERVICE_CATEGORIES.filter(
                  (cat) => cat.name !== "All Services"
                ).map((category) => {
                  const categoryServices = services.filter((service) => {
                    // Check if service has a category field that matches
                    if (
                      service.category &&
                      service.category === category.name
                    ) {
                      return true;
                    }
                    // Fallback: check if service title matches any predefined services in this category
                    return category.services.some(
                      (categoryService) =>
                        service.title
                          .toLowerCase()
                          .includes(categoryService.toLowerCase()) ||
                        categoryService
                          .toLowerCase()
                          .includes(service.title.toLowerCase())
                    );
                  });

                  // Get dominant color from services in this category
                  const categoryColors = categoryServices
                    .map((s) => s.color)
                    .filter(Boolean);
                  const dominantColor = categoryColors[0] || "#6B7280";

                  return (
                    <Card
                      key={category.name}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: dominantColor }}
                            />
                            <span className="text-sm font-medium">
                              {category.name}
                            </span>
                          </div>
                          <Badge variant="outline">
                            {categoryServices.length} services
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {categoryServices
                            .slice(0, 3)
                            .map((service, index) => (
                              <div
                                key={service._id || index}
                                className="flex items-center text-xs text-muted-foreground"
                              >
                                <div
                                  className="w-2 h-2 rounded-full mr-2"
                                  style={{
                                    backgroundColor: service.color || "#9CA3AF",
                                  }}
                                />
                                <span>• {service.title}</span>
                              </div>
                            ))}
                          {categoryServices.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              + {categoryServices.length - 3} more
                            </div>
                          )}
                        </div>

                        {/* Color palette for this category */}
                        {categoryColors.length > 0 && (
                          <div className="flex space-x-1 mt-3 pt-3 border-t">
                            {[...new Set(categoryColors)]
                              .slice(0, 5)
                              .map((color, index) => (
                                <div
                                  key={index}
                                  className="w-4 h-4 rounded border"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services
                  .filter((service) => {
                    if (selectedCategory === "All Services") return true;
                    // Check if service has a category field that matches
                    if (
                      service.category &&
                      service.category === selectedCategory
                    ) {
                      return true;
                    }
                    // Fallback: check if service title is in the category's predefined services
                    const category = SERVICE_CATEGORIES.find(
                      (cat) => cat.name === selectedCategory
                    );
                    return category
                      ? category.services.some(
                          (categoryService) =>
                            service.title
                              .toLowerCase()
                              .includes(categoryService.toLowerCase()) ||
                            categoryService
                              .toLowerCase()
                              .includes(service.title.toLowerCase())
                        )
                      : false;
                  })
                  .map((service) => {
                    // Determine which category this service belongs to
                    const serviceCategory =
                      service.category ||
                      SERVICE_CATEGORIES.find((cat) =>
                        cat.services.some(
                          (categoryService) =>
                            service.title
                              .toLowerCase()
                              .includes(categoryService.toLowerCase()) ||
                            categoryService
                              .toLowerCase()
                              .includes(service.title.toLowerCase())
                        )
                      )?.name ||
                      "Other";

                    return (
                      <Card key={service._id}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div>
                              <span>{service.title}</span>
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                {serviceCategory}
                              </Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedItem(service);
                                  setFormData({
                                    ...service,
                                    category: serviceCategory,
                                  });
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
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: service.color }}
                                title={`Color: ${service.color}`}
                              />
                              <span className="text-xs font-mono">
                                {service.color}
                              </span>
                            </div>
                            <span
                              className="text-lg"
                              title={`Icon: ${service.icon}`}
                            >
                              {getIconEmoji(service.icon)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>

              {/* Show message when no services in selected category */}
              {services.filter((service) => {
                if (selectedCategory === "All Services") return true;
                // Check if service has a category field that matches
                if (service.category && service.category === selectedCategory) {
                  return true;
                }
                // Fallback: check if service title is in the category's predefined services
                const category = SERVICE_CATEGORIES.find(
                  (cat) => cat.name === selectedCategory
                );
                return category
                  ? category.services.some(
                      (categoryService) =>
                        service.title
                          .toLowerCase()
                          .includes(categoryService.toLowerCase()) ||
                        categoryService
                          .toLowerCase()
                          .includes(service.title.toLowerCase())
                    )
                  : false;
              }).length === 0 && (
                <Card className="text-center py-8">
                  <CardContent>
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No services in {selectedCategory}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create services that belong to this category.
                    </p>
                    <Button
                      onClick={() => {
                        setSelectedItem(null);
                        setFormData({ category: selectedCategory });
                        setIsEditServiceOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service to {selectedCategory}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="faqs" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">FAQ Management</h3>
                <Button
                  onClick={() => {
                    setSelectedItem(null);
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
                          <TableCell>
                            <Badge variant="outline">{faq.type}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {faq.question}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {faq.answer}
                          </TableCell>
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
              <h3 className="text-lg font-semibold">Feedback Management</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feedback.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No feedback yet
                    </h3>
                    <p className="text-gray-600">
                      Feedback from users will appear here.
                    </p>
                  </div>
                ) : (
                  feedback.map((item) => (
                    <Card key={item._id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{item.subject || "No Subject"}</span>
                          <div className="flex items-center">
                            {Array.from({ length: item.rating }, (_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {item.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Summary Stats */}
              {feedback.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Feedback Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {feedback.length}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Feedback
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {(
                            feedback.reduce(
                              (sum, item) => sum + item.rating,
                              0
                            ) / feedback.length
                          ).toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Average Rating
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {feedback.filter((item) => item.rating >= 4).length}
                        </div>
                        <div className="text-sm text-gray-600">
                          Positive (4-5 stars)
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {feedback.filter((item) => item.rating <= 2).length}
                        </div>
                        <div className="text-sm text-gray-600">
                          Negative (1-2 stars)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reachus" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Reach Us Messages</h3>
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search messages..."
                    value={reachUsSearchTerm}
                    onChange={(e) => setReachUsSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Select
                    value={reachUsFilter}
                    onValueChange={setReachUsFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Messages</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Messages Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {reachUsMessages.length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        reachUsMessages.filter(
                          (msg) =>
                            new Date(msg.createdAt).toDateString() ===
                            new Date().toDateString()
                        ).length
                      }
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      This Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        reachUsMessages.filter((msg) => {
                          const msgDate = new Date(msg.createdAt);
                          const weekAgo = new Date(
                            Date.now() - 7 * 24 * 60 * 60 * 1000
                          );
                          return msgDate >= weekAgo;
                        }).length
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Messages Table */}
              <Card>
                <CardContent>
                  {filteredReachUsMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {reachUsSearchTerm || reachUsFilter !== "all"
                          ? "No messages found"
                          : "No messages yet"}
                      </h3>
                      <p className="text-gray-600">
                        {reachUsSearchTerm || reachUsFilter !== "all"
                          ? "Try adjusting your search or filter criteria."
                          : "Contact messages from users will appear here."}
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Date</TableHead>
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
                            <TableCell className="max-w-xs truncate">
                              {message.subject}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">
                                  {new Date(
                                    message.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(
                                  message.createdAt
                                ).toLocaleTimeString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
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
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    deleteReachUsMessage(message._id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
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
                    placeholder="Search by name, email, subject, or message"
                    value={reachUsSearchTerm}
                    onChange={(e) => setReachUsSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReachUsMessages.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No messages found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters or search term.
                    </p>
                  </div>
                ) : (
                  filteredReachUsMessages.map((message) => (
                    <Card key={message._id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{message.fullName}</span>
                          <div className="flex items-center">
                            <Eye
                              className="h-4 w-4 mr-2 cursor-pointer"
                              onClick={() => {
                                setSelectedItem(message);
                                setIsViewReachUsOpen(true);
                              }}
                            />
                            <Trash2
                              className="h-4 w-4 cursor-pointer"
                              onClick={() => deleteReachUsMessage(message._id)}
                            />
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedItem ? "Edit Service" : "Create New Service"}
              </DialogTitle>
              <DialogDescription>
                {selectedItem
                  ? "Update service information, category, icon, and color"
                  : "Create a new service with all details"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Service Title */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right font-medium">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="e.g., Electrical Services"
                  required
                />
              </div>

              {/* Service Description */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label
                  htmlFor="description"
                  className="text-right font-medium pt-2"
                >
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Describe the service in detail..."
                  rows={3}
                  required
                />
              </div>

              {/* Service Category */}
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="category" className="text-right font-medium">
                  Category
                </Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category (optional)" />
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

              {/* Service Icon */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icon *
                </Label>
                <div className="col-span-3 space-y-3">
                  {/* Simple icon grid */}
                  <div className="grid grid-cols-8 gap-2">
                    {PREDEFINED_ICONS.slice(0, 16).map((icon) => (
                      <div
                        key={icon.value}
                        className={`w-8 h-8 rounded border cursor-pointer flex items-center justify-center ${
                          formData.icon === icon.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, icon: icon.value })
                        }
                        title={icon.name}
                      >
                        {icon.value}
                      </div>
                    ))}
                  </div>

                  {/* Simple custom input */}
                </div>
              </div>

              {/* Service Color */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <div className="col-span-3 space-y-3">
                  {/* Simple custom color */}
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={formData.color || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      placeholder="eg. black, blue, red, etc."
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Service Preview */}
              <div className="grid grid-cols-4 items-center gap-4 border-t pt-4">
                <Label className="text-right">Preview</Label>
                <div className="col-span-3">
                  <div className="flex items-center space-x-3 p-3 border rounded">
                    <div className="w-8 h-8 rounded flex items-center justify-center">
                      <span className="text-white">{formData.icon || "?"}</span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {formData.title || "Service Title"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formData.description || "Description..."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditServiceOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedItem
                    ? updateService(selectedItem._id, formData)
                    : createService(formData)
                }
                disabled={loading || !formData.title || !formData.description}
              >
                {loading ? "Saving..." : selectedItem ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit FAQ Dialog */}
        <Dialog open={isEditFAQOpen} onOpenChange={setIsEditFAQOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedItem ? "Edit FAQ" : "Create FAQ"}
              </DialogTitle>
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
                  placeholder="e.g., General, Technical"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question" className="text-right">
                  Question
                </Label>
                <Textarea
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
                  rows={4}
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
      </div>
    </div>
  );
}
