import { useState, useEffect } from "react";
import Layout from "./layout";
import ProfessionalProfileModal from "@/components/professional-profile-modal";
import { categories } from "../Home/page";
import { API_URL } from "@/context/auth_provider";
import { User } from "../../interfaces/user";

export function ProfessionalPage() {
  const [professionals, setProfessionals] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(
    null
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate average rating for a professional
  const calculateAverageRating = (ratings: number[]): number => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return sum / ratings.length;
  };

  // Convert User to display format for layout
  const convertToDisplayProfessional = (pro: User) => {
    return {
      ...pro,
      id: pro._id,
      name: pro.fullName,
      rating: pro.ratings
        ? pro.ratings.reduce((a, b) => a + b, 0) / pro.ratings.length
        : 0,
      reviewCount: pro.ratings?.length || 0,
      profileImageURL: pro.profilePicture || "/placeholder.svg",
      workGalleryURLs: pro.workGallery || [],
      location: pro.address
        ? `${pro.address.city || ""}, ${pro.address.state || ""}`
        : "Location not specified",
    };
  };

  // Fetch professionals from backend
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/_/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfessionals(data);
        } else {
          throw new Error("Failed to fetch professionals");
        }
      } catch (err) {
        setError("Failed to load professionals. Please try again later.");
      } finally {
        setLoading(false);
        category && setSelectedCategory(category);
      }
    };

    fetchProfessionals();
  }, []);

  // Filter professionals based on search and filters
  const filteredProfessionals = professionals
    .filter((pro) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        pro.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pro.category &&
          pro.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pro.address?.city &&
          pro.address.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pro.bio &&
          pro.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pro.skills &&
          pro.skills.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          ));

      const matchesCategory =
        !selectedCategory ||
        (pro.category && pro.category === selectedCategory);

      let matchesPrice = true;
      if (pro.hourlyRate) {
        if (priceFilter === "low") matchesPrice = pro.hourlyRate < 300;
        else if (priceFilter === "medium")
          matchesPrice = pro.hourlyRate >= 300 && pro.hourlyRate <= 400;
        else if (priceFilter === "high") matchesPrice = pro.hourlyRate > 400;
      }

      let matchesRating = true;
      const avgRating = calculateAverageRating(pro.ratings || []);
      if (ratingFilter === "4+") matchesRating = avgRating >= 4.0;
      else if (ratingFilter === "4.5+") matchesRating = avgRating >= 4.5;
      else if (ratingFilter === "4.8+") matchesRating = avgRating >= 4.8;

      let matchesAvailability = true;
      // For now, we'll simplify availability filtering
      if (availabilityFilter === "today")
        matchesAvailability = pro.availability !== undefined;
      else if (availabilityFilter === "emergency")
        matchesAvailability = pro.emergencyService === true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesAvailability
      );
    })
    .sort((a, b) => {
      // Sort by verified status first, then by average rating
      const aVerified = a.verified ? 1 : 0;
      const bVerified = b.verified ? 1 : 0;

      if (aVerified !== bVerified) {
        return bVerified - aVerified; // Verified professionals first
      }

      const aAvgRating = calculateAverageRating(a.ratings || []);
      const bAvgRating = calculateAverageRating(b.ratings || []);
      return bAvgRating - aAvgRating; // Higher rated professionals first
    });

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceFilter(null);
    setRatingFilter(null);
    setAvailabilityFilter(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading professionals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Professionals
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortedProfessionals={filteredProfessionals.map(
          convertToDisplayProfessional
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        clearAllFilters={clearAllFilters}
        setSelectedProfessional={(prof: FrontendProfessional | null) =>
          setSelectedProfessional(prof)
        }
        showMobileFilters={showMobileFilters}
        setShowMobileFilters={setShowMobileFilters}
      />

      {selectedProfessional && (
        <ProfessionalProfileModal
          professional={selectedProfessional}
          isOpen={!!selectedProfessional}
          onClose={() => setSelectedProfessional(null)}
        />
      )}
    </>
  );
}
