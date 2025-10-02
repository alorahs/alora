import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Edit, Trash2, Plus } from "lucide-react";

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category?: string;
  createdAt: string;
}

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

export default function ServicesSection({
  services = [],
  loading,
  setIsEditServiceOpen,
  setSelectedItem,
  deleteService,
  createService,
  updateService,
  setFormData,
}: {
  services: Service[];
  loading: boolean;
  setIsEditServiceOpen: (open: boolean) => void;
  setSelectedItem: (item: any) => void;
  deleteService: (id: string) => void;
  createService: (data: any) => void;
  updateService: (id: string, data: any) => void;
  setFormData: (data: any) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      (service.category || "uncategorized").toLowerCase() === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(
    new Set(services.map((s) => s.category || "uncategorized"))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Services Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>
                    <div className="font-medium">{service.title}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {service.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {service.category || "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-2xl">
                      {getIconEmoji(service.icon)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(service);
                          setFormData(service);
                          setIsEditServiceOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteService(service._id)}
                        disabled={loading}
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
  );
}
