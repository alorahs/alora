import { useState, useEffect } from "react";
import { API_URL } from "@/context/auth_provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, BookOpen } from "lucide-react";

interface RatingStatsProps {
  className?: string;
}

export default function RatingStats({ className = "" }: RatingStatsProps) {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/stats`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <h3 className="text-lg font-semibold mb-4">Rating Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Booking Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center">Loading...</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                Feedback Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center">Loading...</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 text-green-500 mr-2" />
                Review Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center">Loading...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">Rating Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Booking Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              Booking Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center">
              {stats?.ratings?.avgBooking
                ? stats.ratings.avgBooking.toFixed(2)
                : "0.00"}
              <span className="text-lg text-muted-foreground">/5</span>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-1">
              Average Rating
            </p>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Total Ratings: {stats?.ratings?.totalBookingRatings || 0}
              </p>
              {stats?.ratings?.bookingDistribution && (
                <div className="mt-2 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center">
                      <span className="text-sm w-4">{star}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1" />
                      <div className="flex-1 ml-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{
                              width: `${
                                stats.ratings.totalBookingRatings > 0
                                  ? (stats.ratings.bookingDistribution[star] /
                                      stats.ratings.totalBookingRatings) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm w-8 text-right">
                        {stats.ratings.bookingDistribution[star] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
              Feedback Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center">
              {stats?.ratings?.avgFeedback
                ? stats.ratings.avgFeedback.toFixed(2)
                : "0.00"}
              <span className="text-lg text-muted-foreground">/5</span>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-1">
              Average Rating
            </p>
          </CardContent>
        </Card>

        {/* Review Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 text-green-500 mr-2" />
              Review Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center">
              {stats?.ratings?.avgReview
                ? stats.ratings.avgReview.toFixed(2)
                : "0.00"}
              <span className="text-lg text-muted-foreground">/5</span>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-1">
              Average Rating
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
