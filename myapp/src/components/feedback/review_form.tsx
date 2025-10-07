import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth_provider";
import { proxyApiRequest } from "@/lib/apiProxy";
import { Star } from "lucide-react";

interface ReviewFormProps {
  bookingId: string;
  professionalId: string;
  onReviewSubmitted: () => void;
}

export function ReviewForm({
  bookingId,
  professionalId,
  onReviewSubmitted,
}: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit review to backend
      const response = await proxyApiRequest(`/booking/${bookingId}/rating`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          rating,
          review: comment,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });

      // Reset form and notify parent
      setRating(0);
      setComment("");
      onReviewSubmitted();
    } catch (error) {
      toast({
        title: "Error",
        description:
          (error as Error).message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="font-semibold text-lg mb-3">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Rating
          </Label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-gray-300 hover:text-yellow-400 focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label
            htmlFor="comment"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Your Review
          </Label>
          <Textarea
            id="comment"
            placeholder="Share your experience with this professional..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </div>
  );
}
