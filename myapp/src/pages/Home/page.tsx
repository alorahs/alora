import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Search,
  Star,
  Clock,
  Shield,
  CheckCircle,
  Users,
  ArrowRight,
} from "lucide-react";

import Section9 from "./section9";
import ProfessionalProfileModal from "../../components/professional-profile-modal";

// Enhanced professionals data with more comprehensive information for home services
const professionals = [
  {
    id: 1,
    name: "Rajesh Kumar",
    category: "Plumber",
    rating: 4.8,
    reviewCount: 156,
    hourlyRate: 399,
    bio: "Expert plumber with 10+ years of experience in residential and commercial plumbing. Specialized in emergency repairs and modern plumbing solutions.",
    skills: [
      "Pipe Installation",
      "Leak Repair",
      "Bathroom Fitting",
      "Water Heater Service",
      "Emergency Repairs",
      "Drain Cleaning",
    ],
    profileImageURL: "/professional-plumber.png",
    workGalleryURLs: [
      "/plumbing-work-bathroom.jpg",
      "/pipe-installation.png",
      "/water-heater-repair.jpg",
    ],
    availability: "Available Today",
    location: "Mumbai, Maharashtra",
    experience: "10+ years",
    verified: true,
    emergencyService: true,
    responseTime: "Within 30 minutes",
    serviceAreas: ["Mumbai", "Navi Mumbai", "Thane"],
    certifications: ["Licensed Plumber", "Gas Fitting Certified"],
  },
  {
    id: 2,
    name: "Priya Sharma",
    category: "Electrician",
    rating: 4.9,
    reviewCount: 203,
    hourlyRate: 450,
    bio: "Licensed electrician specializing in home wiring, smart home installations, and electrical repairs. Expert in modern electrical systems and safety compliance.",
    skills: [
      "Home Wiring",
      "Smart Home Setup",
      "Electrical Repairs",
      "Panel Upgrades",
      "LED Installation",
      "Safety Inspections",
    ],
    profileImageURL: "/professional-electrician-woman.png",
    workGalleryURLs: [
      "/electrical-wiring-work.jpg",
      "/smart-home-installation.png",
      "/electrical-panel.jpg",
    ],
    availability: "Available Tomorrow",
    location: "Delhi, NCR",
    experience: "8+ years",
    verified: true,
    emergencyService: true,
    responseTime: "Within 1 hour",
    serviceAreas: ["Delhi", "Gurgaon", "Noida", "Faridabad"],
    certifications: ["Licensed Electrician", "Smart Home Certified"],
  },
  {
    id: 3,
    name: "Mohammed Ali",
    category: "AC Technician",
    rating: 4.7,
    reviewCount: 89,
    hourlyRate: 350,
    bio: "Certified AC technician with expertise in installation, maintenance, and repair of all AC brands. Specializes in energy-efficient cooling solutions.",
    skills: [
      "AC Installation",
      "AC Repair",
      "Maintenance",
      "Gas Refilling",
      "Duct Cleaning",
      "Energy Optimization",
    ],
    profileImageURL: "/ac-technician-professional.jpg",
    workGalleryURLs: [
      "/ac-installation-work.jpg",
      "/ac-repair-service.png",
      "/ac-maintenance.jpg",
    ],
    availability: "Available Today",
    location: "Bangalore, Karnataka",
    experience: "6+ years",
    verified: true,
    emergencyService: false,
    responseTime: "Same day",
    serviceAreas: ["Bangalore", "Whitefield", "Electronic City"],
    certifications: ["HVAC Certified", "Refrigeration Expert"],
  },
  {
    id: 4,
    name: "Sunita Devi",
    category: "Maid",
    rating: 4.6,
    reviewCount: 124,
    hourlyRate: 250,
    bio: "Professional house cleaning service with attention to detail and eco-friendly products. Specializes in deep cleaning and regular maintenance.",
    skills: [
      "Deep Cleaning",
      "Regular Maintenance",
      "Kitchen Cleaning",
      "Bathroom Sanitization",
      "Laundry Service",
      "Organizing",
    ],
    profileImageURL: "/professional-maid-woman.jpg",
    workGalleryURLs: [
      "/clean-kitchen.png",
      "/organized-living-room.png",
      "/spotless-bathroom.jpg",
    ],
    availability: "Available This Week",
    location: "Pune, Maharashtra",
    experience: "5+ years",
    verified: true,
    emergencyService: false,
    responseTime: "Next day",
    serviceAreas: ["Pune", "Kharadi", "Baner", "Hinjewadi"],
    certifications: [
      "Professional Cleaning Certified",
      "Eco-Friendly Products Training",
    ],
  },
  {
    id: 5,
    name: "Vikram Singh",
    category: "Carpenter",
    rating: 4.8,
    reviewCount: 167,
    hourlyRate: 400,
    bio: "Master carpenter specializing in custom furniture, kitchen cabinets, and home renovations. Expert in modern woodworking techniques and sustainable materials.",
    skills: [
      "Custom Furniture",
      "Kitchen Cabinets",
      "Door Installation",
      "Wood Flooring",
      "Home Renovation",
      "Repair Work",
    ],
    profileImageURL: "/professional-carpenter-man.jpg",
    workGalleryURLs: [
      "/custom-wooden-furniture.png",
      "/kitchen-cabinet-installation.png",
      "/wooden-door-frame.jpg",
    ],
    availability: "Available Next Week",
    location: "Chennai, Tamil Nadu",
    experience: "12+ years",
    verified: true,
    emergencyService: false,
    responseTime: "2-3 days",
    serviceAreas: ["Chennai", "Tambaram", "OMR", "IT Corridor"],
    certifications: ["Master Carpenter", "Sustainable Wood Working"],
  },
  {
    id: 6,
    name: "Amit Patel",
    category: "Painter",
    rating: 4.5,
    reviewCount: 98,
    hourlyRate: 300,
    bio: "Professional painter with expertise in interior and exterior painting, texture work, and color consultation. Specializes in premium finishes and design aesthetics.",
    skills: [
      "Interior Painting",
      "Exterior Painting",
      "Texture Work",
      "Color Consultation",
      "Wall Design",
      "Waterproofing",
    ],
    profileImageURL: "/professional-painter-man.jpg",
    workGalleryURLs: [
      "/painted-living-room-interior.jpg",
      "/exterior-house-painting.png",
      "/textured-wall-finish.jpg",
    ],
    availability: "Available Today",
    location: "Hyderabad, Telangana",
    experience: "7+ years",
    verified: true,
    emergencyService: false,
    responseTime: "Same day",
    serviceAreas: ["Hyderabad", "Secunderabad", "Cyberabad"],
    certifications: ["Professional Painter", "Color Design Specialist"],
  },
];

