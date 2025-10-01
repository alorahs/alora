import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, API_URL } from "@/context/auth_provider";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  Star,
} from "lucide-react";
import { format } from "date-fns";

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

export default function ProfessionalBookingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id || !user) {
        navigate("/professionals-dashboard");
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/booking/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch booking");
        }

        // Check if the professional is authorized to view this booking
        if (data.professional._id !== user._id) {
          toast({
            title: "Access Denied",
            description: "You are not authorized to view this booking.",
            variant: "destructive",
          });
          navigate("/professionals-dashboard");
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
        navigate("/professionals-dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, user, navigate, toast]);

  const handleStatusUpdate = async (newStatus: Booking["status"]) => {
    if (!booking) return;

    setUpdating(true);

    try {
      const response = await fetch(`${API_URL}/booking/${booking._id}/status`, {
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
          <Button onClick={() => navigate("/professionals-dashboard")}>
            Go to Dashboard
          </Button>
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
            onClick={() => navigate("/professionals-dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
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
                <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
                <p className="text-gray-600">{booking.user.fullName}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Date & Time
                </h3>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {format(new Date(booking.date), "EEE, MMM d, yyyy")}
                  </span>
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
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate("rejected")}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Reject Booking
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate("confirmed")}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Confirm Booking
                    </Button>
                  </>
                )}

                {booking.status === "confirmed" && (
                  <Button
                    onClick={() => handleStatusUpdate("completed")}
                    disabled={updating}
                  >
                    {updating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating and Review Section - Only visible to professionals for completed bookings */}
        {booking.status === "completed" &&
          (booking.rating || booking.review) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Client Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {booking.rating && (
                  <div className="flex items-center mb-4">
                    <span className="text-gray-600 mr-2">Rating:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < (booking.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{booking.rating}/5</span>
                  </div>
                )}

                {booking.review && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Review</h3>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {booking.review}
                    </p>
                  </div>
                )}

                {!booking.rating && !booking.review && (
                  <p className="text-gray-500 italic">
                    The client has not provided feedback for this booking yet.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

        {/* Booking Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                </div>
                <div className="pb-4">
                  <p className="font-medium">Booking Created</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(booking.createdAt), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      booking.status === "pending"
                        ? "bg-yellow-500"
                        : booking.status === "confirmed" ||
                          booking.status === "completed"
                        ? "bg-green-500"
                        : booking.status === "rejected"
                        ? "bg-red-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                </div>
                <div className="pb-4">
                  <p className="font-medium">
                    {booking.status === "pending"
                      ? "Awaiting Confirmation"
                      : booking.status === "confirmed"
                      ? "Booking Confirmed"
                      : booking.status === "rejected"
                      ? "Booking Rejected"
                      : "Booking Confirmed"}
                  </p>
                  {booking.status !== "pending" &&
                    booking.status !== "rejected" && (
                      <p className="text-sm text-gray-600">
                        {format(
                          new Date(booking.updatedAt),
                          "MMM d, yyyy h:mm a"
                        )}
                      </p>
                    )}
                  {booking.status === "rejected" && (
                    <p className="text-sm text-gray-600">
                      {format(
                        new Date(booking.updatedAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      booking.status === "completed"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                </div>
                <div>
                  <p className="font-medium">
                    {booking.status === "completed"
                      ? "Booking Completed"
                      : booking.status === "rejected"
                      ? "Booking Rejected"
                      : "Complete Service"}
                  </p>
                  {booking.status === "completed" && (
                    <p className="text-sm text-gray-600">
                      {format(
                        new Date(booking.updatedAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
