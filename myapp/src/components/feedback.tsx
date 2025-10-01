import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardDescription } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useToast } from "@/hooks/use-toast";
import { API_URL, useAuth } from "@/context/auth_provider";
import {
  CheckCircle,
  AlertCircle,
  Star,
  Send,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";

function Feedback() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formdata, setFormdata] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    rating: 0,
    subject: "",
    message: "",
  });
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: string, value: string | number) => {
    setFormdata((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formdata.name.trim()) {
      setError("Please enter your name.");
      return false;
    }
    if (!formdata.email.trim() || !/\S+@\S+\.\S+/.test(formdata.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (formdata.rating < 1 || formdata.rating > 5) {
      setError("Please provide a rating between 1 and 5 stars.");
      return false;
    }
    if (
      formdata.subject.trim().length < 3 ||
      formdata.subject.trim().length > 100
    ) {
      setError("Subject must be between 3 and 100 characters.");
      return false;
    }
    if (
      formdata.message.trim().length < 10 ||
      formdata.message.trim().length > 5000
    ) {
      setError("Message must be between 10 and 5000 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/_/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          _id: user._id,
          rating: formdata.rating,
          subject: formdata.subject,
          message: formdata.message,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage =
          responseData.message ||
          responseData.errors?.[0]?.msg ||
          "Failed to submit feedback";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      setSuccess("Thank you for your feedback! We appreciate your input.");
      toast({
        title: "Feedback Submitted!",
        description:
          "Thank you for your valuable feedback. We'll review it soon.",
      });

      // Reset form (except user info)
      setFormdata({
        ...formdata,
        rating: 0,
        subject: "",
        message: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      const errorMessage =
        "Network error. Please check your connection and try again.";
      setError(errorMessage);
      toast({
        title: "Network Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Voice Shapes Alora
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We value your opinion! Share your experience, tell us what you love,
            and help us improve Alora for everyone. Your feedback is crucial to
            our continuous growth and innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Send className="w-6 h-6" />
                  Leave Your Feedback
                </h2>
                <CardDescription className="text-blue-100 mt-2">
                  Help us enhance your Alora experience by providing your honest
                  thoughts.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Your Name
                      </Label>
                      <Input
                        type="text"
                        id="name"
                        value={formdata.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        value={formdata.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Rating */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Overall Rating
                    </Label>
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isActive =
                            hoveredStar !== null
                              ? star <= hoveredStar
                              : star <= formdata.rating;

                          return (
                            <Button
                              key={star}
                              type="button"
                              variant="ghost"
                              size="sm"
                              aria-label={`Rate ${star} star${
                                star > 1 ? "s" : ""
                              }`}
                              className={`p-2 hover:bg-yellow-50 text-2xl transition-all duration-200 focus:outline-none transform hover:scale-110 ${
                                isActive
                                  ? "text-yellow-400 shadow-md"
                                  : "text-gray-300 hover:text-yellow-400"
                              }`}
                              onClick={() => handleChange("rating", star)}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(null)}
                            >
                              ★
                            </Button>
                          );
                        })}
                      </div>
                      {formdata.rating > 0 && (
                        <Badge variant="outline" className="ml-3">
                          {formdata.rating === 1 && "Poor"}
                          {formdata.rating === 2 && "Fair"}
                          {formdata.rating === 3 && "Good"}
                          {formdata.rating === 4 && "Very Good"}
                          {formdata.rating === 5 && "Excellent"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <Label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Feedback Subject
                    </Label>
                    <Input
                      type="text"
                      id="subject"
                      value={formdata.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      placeholder="Brief summary of your feedback (3-100 characters)"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      maxLength={100}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Min 3 characters</span>
                      <span>{formdata.subject.length}/100</span>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <Label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Detailed Feedback
                    </Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formdata.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Please share your detailed feedback. What did you like? What could be improved? Any suggestions? (10-5000 characters)"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 resize-none"
                      maxLength={5000}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Min 10 characters</span>
                      <span>{formdata.message.length}/5000</span>
                    </div>
                  </div>

                  {/* Error and Success Messages */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-white font-semibold rounded-lg shadow-lg 
                               bg-gradient-to-r from-blue-600 to-purple-600 
                               hover:from-blue-700 hover:to-purple-700 
                               transform hover:scale-[1.02] transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        Submit Feedback
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Why Your Input Matters */}
            <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">
                  Why Your Input Is Important
                </h3>
                <p className="text-purple-100 text-sm leading-relaxed">
                  Your feedback directly contributes to making Alora better. We
                  use your suggestions to develop new features, resolve issues,
                  and create a more tailored experience for all our users. Every
                  comment is carefully reviewed and considered by our team.
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Feedback Impact
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Features Improved
                    </span>
                    <Badge variant="secondary">50+</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Issues Resolved
                    </span>
                    <Badge variant="secondary">200+</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      User Satisfaction
                    </span>
                    <Badge variant="secondary">95%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Alternative */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Other Ways to Reach Us
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Email: feedback@alora.com</p>
                  <p>• Phone: +1 (555) 123-4567</p>
                  <p>• Live Chat: Available 24/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
