import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { StarIcon } from "lucide-react";
import { Img } from "react-image";
import { AdvancedSearchFilters } from "../../components/advanced-search-filters";

// Define the Professional interface to match what's passed from the parent
interface Professional {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  bio: string;
  skills: string[];
  profileImageURL: string;
  workGalleryURLs: string[];
  availability: string;
  location: string;
  experience?: string;
  verified?: boolean;
  emergencyService?: boolean;
  responseTime?: string;
  serviceAreas?: string[];
  certifications?: string[];
}

function Layout({ categories, selectedCategory, setSelectedCategory, sortedProfessionals, searchQuery, setSearchQuery, priceFilter, setPriceFilter, ratingFilter, setRatingFilter, availabilityFilter, setAvailabilityFilter, clearAllFilters, showMobileFilters, setShowMobileFilters, setSelectedProfessional }:
  { categories: { name: string; icon: string }[]; selectedCategory: string | null; setSelectedCategory: (category: string | null) => void; sortedProfessionals: Professional[]; searchQuery: string; setSearchQuery: (query: string) => void; priceFilter: string | null; setPriceFilter: (filter: string | null) => void; ratingFilter: string | null; setRatingFilter: (filter: string | null) => void; availabilityFilter: string | null; setAvailabilityFilter: (filter: string | null) => void; clearAllFilters: () => void; showMobileFilters: boolean; setShowMobileFilters: (show: boolean) => void; setSelectedProfessional: (professional: Professional) => void; }) {


  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory ? `${selectedCategory} Professionals` : "All Professionals"}
              </h1>
              <p className="text-gray-600">{sortedProfessionals.length} professionals available</p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 sm:flex-none sm:w-64">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <Input
                    placeholder="Search professionals..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                  />
                </svg>
                Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <AdvancedSearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory ?? ""}
              setSelectedCategory={setSelectedCategory}
              priceFilter={priceFilter ?? ""}
              setPriceFilter={setPriceFilter}
              ratingFilter={ratingFilter ?? ""}
              setRatingFilter={setRatingFilter}
              availabilityFilter={availabilityFilter ?? ""}
              setAvailabilityFilter={setAvailabilityFilter}
              onClearAll={clearAllFilters}
              categories={categories}
            />
          </div>

          {showMobileFilters && (
            <div className="lg:hidden bg-white border rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Clear All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Price Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price-mobile"
                        value="low"
                        checked={priceFilter === "low"}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Under ₹300</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price-mobile"
                        value="medium"
                        checked={priceFilter === "medium"}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">₹300 - ₹400</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price-mobile"
                        value="high"
                        checked={priceFilter === "high"}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Above ₹400</span>
                    </label>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rating-mobile"
                        value="4+"
                        checked={ratingFilter === "4+"}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 flex items-center">
                        4.0+ <StarIcon className="h-3 w-3 text-yellow-400 ml-1" />
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rating-mobile"
                        value="4.5+"
                        checked={ratingFilter === "4.5+"}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 flex items-center">
                        4.5+ <StarIcon className="h-3 w-3 text-yellow-400 ml-1" />
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rating-mobile"
                        value="4.8+"
                        checked={ratingFilter === "4.8+"}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 flex items-center">
                        4.8+ <StarIcon className="h-3 w-3 text-yellow-400 ml-1" />
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability-mobile"
                      value="today"
                      checked={availabilityFilter === "today"}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Today</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability-mobile"
                      value="tomorrow"
                      checked={availabilityFilter === "tomorrow"}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Tomorrow</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability-mobile"
                      value="week"
                      checked={availabilityFilter === "week"}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">This Week</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Professional Listings */}
          <div className="flex-1">
            {sortedProfessionals.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No professionals found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                <div className="mt-6">
                  <Button onClick={clearAllFilters}>Clear all filters</Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProfessionals.map((professional) => (
                  <Card
                    key={professional.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedProfessional(professional)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <Img
                          src={professional.profileImageURL || "/placeholder.svg"}
                          alt={professional.name}
                          className="w-full h-48 object-cover"
                        />
                        {professional.verified && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Verified
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{professional.name}</h3>
                            <p className="text-sm text-blue-600">{professional.category}</p>
                          </div>
                          <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium ml-1">{professional.rating}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>{professional.location}</span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-gray-900">₹{professional.hourlyRate}</span>
                            <span className="text-gray-600 text-sm">/visit</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProfessional(professional);
                            }}>
                              View Profile
                            </Button>
                            <Button size="sm" asChild onClick={(e) => e.stopPropagation()}>
                              <a href={`/professional/${professional.id}/reviews`}>
                                Reviews ({professional.reviewCount})
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Layout;
