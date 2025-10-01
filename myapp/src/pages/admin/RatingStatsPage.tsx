import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth_provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star, MessageSquare, BookOpen, ArrowLeft } from "lucide-react";
import RatingStats from "@/components/admin/RatingStats";

export default function RatingStatsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Rating Statistics
          </h1>
          <p className="text-gray-600">
            View detailed rating information across the platform
          </p>
        </div>

        <RatingStats />
      </div>
    </div>
  );
}
