import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { proxyApiRequest } from "@/lib/apiProxy";
import { User } from "@/interfaces/user";

interface TimeSlot {
  start: string;
  end: string;
}

interface AvailabilityDay {
  day: string;
  timeSlots: TimeSlot[];
}

interface ProfessionalAvailabilityProps {
  user: User | null;
  professionalId: string;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ProfessionalAvailability({
  user,
  professionalId,
}: ProfessionalAvailabilityProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityDay[]>(
    DAYS_OF_WEEK.map((day) => ({
      day,
      timeSlots: [],
    }))
  );

  const fetchAvailability = useCallback(async () => {
    if (!professionalId) {
      return;
    }

    try {
      const response = await proxyApiRequest(`/professional/${professionalId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch availability (${response.status})`);
      }

      const data = await response.json();
      if (Array.isArray(data.availability)) {
        setAvailability(
          DAYS_OF_WEEK.map((day) => {
            const dayData = data.availability.find(
              (item: AvailabilityDay) => item.day === day
            );
            return {
              day,
              timeSlots: Array.isArray(dayData?.timeSlots)
                ? dayData.timeSlots
                : [],
            };
          })
        );
      } else {
        setAvailability(
          DAYS_OF_WEEK.map((day) => ({
            day,
            timeSlots: [],
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast({
        title: "Error",
        description: "Failed to load availability",
        variant: "destructive",
      });
    }
  }, [professionalId, toast]);

  // Fetch availability when component mounts
  useEffect(() => {
    void fetchAvailability();
  }, [fetchAvailability]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await proxyApiRequest(
        `/professional/${professionalId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: { availability },
          credentials: "include",
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Availability saved successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save availability");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save availability",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = (dayIndex: number) => {
    setAvailability((prevAvailability) =>
      prevAvailability.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              timeSlots: [...day.timeSlots, { start: "", end: "" }],
            }
          : day
      )
    );
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setAvailability((prevAvailability) =>
      prevAvailability.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              timeSlots: day.timeSlots.filter((_, idx) => idx !== slotIndex),
            }
          : day
      )
    );
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotIndex: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    setAvailability((prevAvailability) =>
      prevAvailability.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              timeSlots: day.timeSlots.map((slot, idx) =>
                idx === slotIndex
                  ? {
                      ...slot,
                      [field]: value,
                    }
                  : slot
              ),
            }
          : day
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Availability Schedule
        </h2>
        <p className="text-gray-600 mb-6">
          Set your availability for bookings.
        </p>
      </div>

      <div className="space-y-8">
        {availability.map((day, dayIndex) => (
          <div key={day.day} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {day.day}
            </h3>
            <div className="space-y-3">
              {day.timeSlots.map((slot, slotIndex) => (
                <div key={slotIndex} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label className="text-sm text-gray-600">Start Time</Label>
                    <Input
                      type="time"
                      value={slot.start}
                      onChange={(e) =>
                        updateTimeSlot(
                          dayIndex,
                          slotIndex,
                          "start",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm text-gray-600">End Time</Label>
                    <Input
                      type="time"
                      value={slot.end}
                      onChange={(e) =>
                        updateTimeSlot(
                          dayIndex,
                          slotIndex,
                          "end",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                    className="mt-6"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addTimeSlot(dayIndex)}
                className="w-full"
              >
                Add Time Slot
              </Button>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Availability"}
          </Button>
        </div>
      </div>
    </div>
  );
}