import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth_provider";
import { Loader2, Calendar, Clock, MapPin, User, Star } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { proxyApiRequest } from "@/lib/apiProxy";

interface Booking {
  _id: string;
  service: string;
  professional: {
    _id: string;
    fullName: string;
    category: string;
  };
  user: {
    _id: string;
    fullName: string;
  };
  date: string;
  time: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

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

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await proxyApiRequest(
          `/booking/professional/${user._id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load bookings"
        );
        toast({
          title: "Error",
          description: "Failed to load bookings. Please try again.",
          variant: "destructive",
        });
      }
    };

    const fetchReviews = async () => {
      if (!user) {
        return;
      }

      try {
        const response = await proxyApiRequest(
          `/review?professionalId=${user._id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

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
          }
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchBookings();
    fetchReviews();
  }, [user, navigate, toast]);

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: Booking["status"]
  ) => {
    setUpdating(true);

    try {
      const response = await proxyApiRequest(`/booking/${bookingId}/status`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking status");
      }

      // Update the booking in state
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId ? data.booking : booking
        )
      );

      toast({
        title: "Status Updated",
        description: `Booking status has been updated to ${newStatus}.`,
      });
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600">Loading your bookings...</p>
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
            Error Loading Bookings
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Professional Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your bookings and services
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No bookings yet
              </h3>
              <p className="text-gray-500">
                You don't have any bookings scheduled at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Upcoming Bookings
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {
                          bookings.filter((b) => b.status === "confirmed")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100">
                      <Star className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Completed Bookings
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {
                          bookings.filter((b) => b.status === "completed")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Pending Requests
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {bookings.filter((b) => b.status === "pending").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100">
                      <Star className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Reviews
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {reviews.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {bookings.map((booking) => (
                        <div
                          key={booking._id}
                          className="border border-gray-200 rounded-lg p-6"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center">
                                <div className="flex items-center">
                                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                                  <div className="ml-4">
                                    <h3 className="font-semibold text-gray-900">
                                      {booking.user.fullName}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {booking.service}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-4 md:mt-0 md:ml-8">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>
                                      {format(
                                        new Date(booking.date),
                                        "EEE, MMM d, yyyy"
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{booking.time}</span>
                                  </div>
                                </div>

                                <div className="mt-4 md:mt-0 md:ml-8">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>
                                      {booking.address.city},{" "}
                                      {booking.address.state}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {booking.notes && (
                                <div className="mt-4">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Notes:</span>{" "}
                                    {booking.notes}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                              {getStatusBadge(booking.status)}

                              <div className="mt-4 flex space-x-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link
                                    to={`/professional/booking/${booking._id}`}
                                  >
                                    View Details
                                  </Link>
                                </Button>

                                {booking.status === "pending" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleStatusUpdate(
                                          booking._id,
                                          "rejected"
                                        )
                                      }
                                      disabled={updating}
                                    >
                                      {updating ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        "Reject"
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleStatusUpdate(
                                          booking._id,
                                          "confirmed"
                                        )
                                      }
                                      disabled={updating}
                                    >
                                      {updating ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        "Confirm"
                                      )}
                                    </Button>
                                  </>
                                )}

                                {booking.status === "confirmed" && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleStatusUpdate(
                                        booking._id,
                                        "completed"
                                      )
                                    }
                                    disabled={updating}
                                  >
                                    {updating ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Complete"
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          {booking.status === "completed" && booking.rating && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < booking.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm font-medium">
                                  {booking.rating}.0
                                </span>
                              </div>
                              {booking.review && (
                                <p className="mt-1 text-sm text-gray-600">
                                  {booking.review}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recent Reviews</span>
                      {reviews.length > 0 && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">
                            {averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <User className="h-12 w-12 text-gray-400 mx-auto" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                          No reviews yet
                        </h3>
                        <p className="mt-1 text-gray-500">
                          You don't have any reviews yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.slice(0, 5).map((review) => (
                          <div
                            key={review._id}
                            className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-start">
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {review.reviewer.fullName}
                                  </h4>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < review.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-600">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {reviews.length > 5 && (
                          <Button
                            variant="outline"
                            className="w-full mt-4"
                            asChild
                          >
                            <Link to="/professional/reviews">
                              View All Reviews
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
