import { useState } from "react";
import Layout from "./layout";
import ProfessionalProfileModal from "@/components/professional-profile-modal";
import { categories } from "../Home/page";
export function ProfessionalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const sortedProfessionals = professionals.filter((pro) => {
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
  }).sort((a, b) => {
    if (a.verified !== b.verified) {
      return b.verified ? 1 : -1;
    }
    if (
      availabilityFilter === "emergency" &&
      a.emergencyService !== b.emergencyService
    ) {
      return b.emergencyService ? 1 : -1;
    }
    return b.rating - a.rating;
  });

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceFilter(null);
    setRatingFilter(null);
    setAvailabilityFilter(null);
  };


  return (
    <>
      <Layout
        categories={categories}
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
    </>
  );
}

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