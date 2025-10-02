import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";

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

export default function BookingsSection({
  bookings,
  bookingsLoading,
  API_URL,
}: {
  bookings: Booking[];
  bookingsLoading: boolean;
  API_URL: string;
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
          My Bookings
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          View and manage your service bookings.
        </p>
      </div>

      {bookingsLoading ? (
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600">
              Loading your bookings...
            </p>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
            No bookings yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
            You haven't made any bookings yet.
          </p>
          <Link to="/services">
            <Button className="text-sm sm:text-base w-full sm:w-auto">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Book a Service
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {bookings.map((booking) => (
            <Card key={booking._id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {booking.professional.fullName}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {booking.service}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          <span>
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end">
                    <div className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-2">
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm w-full sm:w-auto"
                      asChild
                    >
                      <Link to={`/profile/booking/${booking._id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
