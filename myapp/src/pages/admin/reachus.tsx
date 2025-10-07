import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth_provider";
import { proxyApiRequest } from "@/lib/apiProxy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Mail, Calendar, Eye, Edit, Trash2, Reply } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReachUsMessage {
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

export default function ReachUsManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ReachUsMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ReachUsMessage | null>(
    null
  );
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await proxyApiRequest("/reachus", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  interface MessageData {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const updateMessage = async (messageId: string, messageData: MessageData) => {
    try {
      const response = await proxyApiRequest(`/reachus/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: messageData,
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Message updated successfully",
        });
        fetchMessages();
        setIsEditDialogOpen(false);
      } else {
        throw new Error("Failed to update message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await proxyApiRequest(`/reachus/${messageId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Message deleted successfully",
        });
        fetchMessages();
      } else {
        throw new Error("Failed to delete message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (messageItem: ReachUsMessage) => {
    setSelectedMessage(messageItem);
    setFormData({
      fullName: messageItem.fullName,
      email: messageItem.email,
      subject: messageItem.subject,
      message: messageItem.message,
    });
    setIsEditDialogOpen(true);
  };

  const handleViewClick = (messageItem: ReachUsMessage) => {
    setSelectedMessage(messageItem);
    setIsViewDialogOpen(true);
  };

  const handleUpdate = () => {
    if (selectedMessage) {
      updateMessage(selectedMessage._id, formData);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;

    const messageDate = new Date(message.createdAt);
    const now = new Date();

    switch (filter) {
      case "today":
        return (
          matchesSearch && messageDate.toDateString() === now.toDateString()
        );
      case "week": {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return matchesSearch && messageDate >= weekAgo;
      }
      case "month": {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return matchesSearch && messageDate >= monthAgo;
      }
      default:
        return matchesSearch;
    }
  });

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Reach Us Management
          </h1>
          <p className="text-gray-600">View and manage contact messages</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select value={filter} onValueChange={setFilter}>
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

        <Card>
          <CardContent>
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filter !== "all"
                    ? "No messages found"
                    : "No messages yet"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm || filter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Contact messages from users will appear here."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow key={message._id}>
                      <TableCell>
                        {message.user ? (
                          <div>
                            <div className="font-medium">
                              {message.user.fullName ||
                                message.user.username ||
                                "Registered User"}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{message.user.username}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500">Guest</div>
                        )}
                      </TableCell>
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
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewClick(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(message)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              window.open(
                                `mailto:${message.email}?subject=Re: ${message.subject}`,
                                "_blank"
                              );
                            }}
                          >
                            <Reply className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMessage(message._id)}
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

        {/* View Message Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Contact Message Details</DialogTitle>
              <DialogDescription>
                View the complete message from {selectedMessage?.fullName}
              </DialogDescription>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <p className="text-sm mt-1">{selectedMessage.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <p className="text-sm mt-1">{selectedMessage.email}</p>
                  </div>
                </div>

                {selectedMessage.user && (
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Registered User
                      </Label>
                      <p className="text-sm mt-1">
                        {selectedMessage.user.fullName ||
                          selectedMessage.user.username}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Username
                      </Label>
                      <p className="text-sm mt-1">
                        @{selectedMessage.user.username}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Subject
                  </Label>
                  <p className="text-sm mt-1">{selectedMessage.subject}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Message
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border text-sm whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Received
                  </Label>
                  <p className="text-sm mt-1">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open(
                        `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`,
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
                      deleteMessage(selectedMessage._id);
                      setIsViewDialogOpen(false);
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
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Message Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Message</DialogTitle>
              <DialogDescription>
                Update contact message information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Full name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Email address"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Message subject"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="col-span-3"
                  rows={4}
                  placeholder="Message content"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdate}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
