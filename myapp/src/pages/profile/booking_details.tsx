import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, API_URL } from "@/context/auth_provider";
import { Loader2, Calendar, Clock, MapPin, User, Star, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/booking/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch booking details");
        }
        
        setBooking(data);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError(err instanceof Error ? err.message : "Failed to load booking details");
        toast({
          title: "Error",
          description: "Failed to load booking details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [id, user, toast]);

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
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      case "confirmed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Confirmed</span>;
      case "pending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case "cancelled":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Booking</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/profile")}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Not Found</h3>
          <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate("/profile")}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <Button variant="outline" onClick={() => navigate("/profile")}>
            <X className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Booking #{booking._id.substring(0, 8)}</CardTitle>
                <p className="text-gray-600 mt-1">Booked on {format(new Date(booking.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
              </div>
              {getStatusBadge(booking.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Service Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Service Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">{booking.service}</h4>
                      <p className="text-sm text-gray-600">{booking.professional.category}</p>
                      <p className="text-sm text-gray-600">with {booking.professional.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{format(new Date(booking.date), "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{booking.time}</span>
                  </div>
                </div>
              </div>
              
              {/* Customer Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 mr-2" />
                    <span>{booking.user.fullName}</span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Service Address</h4>
                    <div className="flex items-start text-gray-600">
                      <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        {booking.address.street}<br />
                        {booking.address.city}, {booking.address.state} {booking.address.zip}
                      </span>
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Special Instructions</h4>
                      <p className="text-gray-600">{booking.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Review Section */}
            {booking.status === "completed" && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Review</h3>
                {booking.rating ? (
                  <div>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < booking.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium">{booking.rating}.0</span>
                    </div>
                    {booking.review && (
                      <p className="mt-2 text-gray-600">{booking.review}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">No review has been submitted for this booking yet.</p>
                )}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
              {booking.status === "pending" && (
                <Button 
                  variant="destructive" 
                  onClick={() => handleStatusUpdate("cancelled")}
                  disabled={updating}
                >
                  {updating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Cancel Booking
                </Button>
              )}
              
              {user?.role === "admin" && (
                <>
                  {booking.status === "pending" && (
                    <Button 
                      onClick={() => handleStatusUpdate("confirmed")}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Confirm Booking
                    </Button>
                  )}
                  
                  {booking.status === "confirmed" && (
                    <Button 
                      onClick={() => handleStatusUpdate("completed")}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Mark as Completed
                    </Button>
                  )}
                </>
              )}
              
              <Button variant="outline" onClick={() => navigate(`/professional/${booking.professional._id}`)}>
                View Professional Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}