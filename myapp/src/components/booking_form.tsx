import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuth, API_URL } from "@/context/auth_provider";
import type { User } from "../interfaces/user";

export function BookingForm({ professional }: { professional: User }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
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
          service: professional.category,
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Book Service</span>
          <span className="text-lg font-bold text-blue-600">
            ₹{professional.hourlyRate}/hr
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Professional Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            <div>
              <h3 className="font-semibold">{professional.fullName}</h3>
              <p className="text-sm text-gray-600">{professional.category}</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-sm">
                  {professional.ratings
                    ? (
                        professional.ratings.reduce((a, b) => a + b, 0) /
                        professional.ratings.length
                      ).toFixed(1)
                    : "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Select Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Select Time
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={time === slot ? "default" : "outline"}
                  className="text-xs"
                  onClick={() => setTime(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Service Address
            </Label>
            <Textarea
              id="address"
              placeholder="Enter your full address (street, city, state, zip)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            />
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center">
              <User as UserIcon className="mr-2 h-4 w-4" />
              Special Instructions (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions for the professional..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "Request Booking"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
