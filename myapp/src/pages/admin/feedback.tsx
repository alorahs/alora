import { useState, useEffect } from "react";
import { useAuth, API_URL } from "@/context/auth_provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, MessageSquare } from "lucide-react";

interface Feedback {
  _id: string;
  rating: number;
  subject: string;
  message: string;
  createdAt: string;
}

export default function FeedbackList() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/feedback`);
      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p className="text-center text-red-600">
              Access Denied: Admin privileges required
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading feedback...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Feedback Management
          </h1>
          <p className="text-gray-600">View and manage user feedback</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedback.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No feedback yet
              </h3>
              <p className="text-gray-600">
                Feedback from users will appear here.
              </p>
            </div>
          ) : (
            feedback.map((item) => (
              <Card
                key={item._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg truncate">
                      {item.subject || "No Subject"}
                    </span>
                    <Badge variant="outline" className="ml-2">
                      {item.rating}/5
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    {renderStars(item.rating)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Message:
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.message || "No message provided"}
                      </p>
                    </div>

                    <div className="flex items-center text-xs text-gray-500 pt-2 border-t">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {feedback.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Feedback Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {feedback.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Feedback</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(
                      feedback.reduce((sum, item) => sum + item.rating, 0) /
                      feedback.length
                    ).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {feedback.filter((item) => item.rating >= 4).length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Positive (4-5 stars)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {feedback.filter((item) => item.rating <= 2).length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Negative (1-2 stars)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
