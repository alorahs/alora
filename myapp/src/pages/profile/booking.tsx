import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth_provider";
import { proxyApiRequest } from "@/lib/apiProxy";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Star,
  CheckCircle,
} from "lucide-react";
import { ReviewForm } from "@/components/feedback";

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
  status: "pending" | "confirmed" | "completed" | "cancelled";
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id || !user) {
        navigate("/profile");
        return;
      }

      // Check if the current user is authorized to view this booking
      // Only the booking owner (user) or admin can view this page
      // Professionals should not be able to access this page
      if (user.role === "professional") {
        toast({
          title: "Access Denied",
          description: "Professionals cannot access this page.",
          variant: "destructive",
        });
        navigate("/professionals-dashboard");
        return;
      }

      try {
        setLoading(true);

        const response = await proxyApiRequest(`/booking/${id}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch booking");
        }

        // Additional check to ensure the current user is the booking owner
        if (data.user._id !== user._id) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view this booking.",
            variant: "destructive",
          });
          navigate("/profile");
          return;
        }

        setBooking(data);
      } catch (err) {
        console.error("Error fetching booking:", err);
        toast({
          title: "Error",
          description: "Failed to load booking details. Please try again.",
          variant: "destructive",
        });
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, user, navigate, toast]);

  const handleStatusUpdate = async (newStatus: Booking["status"]) => {
    if (!booking) return;

    try {
      const response = await proxyApiRequest(`/booking/${booking._id}/status`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { status: newStatus },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking status");
      }

      setBooking(data.booking);
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
    }
  };

  const handleReviewSubmitted = () => {
    setReviewSubmitted(true);
    // Refresh the booking data to show the new review
    if (id) {
      proxyApiRequest(`/booking/${id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => setBooking(data))
        .catch((err) => console.error("Error refreshing booking:", err));
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
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
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
            Booking Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            The booking you're looking for could not be found.
          </p>
          <Button onClick={() => navigate("/profile")}>Go to Profile</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/profile")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-gray-600 mt-2">
            View and manage your booking information
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-xl">Booking Information</CardTitle>
              <div className="mt-2 md:mt-0">
                {getStatusBadge(booking.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Service</h3>
                <p className="text-gray-600">{booking.service}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Professional
                </h3>
                <p className="text-gray-600">{booking.professional.fullName}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Date & Time
                </h3>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{booking.time}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                <div className="flex items-start text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                  <span>
                    {booking.address.street}, {booking.address.city},{" "}
                    {booking.address.state} {booking.address.zip}
                  </span>
                </div>
              </div>

              {booking.notes && (
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-gray-600">{booking.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Actions</h3>
              <div className="flex flex-wrap gap-2">
                {booking.status === "pending" && (
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate("cancelled")}
                  >
                    Cancel Booking
                  </Button>
                )}

                {booking.status === "confirmed" && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate("completed")}
                  >
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Section */}
        {booking.status === "completed" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {booking.rating || reviewSubmitted ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Review Submitted
                  </>
                ) : (
                  "Leave a Review"
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {booking.rating || reviewSubmitted ? (
                <div className="text-center py-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${
                          i < (booking.rating || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {booking.review && (
                    <p className="text-gray-700">{booking.review}</p>
                  )}
                  <p className="text-gray-500 mt-4">
                    Thank you for your feedback!
                  </p>
                </div>
              ) : (
                <ReviewForm
                  bookingId={booking._id}
                  professionalId={booking.professional._id}
                  onReviewSubmitted={handleReviewSubmitted}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
