import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth_provider";
import { proxyApiRequest } from "@/lib/apiProxy";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  Image, 
  Award, 
  Clock, 
  Star,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import ProfessionalProfileForm from "@/components/professional/professional-profile-form";
import ProfessionalPortfolio from "@/components/professional/professional-portfolio";
import ProfessionalAvailability from "@/components/professional/professional-availability";
import ProfessionalCertifications from "@/components/professional/professional-certifications";

interface Booking {
  _id: string;
  service: string;
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
  createdAt: string;
  updatedAt: string;
}

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const userId = user?._id ?? "";
  const [professionalId, setProfessionalId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchProfessionalData = useCallback(async () => {
    if (!userId) {
      setProfessionalId("");
      setStats((prev) => ({
        ...prev,
        averageRating: 0,
        totalReviews: 0,
      }));
      return;
    }

    try {
      const response = await proxyApiRequest(`/professional/${userId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch professional data (${response.status})`);
      }

      const data = await response.json();
      setProfessionalId(data._id);
      setStats((prev) => ({
        ...prev,
        averageRating: data.averageRating || 0,
        totalReviews: data.totalReviews || 0,
      }));
    } catch (error) {
      console.error("Error fetching professional data:", error);
    }
  }, [userId]);

  const fetchBookings = useCallback(async () => {
    if (!userId) {
      setBookings([]);
      setStats((prev) => ({
        ...prev,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
      }));
      return;
    }

    try {
      const response = await proxyApiRequest(
        `/booking/professional/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings (${response.status})`);
      }

      const data = await response.json();
      setBookings(data);

      const pendingBookings = data.filter((b: Booking) => b.status === "pending").length;
      const confirmedBookings = data.filter((b: Booking) => b.status === "confirmed").length;
      const completedBookings = data.filter((b: Booking) => b.status === "completed").length;
      const cancelledBookings = data.filter((b: Booking) => b.status === "cancelled").length;

      setStats((prev) => ({
        ...prev,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
      }));
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, [userId]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      if (!userId || !isMounted) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        await Promise.all([fetchProfessionalData(), fetchBookings()]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [fetchBookings, fetchProfessionalData, userId]);

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: Booking["status"]
  ) => {
    try {
      const response = await proxyApiRequest(`/booking/${bookingId}/status`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { status: newStatus },
      });

      if (response.ok) {
        // Update the booking in state
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: newStatus }
              : booking
          )
        );
        
        // Update stats
        void fetchBookings();
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Please log in
          </h2>
          <p className="text-gray-600">
            You need to be logged in to view this page.
          </p>
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
            Manage your profile, bookings, and services
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Bookings
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.pendingBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Confirmed Bookings
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.confirmedBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Completed Bookings
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.completedBookings}
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
                    Rating
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.averageRating.toFixed(1)} ({stats.totalReviews})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No bookings yet
                    </h3>
                    <p className="text-gray-500">
                      You don't have any bookings at the moment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking._id}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center">
                              <div className="ml-4">
                                <h3 className="font-semibold text-gray-900">
                                  {booking.user.fullName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {booking.service}
                                </p>
                              </div>

                              <div className="mt-4 md:mt-0 md:ml-8">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>
                                    {new Date(booking.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{booking.time}</span>
                                </div>
                              </div>

                              <div className="mt-4 md:mt-0 md:ml-8">
                                <div className="flex items-center text-sm text-gray-600">
                                  <span>
                                    {booking.address.city}, {booking.address.state}
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
                              {booking.status === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleStatusUpdate(booking._id, "rejected")
                                    }
                                  >
                                    Reject
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleStatusUpdate(booking._id, "confirmed")
                                    }
                                  >
                                    Confirm
                                  </Button>
                                </>
                              )}

                              {booking.status === "confirmed" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleStatusUpdate(booking._id, "completed")
                                  }
                                >
                                  Mark as Completed
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardContent className="p-6">
                <ProfessionalProfileForm 
                  user={user} 
                  onUpdate={fetchProfessionalData} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardContent className="p-6">
                {professionalId ? (
                  <ProfessionalPortfolio 
                    user={user} 
                    professionalId={professionalId} 
                  />
                ) : (
                  <div className="text-center py-8">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Professional profile required
                    </h3>
                    <p className="text-gray-500">
                      Please create your professional profile first.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardContent className="p-6">
                {professionalId ? (
                  <ProfessionalAvailability 
                    user={user} 
                    professionalId={professionalId} 
                  />
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Professional profile required
                    </h3>
                    <p className="text-gray-500">
                      Please create your professional profile first.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications">
            <Card>
              <CardContent className="p-6">
                {professionalId ? (
                  <ProfessionalCertifications 
                    user={user} 
                    professionalId={professionalId} 
                  />
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Professional profile required
                    </h3>
                    <p className="text-gray-500">
                      Please create your professional profile first.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}