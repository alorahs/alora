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

interface FAQ {
  _id: string;
  type: string;
  question: string;
  answer: string;
  createdAt: string;
}

// Define interface for FAQ form data
interface FAQFormData {
  type: string;
  question: string;
  answer: string;
}

export default function FAQsSection({
  faqs = [],
  loading,
  setIsEditFAQOpen,
  setSelectedItem,
  deleteFAQ,
  createFAQ,
  updateFAQ,
  setFormData,
}: {
  faqs: FAQ[];
  loading: boolean;
  setIsEditFAQOpen: (open: boolean) => void;
  // Fix: Replace 'any' with the specific FAQ type
  setSelectedItem: (item: FAQ | null) => void;
  deleteFAQ: (id: string) => void;
  // Fix: Replace 'any' with the specific FAQFormData type
  createFAQ: (data: Partial<FAQFormData>) => void;
  // Fix: Replace 'any' with the specific FAQFormData type
  updateFAQ: (id: string, data: Partial<FAQFormData>) => void;
  // Fix: Replace 'any' with the specific FAQFormData type
  setFormData: (data: Partial<FAQFormData>) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" || faq.type.toLowerCase() === typeFilter;

    return matchesSearch && matchesType;
  });

  // Get unique types
  const types = Array.from(new Set(faqs.map((f) => f.type)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
        <CardHeader>
          <CardTitle>FAQs Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Answer</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFAQs.map((faq) => (
                <TableRow key={faq._id}>
                  <TableCell>
                    <div className="font-medium max-w-xs truncate">
                      {faq.question}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{faq.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {faq.answer}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(faq);
                          setFormData(faq);
                          setIsEditFAQOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteFAQ(faq._id)}
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
