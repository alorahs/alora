import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth, API_URL } from "@/context/auth_provider";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Star, 
  User, 
  Settings, 
  CreditCard,
  Bookmark,
  Bell,
  Home,
  Wrench,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReviewForm } from "@/components/review_form";
import { format } from "date-fns";

// Define TypeScript interfaces
interface Booking {
  _id: string;
  service: string;
  professional: {
    _id: string;
    fullName: string;
    category: string;
  };
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  rating?: number;
  review?: string;
  createdAt: string;
}

interface Favorite {
  _id: string;
  professional: {
    _id: string;
    fullName: string;
    category: string;
    rating: number;
    profilePicture?: string;
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user bookings from backend
        setBookingsLoading(true);
        setBookingsError(null);
        const bookingsResponse = await fetch(`${API_URL}/booking`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData);
          
          // Calculate booking statistics
          const upcoming = bookingsData.filter((booking: Booking) => booking.status === "confirmed").length;
          const completed = bookingsData.filter((booking: Booking) => booking.status === "completed").length;
          
          setUpcomingBookings(upcoming);
          setCompletedBookings(completed);
        } else {
          console.error('Failed to fetch bookings');
          setBookingsError("Failed to load bookings");
        }
        setBookingsLoading(false);
        
        // Fetch user favorites from backend
        const favoritesResponse = await fetch(`${API_URL}/favorite`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          setFavorites(favoritesData);
        } else {
          console.error('Failed to fetch favorites');
          // Use mock data as fallback
          const mockFavoritesData: Favorite[] = [
            {
              _id: "1",
              professional: {
                _id: "1",
                fullName: "Rajesh Kumar",
                category: "Plumber",
                rating: 4.8,
              }
            },
            {
              _id: "2",
              professional: {
                _id: "2",
                fullName: "Priya Sharma",
                category: "Electrician",
                rating: 4.9,
              }
            },
          ];
          
          setFavorites(mockFavoritesData);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setBookingsError("Failed to load bookings");
      } finally {
        setBookingsLoading(false);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleReviewSubmitted = () => {
    setShowReviewForm(null);
    // Refresh bookings to show the new review
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const bookingsResponse = await fetch(`${API_URL}/booking`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData);
        }
      } catch (err) {
        console.error("Error refreshing bookings:", err);
      }
    };
    
    fetchData();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case "confirmed":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.fullName}</h1>
          <p className="text-gray-600 mt-2">Manage your bookings and account settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Bookings</p>
                  <p className="text-2xl font-semibold text-gray-900">{upcomingBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Bookings</p>
                  <p className="text-2xl font-semibold text-gray-900">{completedBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Favorites</p>
                  <p className="text-2xl font-semibold text-gray-900">{favorites.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="mr-2 h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <Link to="/professionals">
                    <Home className="h-5 w-5 mb-1" />
                    <span>Book Service</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <Link to="/profile">
                    <User className="h-5 w-5 mb-1" />
                    <span>Profile</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <Link to="/settings">
                    <Settings className="h-5 w-5 mb-1" />
                    <span>Settings</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <Link to="/feedback">
                    <Bell className="h-5 w-5 mb-1" />
                    <span>Feedback</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.filter(booking => booking.status === "confirmed").length > 0 ? (
                  <div className="space-y-4">
                    {bookings.filter(booking => booking.status === "confirmed").map(booking => (
                      <div key={booking._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{booking.professional.fullName}</h3>
                          <p className="text-sm text-gray-500">{booking.service}</p>
                          <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(booking.status)}
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming bookings</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by booking a service.</p>
                    <div className="mt-6">
                      <Button asChild>
                        <Link to="/professionals">Book a Service</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                <Button variant="outline" asChild>
                  <Link to="/profile/bookings">View All</Link>
                </Button>
              </div>
              
              {bookingsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : bookingsError ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-800">Failed to load bookings: {bookingsError}</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings yet</h3>
                  <p className="text-gray-500">You haven't made any bookings. Find a professional to get started.</p>
                  <Button className="mt-4" asChild>
                    <Link to="/professionals">Browse Professionals</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <Card key={booking._id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                            <div>
                              <h3 className="font-semibold text-gray-900">{booking.professional?.fullName || "Professional"}</h3>
                              <p className="text-sm text-gray-600">{booking.service}</p>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{format(new Date(booking.date), "MMM d, yyyy")}</span>
                                <Clock className="h-4 w-4 ml-3 mr-1" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="mt-2">
                                <Badge variant={
                                  booking.status === "completed" ? "default" : 
                                  booking.status === "confirmed" ? "secondary" : 
                                  booking.status === "cancelled" ? "destructive" : "outline"
                                }>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {booking.status === "completed" && !booking.rating && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setShowReviewForm(booking._id)}
                              >
                                Review
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                            >
                              <Link to={`/profile/booking/${booking._id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                        
                        {showReviewForm === booking._id && (
                          <ReviewForm 
                            bookingId={booking._id} 
                            professionalId={booking.professional?._id} 
                            onReviewSubmitted={handleReviewSubmitted} 
                          />
                        )}
                        
                        {booking.rating && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < booking.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} 
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm font-medium">{booking.rating}.0</span>
                            </div>
                            {booking.review && (
                              <p className="mt-1 text-sm text-gray-600">{booking.review}</p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Favorites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bookmark className="mr-2 h-5 w-5" />
                  Favorite Professionals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <div className="space-y-4">
                    {favorites.map(favorite => (
                      <div key={favorite._id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{favorite.professional.fullName}</h3>
                          <p className="text-sm text-gray-500">{favorite.professional.category}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm">{favorite.professional.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Bookmark className="mx-auto h-8 w-8 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No favorites yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Save your favorite professionals.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/settings">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Methods
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/settings">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}