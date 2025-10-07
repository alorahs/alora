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
import { Edit, Trash2, Eye } from "lucide-react";

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

// Define form data interface
interface ReachUsFormData {
  _id?: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
}

export default function ReachUsSection({
  reachUsMessages = [],
  loading,
  setIsEditReachUsOpen,
  setIsViewReachUsOpen,
  setSelectedItem,
  deleteReachUsMessage,
  updateReachUsMessage,
  setFormData,
  reachUsFilter,
  setReachUsFilter,
  reachUsSearchTerm,
  setReachUsSearchTerm,
}: {
  reachUsMessages: ReachUs[];
  loading: boolean;
  setIsEditReachUsOpen: (open: boolean) => void;
  setIsViewReachUsOpen: (open: boolean) => void;
  setSelectedItem: (item: ReachUs) => void;
  deleteReachUsMessage: (id: string) => void;
  updateReachUsMessage: (id: string, data: Partial<ReachUsFormData>) => void;
  setFormData: (data: Partial<ReachUsFormData>) => void;
  reachUsFilter: string;
  setReachUsFilter: (filter: string) => void;
  reachUsSearchTerm: string;
  setReachUsSearchTerm: (term: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search messages..."
            value={reachUsSearchTerm}
            onChange={(e) => setReachUsSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={reachUsFilter} onValueChange={setReachUsFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reach Us Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reachUsMessages.map((message) => (
                <TableRow key={message._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{message.fullName}</div>
                      <div className="text-sm text-gray-500">
                        {message.user?.email || message.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {message.user?.email || message.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium max-w-xs truncate">
                      {message.subject}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {message.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(message);
                          setIsViewReachUsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(message);
                          setFormData(message);
                          setIsEditReachUsOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteReachUsMessage(message._id)}
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