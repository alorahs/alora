import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth, API_URL } from "@/context/auth_provider";
import { Star, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Review {
  _id: string;
  reviewer: {
    fullName: string;
    username: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProfessionalReviews() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([
    0, 0, 0, 0, 0,
  ]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/review?professionalId=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setReviews(data);

          // Calculate average rating
          if (data.length > 0) {
            const total = data.reduce(
              (sum: number, review: Review) => sum + review.rating,
              0
            );
            setAverageRating(total / data.length);

            // Calculate rating distribution
            const distribution = [0, 0, 0, 0, 0];
            data.forEach((review: Review) => {
              distribution[5 - review.rating] += 1;
            });
            setRatingDistribution(distribution);
          }
        } else {
          throw new Error("Failed to fetch reviews");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Reviews
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
              Professional Reviews
            </h1>
          <p className="text-gray-600 mt-2">
              See what customers are saying about this professional
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Rating Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-5xl font-bold text-gray-900">
                      {averageRating.toFixed(1)}
                    </div>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${
                            i < Math.floor(averageRating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-gray-600">
                      {reviews.length} reviews
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-3 mt-6">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <div className="w-10 text-sm font-medium text-gray-900">
                          {rating} stars
                        </div>
                      <div className="flex-1 mx-3">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{
                                width: `${
                                  reviews.length > 0
                                    ? (ratingDistribution[5 - rating] /
                                        reviews.length) *
                                      100
                                    : 0
                                }%`,
                              }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-8 text-sm text-gray-600">
                          {ratingDistribution[5 - rating]}
                        </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No reviews yet
                    </h3>
                  <p className="mt-1 text-gray-500">
                      This professional doesn't have any reviews yet.
                    </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review._id}>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">
                                {review.reviewer.fullName}
                              </h3>
                            <span className="text-sm text-gray-500">
                              {formatDistanceToNow(
                                  new Date(review.createdAt),
                                  { addSuffix: true }
                                )}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <p className="mt-3 text-gray-700">
                              {review.comment}
                            </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}