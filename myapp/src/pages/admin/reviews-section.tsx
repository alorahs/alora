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
import { Edit, Trash2, Star } from "lucide-react";

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

// Define form data interface
interface ReviewFormData {
  _id?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export default function ReviewsSection({
  reviews = [],
  loading,
  setIsEditReviewOpen,
  setSelectedItem,
  deleteReview,
  updateReview,
  setFormData,
}: {
  reviews: Review[];
  loading: boolean;
  setIsEditReviewOpen: (open: boolean) => void;
  setSelectedItem: (item: Review) => void;
  deleteReview: (id: string) => void;
  updateReview: (id: string, data: Partial<ReviewFormData>) => void;
  setFormData: (data: Partial<ReviewFormData>) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.reviewer.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      review.reviewee.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === "all" || review.rating.toString() === ratingFilter;

    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              {[1, 2, 3, 4, 5].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} Star{rating !== 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reviews Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead>Reviewee</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {review.reviewer.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{review.reviewer.username}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {review.reviewee.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{review.reviewee.username}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1">{review.rating}/5</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {review.comment}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(review);
                          setFormData(review);
                          setIsEditReviewOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteReview(review._id)}
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