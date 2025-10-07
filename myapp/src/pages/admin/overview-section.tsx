import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Mail,
  BarChart3,
} from "lucide-react";

// Define interfaces for the data types
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

export default function OverviewSection({
  users = [],
  services = [],
  faqs = [],
  feedback = [],
  reachUsMessages = [],
  reviews = [],
}: {
  users: User[];
  services: Service[];
  faqs: FAQ[];
  feedback: Feedback[];
  reachUsMessages: ReachUs[];
  reviews: Review[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-xs text-muted-foreground">
            {users.filter((u) => u.role === "customer").length} customers,{" "}
            {users.filter((u) => u.role === "professional").length}{" "}
            professionals
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Services</CardTitle>
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
          <p className="text-xs text-muted-foreground">Help center articles</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Feedback</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{feedback.length}</div>
          <p className="text-xs text-muted-foreground">
            User feedback received
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Reach Us Messages
          </CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reachUsMessages.length}</div>
          <p className="text-xs text-muted-foreground">Customer inquiries</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reviews</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reviews.length}</div>
          <p className="text-xs text-muted-foreground">Service reviews</p>
        </CardContent>
      </Card>
    </div>
  );
}