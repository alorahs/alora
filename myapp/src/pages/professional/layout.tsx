import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { StarIcon } from "lucide-react";
import { Img } from "react-image";
import { AdvancedSearchFilters } from "../../components/advanced-search-filters";
import { useNavigate } from "react-router-dom";

function Layout({
  categories,
  selectedCategory,
  setSelectedCategory,
  sortedProfessionals,
  searchQuery,
  setSearchQuery,
  priceFilter,
  setPriceFilter,
  ratingFilter,
  setRatingFilter,
  availabilityFilter,
  setAvailabilityFilter,
  clearAllFilters,
  showMobileFilters,
  setShowMobileFilters,
  setSelectedProfessional,
}: {
  categories: { name: string; icon: string }[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  sortedProfessionals: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceFilter: string | null;
  setPriceFilter: (filter: string | null) => void;
  ratingFilter: string | null;
  setRatingFilter: (filter: string | null) => void;
  availabilityFilter: string | null;
  setAvailabilityFilter: (filter: string | null) => void;
  clearAllFilters: () => void;
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
  setSelectedProfessional: (professional: any) => void;
}) {
  const navigate = useNavigate();
  
  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          {/* Category Filter Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full ${
                  !selectedCategory
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-50"
                }`}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={
                    selectedCategory === category.name ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className={`rounded-full flex items-center gap-2 ${
                    selectedCategory === category.name
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory
                  ? `${selectedCategory} Professionals`
                  : "All Professionals"}
              </h1>
              <p className="text-gray-600">
                {sortedProfessionals.length} professionals available
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 sm:flex-none sm:w-64">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      className="h-5 w-5"
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
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileFilters(false)}
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Price Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Price Range
                  </h4>
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
                        4.0+{" "}
                        <StarIcon className="h-3 w-3 text-yellow-400 ml-1" />
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
                        4.5+{" "}
                        <StarIcon className="h-3 w-3 text-yellow-400 ml-1" />
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
                        4.8+{" "}
                        <StarIcon className="h-3 w-3 text-yellow-400 ml-1" />
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

          <div className="flex-1">
            {sortedProfessionals.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="h-5 w-5"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No professionals found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {sortedProfessionals.map((pro, index) => (
                  <Card
                    key={pro.id}
                    className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start mb-4">
                        <Img
                          src={pro.profileImageURL || "/placeholder.svg"}
                          alt={pro.name}
                          width={60}
                          height={60}
                          className="rounded-full mr-4 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">
                            {pro.name}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {pro.category}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <svg
                              className="h-3 w-3 mr-1 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
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
                            <span className="truncate">{pro.location}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                          <span className="ml-1 font-semibold">
                            {pro.rating}
                          </span>
                          <span className="ml-1 text-gray-600 text-sm">
                            ({pro.reviewCount} reviews)
                          </span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">
                          {pro.availability}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {pro.bio}
                      </p>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {pro.skills
                            .slice(0, 3)
                            .map((skill: string, index: number) => (
                              <span
                                key={index}
                                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          {pro.skills.length > 3 && (
                            <span className="inline-block text-gray-500 text-xs px-2 py-1">
                              +{pro.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          From ₹{pro.hourlyRate}/visit
                        </span>
                        <Button
                          onClick={() => navigate(`/professionals/${pro.id}`)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          View Profile
                        </Button>
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
