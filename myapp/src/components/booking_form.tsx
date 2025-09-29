import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User as UserIcon,
  Star,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useToast } from "../hooks/use-toast";
import { useAuth, API_URL } from "../context/auth_provider";
import type { User } from "../interfaces/user";

export function BookingForm({ professional }: { professional: User }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");

  const totalSteps = 4;

  const services = [
    {
      id: "basic",
      name: "Basic Service",
      price: professional.hourlyRate || 50,
      duration: "1-2 hours",
      icon: "🔧",
    },
    {
      id: "premium",
      name: "Premium Service",
      price: (professional.hourlyRate || 50) * 1.5,
      duration: "2-4 hours",
      icon: "⭐",
    },
    {
      id: "consultation",
      name: "Consultation",
      price: (professional.hourlyRate || 50) * 0.5,
      duration: "30-60 min",
      icon: "💬",
    },
    {
      id: "emergency",
      name: "Emergency Service",
      price: (professional.hourlyRate || 50) * 2,
      duration: "ASAP",
      icon: "🚨",
    },
  ];

  const timeSlots = [
    { time: "09:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "12:00 PM", available: true },
    { time: "01:00 PM", available: true },
    { time: "02:00 PM", available: false },
    { time: "03:00 PM", available: true },
    { time: "04:00 PM", available: true },
    { time: "05:00 PM", available: true },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!time) {
      toast({
        title: "Error",
        description: "Please select a time slot",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!address.trim()) {
      toast({
        title: "Error",
        description: "Please enter your address",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Parse address into components (simplified)
      const addressParts = address.split(",");
      const street = addressParts[0] || "";
      const city = addressParts[1] || "";
      const state = addressParts[2] || "";
      const zip = addressParts[3] || "";

      // Submit booking to backend
      const response = await fetch(`${API_URL}/booking`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professionalId: professional._id,
          service: selectedService,
          date: date.toISOString(),
          time,
          address: {
            street,
            city,
            state,
            zip,
          },
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      toast({
        title: "Booking Request Sent",
        description: `Your booking request with ${professional.fullName} has been sent. You will receive a confirmation shortly.`,
      });

      // Reset form
      setCurrentStep(1);
      setSelectedService("");
      setTime("");
      setAddress("");
      setNotes("");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to send booking request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== "";
      case 2:
        return date !== undefined;
      case 3:
        return time !== "";
      case 4:
        return address.trim() !== "";
      default:
        return false;
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  currentStep > i + 1
                    ? "bg-green-500 text-white"
                    : currentStep === i + 1
                    ? "bg-blue-500 text-white ring-4 ring-blue-200"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {currentStep > i + 1 ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  i + 1
                )}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={cn(
                    "h-1 w-16 md:w-24 transition-all duration-300",
                    currentStep > i + 1 ? "bg-green-500" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>
      {/* Professional Header Card */}
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold">{professional.fullName}</h3>
              <p className="text-blue-100">{professional.category}</p>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold">
                  {professional.ratings
                    ? (
                        professional.ratings.reduce((a, b) => a + b, 0) /
                        professional.ratings.length
                      ).toFixed(1)
                    : "5.0"}
                </span>
                <Badge
                  variant="secondary"
                  className="ml-3 bg-white/20 text-white border-none"
                >
                  Verified Pro
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Step Content */}
      <Card className="min-h-[400px]">
        <CardContent className="p-8">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Choose Your Service
                </h2>
                <p className="text-gray-600">
                  Select the type of service you need
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={cn(
                      "p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg",
                      selectedService === service.id
                        ? "border-blue-500 bg-blue-50 shadow-md transform scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-3xl mb-3">{service.icon}</div>
                        <h3 className="font-semibold text-lg mb-2">
                          {service.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {service.duration}
                        </p>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-green-600">
                            ₹{service.price}
                          </span>
                          <span className="text-gray-500 ml-1">/service</span>
                        </div>
                      </div>
                      {selectedService === service.id && (
                        <CheckCircle2 className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Pick a Date
                </h2>
                <p className="text-gray-600">
                  When would you like the service?
                </p>
              </div>

              <div className="flex justify-center">
                <div className="bg-white rounded-xl shadow-lg border">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-4"
                    disabled={(date) => date < new Date()}
                  />
                </div>
              </div>

              {date && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="font-semibold text-blue-700">
                    Selected: {format(date, "EEEE, MMMM do, yyyy")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Time Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Choose Time Slot
                </h2>
                <p className="text-gray-600">
                  Available times for {date && format(date, "MMMM do")}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    type="button"
                    variant={time === slot.time ? "default" : "outline"}
                    disabled={!slot.available}
                    className={cn(
                      "p-4 h-auto flex flex-col items-center transition-all duration-300",
                      time === slot.time && "ring-2 ring-blue-400 shadow-lg",
                      !slot.available && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => slot.available && setTime(slot.time)}
                  >
                    <Clock className="w-4 h-4 mb-1" />
                    <span className="font-semibold">{slot.time}</span>
                    {!slot.available && (
                      <span className="text-xs text-red-500 mt-1">Booked</span>
                    )}
                    {slot.available && time !== slot.time && (
                      <span className="text-xs text-green-500 mt-1">
                        Available
                      </span>
                    )}
                  </Button>
                ))}
              </div>

              {time && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-700">
                    Selected: {time}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Address & Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Service Details
                </h2>
                <p className="text-gray-600">
                  Where should we provide the service?
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="address"
                    className="flex items-center text-lg font-semibold"
                  >
                    <MapPin className="mr-2 h-5 w-5 text-blue-500" />
                    Service Address
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete address...\ne.g., 123 Main Street, City, State, ZIP"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={4}
                    className="resize-none text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="notes"
                    className="flex items-center text-lg font-semibold"
                  >
                    <UserIcon className="mr-2 h-5 w-5 text-purple-500" />
                    Special Instructions (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements, access instructions, or additional details..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="resize-none text-base"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6"
        >
          Previous
        </Button>

        <div className="flex space-x-4">
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className="px-8 bg-blue-600 hover:bg-blue-700"
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !canProceedToNext()}
              className="px-8 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Booking Summary */}
      {currentStep === totalSteps && (
        <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
              Booking Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>Professional:</strong> {professional.fullName}
                </p>
                <p>
                  <strong>Service:</strong>{" "}
                  {services.find((s) => s.id === selectedService)?.name}
                </p>
                <p>
                  <strong>Date:</strong> {date && format(date, "MMMM do, yyyy")}
                </p>
                <p>
                  <strong>Time:</strong> {time}
                </p>
              </div>
              <div>
                <p>
                  <strong>Address:</strong> {address.slice(0, 50)}
                  {address.length > 50 ? "..." : ""}
                </p>
                <p>
                  <strong>Estimated Cost:</strong> ₹
                  {services.find((s) => s.id === selectedService)?.price}
                </p>
                {notes && (
                  <p>
                    <strong>Notes:</strong> {notes.slice(0, 50)}
                    {notes.length > 50 ? "..." : ""}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
