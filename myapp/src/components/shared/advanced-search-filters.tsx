import { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Badge } from "../ui/badge";
import { MapPin, Clock, Calendar, Star } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "@/context/auth_provider";
import { useGeolocation } from "@/hooks/use-geolocation";
import { proxyFetch } from "@/lib/apiProxy";

interface FilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceFilter: string;
  setPriceFilter: (price: string) => void;
  ratingFilter: string;
  setRatingFilter: (rating: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (availability: string) => void;
  onClearAll: () => void;
  categories: Array<{ name: string; icon: string }>;
}

export function AdvancedSearchFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  priceFilter,
  setPriceFilter,
  ratingFilter,
  setRatingFilter,
  availabilityFilter,
  setAvailabilityFilter,
  onClearAll,
  categories,
}: FilterProps) {
  const [locationFilter, setLocationFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [durationFilter, setDurationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [locationName, setLocationName] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [clearAdvanceclick, setClearAdvancedClick] = useState(false);
  const detectUserLocation = useGeolocation();

  const clearAdvancedFilters = useCallback(() => {
    setSearchQuery("");
    setLocationFilter("");
    setPriceRange([0, 1000]);
    setPriceFilter("");
    setRatingFilter("");
    setAvailabilityFilter("");
    setCoordinates(null);
  }, [
    setSearchQuery,
    setLocationFilter,
    setPriceFilter,
    setRatingFilter,
    setAvailabilityFilter,
    setCoordinates,
  ]);

  // Calculate active filters count
  const activeFiltersCount = [
    searchQuery,
    selectedCategory !== "All Services" ? selectedCategory : null,
    priceFilter,
    ratingFilter,
    availabilityFilter,
    locationFilter,
  ].filter(Boolean).length;

  const fetchAddressFromCoords = async (lat: number, lon: number) => {
    try {
      const data = await proxyFetch(`/geocode/reverse?lat=${lat}&lon=${lon}`);
      if (data && data.address) {
        const place =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.city_district;
        if (place) {
          setLocationFilter(`${place}, ${data.address.state || ""}`);
          // setSearchQuery(`${place}, ${data.address.state || ""}`);
        }
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };
  // Geocoding: Address -> Coords
  const fetchCoordsFromAddress = async (address: string) => {
    try {
      // Use proxy instead of direct API call
      const data = await proxyFetch(
        `/geocode/forward?address=${encodeURIComponent(address)}`
      );
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates({ lat: parseFloat(lat), lon: parseFloat(lon) });
        setLocationFilter(address);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  // Auto update when location detected
  useEffect(() => {
    if (
      locationFilter === "" &&
      !clearAdvanceclick &&
      detectUserLocation.Coordinates
    ) {
      setCoordinates(detectUserLocation.Coordinates);
      fetchAddressFromCoords(
        detectUserLocation.Coordinates.lat,
        detectUserLocation.Coordinates.lon
      );
    }
  }, [detectUserLocation.Coordinates, locationFilter, clearAdvanceclick]);

  useEffect(() => {
    const locationFromParams = searchParams.get("location");
    if (locationFromParams) {
      setLocationFilter(locationFromParams);
    }
  }, [searchParams]);

  return (
    <div className="bg-white border rounded-lg p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearAdvancedFilters();
            setClearAdvancedClick(true);
          }}
          className="text-blue-600 hover:text-blue-700"
        >
          Clear All
        </Button>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <Label
          htmlFor="search"
          className="text-sm font-medium text-gray-700 mb-2 block"
        >
          Search
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Input
            id="search"
            placeholder="Search by name, skill, or service..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-2  flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          Location
        </Label>
        <div className="flex">
          <Input
            placeholder="Enter city or area..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={() => {
              setClearAdvancedClick(false);
              if (detectUserLocation?.Coordinates) {
                const { lat, lon } = detectUserLocation.Coordinates;
                setCoordinates({ lat, lon });
                fetchAddressFromCoords(lat, lon);
              }
            }}
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={1000}
          min={0}
          step={50}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>₹0</span>
          <span>₹1000+</span>
        </div>
      </div>

      {/* Quick Price Filters */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Quick Price
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Budget", value: "low", range: "Under ₹300" },
            { label: "Standard", value: "medium", range: "₹300-₹400" },
            { label: "Premium", value: "high", range: "Above ₹400" },
            { label: "Any", value: "", range: "All prices" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setPriceFilter(option.value)}
              className={`p-2 text-xs rounded-md border transition-colors ${
                priceFilter === option.value
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-gray-500">{option.range}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3  flex items-center">
          <Star className="h-4 w-4 mr-1" />
          Minimum Rating
        </Label>
        <div className="space-y-2">
          {[
            { label: "4.0+", value: "4+" },
            { label: "4.5+", value: "4.5+" },
            { label: "4.8+", value: "4.8+" },
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="rating"
                value={option.value}
                checked={ratingFilter === option.value}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="mr-2 text-blue-600"
              />
              <span className="text-sm text-gray-700 flex items-center">
                {option.label}{" "}
                <Star className="h-3 w-3 text-yellow-400 ml-1 fill-current" />
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3  flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Availability
        </Label>
        <div className="space-y-2">
          {[
            { label: "Available Today", value: "today" },
            { label: "Available Tomorrow", value: "tomorrow" },
            { label: "Available This Week", value: "week" },
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="availability"
                value={option.value}
                checked={availabilityFilter === option.value}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="mr-2 text-blue-600"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full mb-4 text-blue-600 hover:text-blue-700"
      >
        {showAdvanced ? "Hide" : "Show"} Advanced Filters
        <svg
          className={`h-4 w-4 ml-2 transition-transform ${
            showAdvanced ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-6 border-t pt-6">
          {/* Service Duration */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3  flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Service Duration
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Quick", value: "quick", desc: "< 1 hour" },
                { label: "Standard", value: "standard", desc: "1-3 hours" },
                { label: "Extended", value: "extended", desc: "3+ hours" },
                {
                  label: "Multi-day",
                  value: "multiday",
                  desc: "Multiple days",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setDurationFilter(
                      option.value === durationFilter ? "" : option.value
                    )
                  }
                  className={`p-2 text-xs rounded-md border transition-colors ${
                    durationFilter === option.value
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-gray-500">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Experience Level
            </Label>
            <div className="space-y-2">
              {[
                { label: "Entry Level (1-2 years)", value: "entry" },
                { label: "Experienced (3-5 years)", value: "experienced" },
                { label: "Expert (5+ years)", value: "expert" },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="experience"
                    value={option.value}
                    checked={experienceFilter === option.value}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Service Categories */}
      <div className="border-t pt-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Categories
        </Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.name ? "" : category.name
                )
              }
              className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors flex items-center ${
                selectedCategory === category.name
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
