import { useState, useEffect } from "react";
import { useAuth, API_URL } from "@/context/auth_provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Plus, Search } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  createdAt: string;
}

const SERVICE_CATEGORIES = [
  "Home Repair",
  "Tech Support",
  "Cleaning",
  "Electrical",
  "Plumbing",
  "Other",
];

const PREDEFINED_COLORS = [
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Purple", value: "purple" },
  { name: "Red", value: "red" },
  { name: "Yellow", value: "yellow" },
  { name: "Pink", value: "pink" },
  { name: "Indigo", value: "indigo" },
  { name: "Teal", value: "teal" },
  { name: "Orange", value: "orange" },
  { name: "Cyan", value: "cyan" },
];

const getColorValue = (colorName: string) => {
  switch (colorName) {
    case "blue":
      return "#3B82F6";
    case "green":
      return "#10B981";
    case "purple":
      return "#8B5CF6";
    case "red":
      return "#EF4444";
    case "yellow":
      return "#F59E0B";
    case "pink":
      return "#EC4899";
    case "indigo":
      return "#6366F1";
    case "teal":
      return "#14B8A6";
    case "orange":
      return "#F97316";
    case "cyan":
      return "#06B6D4";
    default:
      return "#3B82F6";
  }
};

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
];

export default function ServiceManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    icon: "",
    color: "blue",
  });

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

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        throw new Error("Failed to fetch services");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    let result = services;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (service) =>
          service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(result);
  }, [services, searchTerm]);

  const handleCreateClick = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      icon: "",
      color: "blue",
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category || "",
      icon: service.icon,
      color: service.color || "blue",
    });
    setIsEditDialogOpen(true);
  };

  const handleCreateService = async () => {
    try {
      const response = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Service created successfully",
        });
        setIsCreateDialogOpen(false);
        fetchServices();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create service");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create service",
        variant: "destructive",
      });
    }
  };

  const handleUpdateService = async () => {
    if (!selectedService) return;

    try {
      const response = await fetch(
        `${API_URL}/services/${selectedService._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Service updated successfully",
        });
        setIsEditDialogOpen(false);
        fetchServices();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update service");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update service",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete service");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Service Management
            </h1>
            <p className="text-gray-600">Loading services...</p>
          </div>
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Service Management
          </h1>
          <p className="text-gray-600">
            Manage service offerings and categories
          </p>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={handleCreateClick}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Service List ({filteredServices.length} services)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredServices.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No services found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or create a new service.
                </p>
                <Button onClick={handleCreateClick} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service._id}>
                      <TableCell className="font-medium">
                        {service.title}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {service.description}
                      </TableCell>
                      <TableCell>{service.category || "N/A"}</TableCell>
                      <TableCell>
                        <span className="text-2xl">{service.icon}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded border mr-2"
                            style={{
                              backgroundColor: getColorValue(service.color),
                            }}
                          />
                          <span className="text-xs">{service.color}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(service)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteService(service._id)}
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

        {/* Create Service Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
              <DialogDescription>
                Add a new service offering to the platform
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="e.g., Electrical Services"
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Describe the service in detail..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icon *
                </Label>
                <div className="col-span-3 space-y-3">
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
                  <Input
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="Enter emoji or custom icon"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <div className="col-span-3 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {PREDEFINED_COLORS.map((color) => (
                      <div
                        key={color.value}
                        className={`w-6 h-6 rounded border cursor-pointer ${
                          formData.color === color.value
                            ? "ring-2 ring-offset-2 ring-blue-500"
                            : ""
                        }`}
                        style={{ backgroundColor: getColorValue(color.value) }}
                        onClick={() =>
                          setFormData({ ...formData, color: color.value })
                        }
                        title={color.name}
                      />
                    ))}
                  </div>
                  <Select
                    value={formData.color}
                    onValueChange={(value) =>
                      setFormData({ ...formData, color: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {PREDEFINED_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded border mr-2"
                              style={{
                                backgroundColor: getColorValue(color.value),
                              }}
                            />
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Service Preview */}
              <div className="grid grid-cols-4 items-center gap-4 border-t pt-4">
                <Label className="text-right">Preview</Label>
                <div className="col-span-3">
                  <div className="flex items-center space-x-3 p-3 border rounded">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white"
                      style={{ backgroundColor: getColorValue(formData.color) }}
                    >
                      <span>{formData.icon || "?"}</span>
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
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateService}
                disabled={
                  !formData.title || !formData.description || !formData.icon
                }
              >
                Create Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Service Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>Update the service details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title *
                </Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="e.g., Electrical Services"
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-description" className="text-right pt-2">
                  Description *
                </Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Describe the service in detail..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-icon" className="text-right">
                  Icon *
                </Label>
                <div className="col-span-3 space-y-3">
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
                  <Input
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="Enter emoji or custom icon"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-color" className="text-right">
                  Color
                </Label>
                <div className="col-span-3 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {PREDEFINED_COLORS.map((color) => (
                      <div
                        key={color.value}
                        className={`w-6 h-6 rounded border cursor-pointer ${
                          formData.color === color.value
                            ? "ring-2 ring-offset-2 ring-blue-500"
                            : ""
                        }`}
                        style={{ backgroundColor: getColorValue(color.value) }}
                        onClick={() =>
                          setFormData({ ...formData, color: color.value })
                        }
                        title={color.name}
                      />
                    ))}
                  </div>
                  <Select
                    value={formData.color}
                    onValueChange={(value) =>
                      setFormData({ ...formData, color: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {PREDEFINED_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded border mr-2"
                              style={{
                                backgroundColor: getColorValue(color.value),
                              }}
                            />
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Service Preview */}
              <div className="grid grid-cols-4 items-center gap-4 border-t pt-4">
                <Label className="text-right">Preview</Label>
                <div className="col-span-3">
                  <div className="flex items-center space-x-3 p-3 border rounded">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white"
                      
                    >
                      <span>{formData.icon || "?"}</span>
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
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdateService}
                disabled={
                  !formData.title || !formData.description || !formData.icon
                }
              >
                Update Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
