import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Shield,
  Clock,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { BookingForm } from "../../components/booking_form";
import { useAuth, API_URL } from "../../context/auth_provider";
import { useToast } from "../../hooks/use-toast";
import { User } from "../../interfaces/user";

export default function BookingPage() {
  const [professional, setProfessional] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch professional data
  useEffect(() => {
    const fetchProfessional = async () => {
      if (!id) return;
      try {
        const response = user
          ? await fetch(`${API_URL}/user/${id}`, { credentials: "include" })
          : await fetch(`${API_URL}/_/users/${id}`);

        if (!response.ok) {
          const data = await response.json();
          toast({
            title: "Error",
            description: data.message || "Failed to load professional.",
            variant: "destructive",
          });
          return;
        }

        const data = await response.json();
        setProfessional(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load professional.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id, user, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading professional...</p>
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Professional Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The professional you're looking for could not be found.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Users, label: "Happy Clients", value: "500+" },
    {
      icon: Star,
      label: "Rating",
      value: professional.ratings
        ? (
            professional.ratings.reduce((a, b) => a + b, 0) /
            professional.ratings.length
          ).toFixed(1)
        : "5.0",
    },
    { icon: Clock, label: "Response Time", value: "< 1 Hour" },
    { icon: Shield, label: "Verified Pro", value: "✓" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              Book Service
            </h1>
            <div className="w-16"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Single Page Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Professional Info Header */}
        <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {professional.fullName.charAt(0)}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {professional.fullName}
              </h2>
              <p className="text-blue-600 font-medium mb-2">
                {professional.category || "Professional Service"}
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span>
                    {professional.ratings
                      ? (
                          professional.ratings.reduce((a, b) => a + b, 0) /
                          professional.ratings.length
                        ).toFixed(1)
                      : "5.0"}
                    ({professional.ratings ? professional.ratings.length : 0}{" "}
                    reviews)
                  </span>
                </div>

                {professional.hourlyRate && (
                  <div className="flex items-center">
                    <span className="text-green-600 font-semibold">
                      ₹{professional.hourlyRate}/hour
                    </span>
                  </div>
                )}

                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-500 mr-1" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white border rounded-lg shadow-sm">
          <div className="bg-blue-50 px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Schedule Your Service
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Choose your preferred date and time for the service
            </p>
          </div>

          <div className="p-6">
            <BookingForm professional={professional} />
          </div>
        </div>
      </div>
    </div>
  );
}
