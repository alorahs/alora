import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth_provider";
import { proxyApiRequest } from "../../lib/apiProxy";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Star, Calendar, User, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

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

export default function ReviewManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await proxyApiRequest("/review", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        throw new Error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  interface ReviewData {
  rating?: number;
  comment?: string;
}

const updateReview = async (reviewId: string, reviewData: ReviewData) => {
    try {
      const response = await proxyApiRequest(`/review/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: reviewData,
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Review updated successfully",
        });
        fetchReviews();
        setIsEditDialogOpen(false);
      } else {
        throw new Error(result.message || "Failed to update review");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Error",
        description: errorMessage || "Failed to update review",
        variant: "destructive",
      });
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const response = await proxyApiRequest(`/review/${reviewId}`, {
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Error",
        description: errorMessage || "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (reviewItem: Review) => {
    setSelectedReview(reviewItem);
    setFormData({
      rating: reviewItem.rating,
      comment: reviewItem.comment || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (selectedReview) {
      await updateReview(selectedReview._id, formData);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

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
        <div className="text-center">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Review Management
          </h1>
          <p className="text-gray-600">View and manage user reviews</p>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-gray-600">
                        Reviews from users will appear here.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review) => (
                    <TableRow key={review._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {review.reviewer?.fullName ||
                              review.reviewer?.username ||
                              "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {review.reviewer?.username &&
                              `@${review.reviewer.username}`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {review.reviewee?.fullName ||
                              review.reviewee?.username ||
                              "Unknown Professional"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {review.reviewee?.username &&
                              `@${review.reviewee.username}`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {review.comment}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(review)}
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        {reviews.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Review Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {reviews.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(
                      reviews.reduce((sum, item) => sum + item.rating, 0) /
                      reviews.length
                    ).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {reviews.filter((item) => item.rating >= 4).length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Positive (4-5 stars)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {reviews.filter((item) => item.rating <= 2).length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Negative (1-2 stars)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Review Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, rating: parseInt(value) })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} Star{rating > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comment" className="text-right">
                  Comment
                </Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  className="col-span-3"
                  rows={4}
                  placeholder="Review comment"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