function HomePage() {
  const location = useLocation();

  // Simplified categories for cleaner design
  const categories = [
    {
      name: "Plumber",
      icon: "🔧",
      description: "Emergency repairs & installations",
    },
    {
      name: "Electrician",
      icon: "⚡",
      description: "Wiring & smart home solutions",
    },
    {
      name: "AC Technician",
      icon: "❄️",
      description: "Cooling system services",
    },
    {
      name: "Cleaner",
      icon: "🧹",
      description: "Professional cleaning services",
    },
    {
      name: "Carpenter",
      icon: "🔨",
      description: "Custom furniture & repairs",
    },
    {
      name: "Painter",
      icon: "🎨",
      description: "Interior & exterior painting",
    },
  ];

  // Modern stats for trust building
  const stats = [
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "1000+", label: "Verified Pros", icon: Shield },
    { number: "4.9/5", label: "Rating", icon: Star },
    { number: "24/7", label: "Support", icon: Clock },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(
    null
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);

  // Enhanced filtering and sorting logic for better home services experience
  const sortedProfessionals = professionals
    .filter((pro) => {
      // Enhanced search to include location and bio
      const matchesSearch =
        searchQuery.trim() === "" ||
        pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        !selectedCategory || pro.category === selectedCategory;

      let matchesPrice = true;
      if (priceFilter === "low") matchesPrice = pro.hourlyRate < 300;
      else if (priceFilter === "medium")
        matchesPrice = pro.hourlyRate >= 300 && pro.hourlyRate <= 400;
      else if (priceFilter === "high") matchesPrice = pro.hourlyRate > 400;

      let matchesRating = true;
      if (ratingFilter === "4+") matchesRating = pro.rating >= 4.0;
      else if (ratingFilter === "4.5+") matchesRating = pro.rating >= 4.5;
      else if (ratingFilter === "4.8+") matchesRating = pro.rating >= 4.8;

      let matchesAvailability = true;
      if (availabilityFilter === "today")
        matchesAvailability = pro.availability.toLowerCase().includes("today");
      else if (availabilityFilter === "tomorrow")
        matchesAvailability = pro.availability
          .toLowerCase()
          .includes("tomorrow");
      else if (availabilityFilter === "week")
        matchesAvailability = pro.availability.toLowerCase().includes("week");
      else if (availabilityFilter === "emergency")
        matchesAvailability = pro.emergencyService;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesAvailability
      );
    })
    // Enhanced sorting: prioritize verified professionals and emergency services
    .sort((a, b) => {
      // First sort by verified status
      if (a.verified !== b.verified) {
        return b.verified ? 1 : -1;
      }
      // Then by emergency service availability
      if (
        availabilityFilter === "emergency" &&
        a.emergencyService !== b.emergencyService
      ) {
        return b.emergencyService ? 1 : -1;
      }
      // Finally by rating
      return b.rating - a.rating;
    });

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceFilter(null);
    setRatingFilter(null);
    setAvailabilityFilter(null);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    if (location.pathname !== "/professionals") {
      // Navigate to /professionals if not already there
      window.history.pushState({}, "", "/professionals");
      const navEvent = new PopStateEvent("popstate");
      window.dispatchEvent(navEvent);
    } else {
      // Already on /professionals, just update the state
      setSelectedCategory(categoryName);
    }
  };

  const handleViewSwitch = () => {
    if (location.pathname === "/professionals") {
      window.history.pushState({}, "", "/");
      const navEvent = new PopStateEvent("popstate");
      window.dispatchEvent(navEvent);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {location.pathname === "/" && (
        <div className="space-y-24">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                  Your Home.
                  <span className="block text-blue-600">Our Experts.</span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed">
                  Connect with verified professionals for all your home service
                  needs. Quality work, transparent pricing, instant booking.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12">
                  <div className="relative bg-white rounded-2xl shadow-xl p-2 border border-gray-100">
                    <div className="flex items-center">
                      <Search className="text-gray-400 ml-4" size={20} />
                      <Input
                        placeholder="Search for services..."
                        className="flex-1 border-0 focus:ring-0 text-lg h-14 pl-4"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 h-12 px-8 mr-1 rounded-xl"
                        onClick={() => handleCategoryClick(searchQuery)}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Popular Services
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Book trusted professionals for your home needs
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map((category, index) => (
                  <Card
                    key={category.name}
                    className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="text-blue-600" size={24} />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {stat.number}
                      </div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Why Choose Alora?
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  We make home services simple, safe, and reliable
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Shield,
                    title: "Verified Professionals",
                    description:
                      "Background-checked and licensed experts you can trust",
                  },
                  {
                    icon: CheckCircle,
                    title: "Quality Guaranteed",
                    description:
                      "100% satisfaction guarantee or your money back",
                  },
                  {
                    icon: Clock,
                    title: "Quick Response",
                    description: "Fast booking with same-day service available",
                  },
                ].map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card
                      key={feature.title}
                      className="text-center border-0 shadow-lg"
                    >
                      <CardContent className="p-8">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                          <IconComponent className="text-blue-600" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-blue-600 py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to get started?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of satisfied customers who trust Alora for their
                home services
              </p>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                onClick={() => handleCategoryClick("")}
              >
                Find Professionals
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </section>
        </div>
      )}

      {location.pathname === "/professionals" && (
        <Section9
          categories={categories}
          handleViewSwitch={handleViewSwitch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortedProfessionals={sortedProfessionals}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          clearAllFilters={clearAllFilters}
          setSelectedProfessional={setSelectedProfessional}
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
        />
      )}

      {selectedProfessional && (
        <ProfessionalProfileModal
          professional={selectedProfessional}
          isOpen={!!selectedProfessional}
          onClose={() => setSelectedProfessional(null)}
          onBookNow={() => {
            setSelectedProfessional(null);
          }}
        />
      )}
    </div>
  );
}

export default HomePage;
