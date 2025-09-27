import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { useGeolocation } from "@/hooks/use-geoloaction";
import {
  Search,
  Star,
  Clock,
  Shield,
  CheckCircle,
  Users,
  ArrowRight,
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Wind,
  Droplets,
  Settings,
  Eye,
  ClipboardCheck,
  MessageCircle,
  Home,
  Network,
  Plug,
  Lightbulb,
  Monitor,
  Lock,
  FileText,
  Smile,
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

// Services data matching the design
const services = [
  {
    title: "Plumbing Repair",
    description:
      "Expert solutions for leaks, clogs, and pipe issues. Ensuring smooth water flow throughout your home.",
    icon: Wrench,
    color: "blue",
  },
  {
    title: "Tech Support",
    description:
      "On-demand assistance for software, hardware, and network problems. Get immediate help for all your tech issues.",
    icon: Monitor,
    color: "green",
  },
  {
    title: "Electrical Services",
    description:
      "Safe installation, repair, and maintenance of home electrical systems and appliances. Licensed electricians available.",
    icon: Zap,
    color: "yellow",
  },
  {
    title: "Deep Cleaning",
    description:
      "Thorough and meticulous cleaning services to refresh and rejuvenate your living environment.",
    icon: Shield,
    color: "purple",
  },
  {
    title: "Interior Painting",
    description:
      "Professional painting for walls, ceilings, and trim. Transform your space with expert color consultation.",
    icon: Paintbrush,
    color: "orange",
  },
  {
    title: "Locksmith Services",
    description:
      "Emergency lockouts, lock repair, and installation services for enhanced home safety and security.",
    icon: Lock,
    color: "red",
  },
  {
    title: "Network Setup",
    description:
      "Secure and reliable home network installation and optimization for seamless connectivity across devices.",
    icon: Network,
    color: "blue",
  },
  {
    title: "Water Damage Restoration",
    description:
      "Fast response and effective restoration for water leaks and flood damage, restoring your home quickly.",
    icon: Droplets,
    color: "blue",
  },
  {
    title: "Appliance Repair",
    description:
      "Repair services for common household appliances, extending their lifespan and ensuring optimal performance.",
    icon: Settings,
    color: "gray",
  },
  {
    title: "Fixture Installation",
    description:
      "Installation of new light fixtures, fans, and other electrical components for enhanced home functionality.",
    icon: Lightbulb,
    color: "yellow",
  },
  {
    title: "Window Cleaning",
    description:
      "Professional window cleaning service for clear views and a brighter, more welcoming interior space.",
    icon: Eye,
    color: "blue",
  },
  {
    title: "HVAC Maintenance",
    description:
      "Regular maintenance and repair of heating, ventilation, and air conditioning systems for comfort.",
    icon: Wind,
    color: "green",
  },
];

// Categories for filtering (simplified)
const categories = [
  { name: "All Services", active: true, icon: "🏠" },
  { name: "Home Repair", active: false, icon: "🔧" },
  { name: "Tech Support", active: false, icon: "💻" },
  { name: "Cleaning", active: false, icon: "🧹" },
  { name: "Electrical", active: false, icon: "⚡" },
  { name: "Plumbing", active: false, icon: "🚿" },
];

// How it works steps
const howItWorksSteps = [
  {
    step: "1",
    title: "Choose Your Service",
    description:
      "Select the home service you need from our wide range of professional offerings.",
  },
  {
    step: "2",
    title: "Schedule a Professional",
    description:
      "Connect with qualified and vetted professionals who are available at your convenience.",
  },
  {
    step: "3",
    title: "Relax & Enjoy",
    description:
      "Our professional handles the service while you can focus on what matters most to you.",
  },
];

// Customer testimonials
const testimonials = [
  {
    name: "Sarah J.",
    text: "Alora made finding a plumber incredibly easy and the service was top-notch. Highly recommend their prompt and professional team!",
    rating: 5,
  },
  {
    name: "David K.",
    text: "My computer was fixed in no time! The tech support was professional and efficient. Alora is a true lifesaver for my home tech needs!",
    rating: 5,
  },
];

function HomePage() {

  // Modern stats for trust building
  const detectUserLocation = useGeolocation();
  const stats = [
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "1000+", label: "Verified Pros", icon: Shield },
    { number: "4.9/5", label: "Rating", icon: Star },
    { number: "24/7", label: "Support", icon: Clock },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(
    null
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
        <div>
          {/* Hero Section */}
          <section className="relative min-h-[80vh] flex items-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-gradient-to-r from-gray-100 via-blue-50 to-amber-50 relative">
                {/* City Skyline Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20">
                  <div className="absolute bottom-0 right-0 w-2/3 h-full bg-gradient-to-t from-gray-800 via-gray-600 to-transparent opacity-30"></div>
                  {/* City silhouette */}
                  <div className="absolute bottom-0 right-0 w-2/3 h-1/2">
                    <div className="flex items-end justify-end h-full space-x-1 pr-8">
                      <div className="bg-gray-700 w-8 h-32 opacity-40"></div>
                      <div className="bg-gray-600 w-12 h-40 opacity-40"></div>
                      <div className="bg-gray-700 w-6 h-24 opacity-40"></div>
                      <div className="bg-gray-800 w-16 h-48 opacity-40"></div>
                      <div className="bg-gray-600 w-10 h-36 opacity-40"></div>
                      <div className="bg-gray-700 w-14 h-44 opacity-40"></div>
                      <div className="bg-gray-600 w-8 h-28 opacity-40"></div>
                      <div className="bg-gray-800 w-20 h-52 opacity-40"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Connect with Local
                    <span className="block">Home Service</span>
                    <span className="block">Experts Instantly</span>
                  </h1>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                    From urgent repairs to routine maintenance, Alora connects
                    you directly with certified professionals. Get immediate
                    support with a single call.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg font-semibold rounded-lg flex items-center justify-center"
                      onClick={() => handleCategoryClick("")}
                    >
                      <Plug className="mr-2" size={20} />
                      Call an Expert
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-lg"
                      onClick={() => handleCategoryClick("")}
                    >
                      Explore Professionals
                    </Button>
                  </div>
                </div>

                {/* Right Search Form */}
                <div className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 max-w-md ml-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                      Find Services Near You
                    </h2>

                    <div className="space-y-4">
                      {/* Location Input */}
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Home className="text-gray-400" size={20} />
                        </div>
                        <Input
                          type="text"
                          placeholder="123 Main St, Anytown, USA"
                          className="pl-12 py-4 text-lg border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      {/* Detect Location Button */}
                      <Button
                        variant="ghost"
                        className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-3 rounded-lg flex items-center justify-center"
                        onClick={detectUserLocation.getLocation}
                      >
                        <Settings className="mr-2" size={16} />
                        Detect My Location
                      </Button>

                      {/* Search Button */}
                      <Button
                        size="lg"
                        className="w-full bg-blue-600 hover:bg-blue-700 py-4 text-lg font-semibold rounded-lg flex items-center justify-center"
                        onClick={() => handleCategoryClick("")}
                      >
                        <Search className="mr-2" size={20} />
                        Search Services
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Comprehensive Services
                </h2>
              </div>

              {/* Service Categories Filter */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((category, index) => (
                  <Button
                    key={category.name}
                    variant={category.active ? "default" : "outline"}
                    className={`rounded-full px-6 py-2 ${
                      category.active
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Services Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <Card
                      key={service.title}
                      className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-lg bg-${service.color}-100 flex-shrink-0`}
                          >
                            <IconComponent
                              className={`text-${service.color}-600`}
                              size={24}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {service.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              {service.description}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
                            >
                              Connect with a Pro →
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* How Alora Works Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  How Alora Works
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {howItWorksSteps.map((step, index) => (
                  <div key={step.step} className="text-center">
                    <div className="relative mb-6">
                      <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                        {step.step}
                      </div>
                      {/* Icons for each step */}
                      <div className="mt-4">
                        {index === 0 && (
                          <ClipboardCheck
                            className="mx-auto text-gray-400"
                            size={32}
                          />
                        )}
                        {index === 1 && (
                          <Users className="mx-auto text-gray-400" size={32} />
                        )}
                        {index === 2 && (
                          <MessageCircle
                            className="mx-auto text-gray-400"
                            size={32}
                          />
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Customer Testimonials */}
          <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What Our Customers Say
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card
                    key={testimonial.name}
                    className="border-0 shadow-lg bg-white"
                  >
                    <CardContent className="p-8">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="text-yellow-400 fill-current"
                            size={20}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 italic">
                        "{testimonial.text}"
                      </p>
                      <p className="font-semibold text-gray-900">
                        - {testimonial.name}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your Home?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Experience the convenience and quality of Alora's professional
                home services. Get started today!
              </p>
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-lg"
                onClick={() => handleCategoryClick("")}
              >
                Get a Free Quote
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
  )
};


export default HomePage;
