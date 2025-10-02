import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  Search,
  Star,
  Settings,
  Home,
  Plug,
  Monitor,
  Wrench,
  Zap,
  Paintbrush,
  Shield,
  Lock,
  Network,
  Droplets,
  Lightbulb,
  Eye,
  Wind,
  ClipboardCheck,
  Users,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { API_URL } from "@/context/auth_provider";

// Tailwind color map for services
const colorClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  yellow: "bg-yellow-100 text-yellow-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
  gray: "bg-gray-100 text-gray-600",
};

// Categories
export const categories = [
  { name: "All Services", icon: "🏠" },
  { name: "Home Repair", icon: "🔧" },
  { name: "Tech Support", icon: "💻" },
  { name: "Cleaning", icon: "🧹" },
  { name: "Electrical", icon: "⚡" },
  { name: "Plumbing", icon: "🚿" },
];

// Steps
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

// Testimonials

function HomePage() {
  const navigate = useNavigate();
  const detectUserLocation = useGeolocation();
  const [activeCategory, setActiveCategory] = useState("All Services");
  const [searchQuery, setSearchQuery] = useState("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [locationName, setLocationName] = useState("");
  const [services, setServices] = useState<
    {
      title: string;
      description: string;
      icon: any;
      color: string;
      category: string;
    }[]
  >([]);
  const [testimonials, setTestimonials] = useState<
    {
      name: string;
      message: string;
      rating: number;
    }[]
  >([]);
  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/services`, { method: "GET" });
        const data = await res.json();

        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  // Reverse Geocoding: Coords -> Address
  const fetchAddressFromCoords = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `${API_URL}/geocode/reverse?lat=${lat}&lon=${lon}`,
        { method: "GET" }
      );
      const data = await res.json();
      const place =
        data?.address.city ||
        data?.address.town ||
        data?.address.village ||
        data?.address.city_district;
      if (place) {
        setLocationName(`${place}, ${data.address.state || ""}`);
        setSearchQuery(`${place}, ${data.address.state || ""}`);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Geocoding: Address -> Coords
  const fetchCoordsFromAddress = async (address: string) => {
    try {
      const res = await fetch(
        `${API_URL}/geocode/forward?address=${encodeURIComponent(address)}`,
        { method: "GET" }
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates({ lat: parseFloat(lat), lon: parseFloat(lon) });
        setLocationName(address);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  // Auto update when location detected
  useEffect(() => {
    if (detectUserLocation.Coordinates) {
      setCoordinates(detectUserLocation.Coordinates);
      fetchAddressFromCoords(
        detectUserLocation.Coordinates.lat,
        detectUserLocation.Coordinates.lon
      );
    }
  }, [detectUserLocation.Coordinates]);

  const onClickToServiceButton = (serviceTitle: string) => {
    navigate(
      `/professionals?category=${encodeURIComponent(
        serviceTitle
      )}&location=${encodeURIComponent(locationName)}`
    );
  };

  const handleSearch = async () => {
    if (searchQuery) {
      await fetchCoordsFromAddress(searchQuery);
      navigate(`/professionals?location=${encodeURIComponent(searchQuery)}`);
    }
  };
  // Fetch feedback from backend
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(`${API_URL}/feedback`);
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        } else {
          // Fallback to hardcoded testimonials in case of error
          setTestimonials([
            {
              name: "Sarah J.",
              message:
                "Alora made finding a plumber incredibly easy and the service was top-notch. Highly recommend their prompt and professional team!",
              rating: 4,
            },
            {
              name: "David K.",
              message:
                "My computer was fixed in no time! The tech support was professional and efficient. Alora is a true lifesaver for my home tech needs!",
              rating: 4,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        // Fallback to hardcoded testimonials in case of error
        setTestimonials([
          {
            name: "Sarah J.",
            message:
              "Alora made finding a plumber incredibly easy and the service was top-notch. Highly recommend their prompt and professional team!",
            rating: 4,
          },
          {
            name: "David K.",
            message:
              "My computer was fixed in no time! The tech support was professional and efficient. Alora is a true lifesaver for my home tech needs!",
            rating: 4,
          },
        ]);
      }
    };
    fetchFeedback();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden py-8 sm:py-12 lg:py-16">
        {/* Background slider */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="slider-track flex w-max h-full animate-slideImages">
            {[1, 2, 3, 4].map((img) => (
              <img
                key={img}
                src={`/${img}-image.jpg`}
                alt={`Slide ${img}`}
                className="w-screen h-full object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10 z-10" />
        <style>{`
          @keyframes slideImages {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .animate-slideImages { animation: slideImages 60s linear infinite; }
        `}</style>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Hero Content */}
            <div className="text-center lg:text-left">
              <h1
                className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
              >
                Connect with Local
                <span className="block">Home Service</span>
                <span className="block">Experts Instantly</span>
              </h1>
              <p
                className="text-base sm:text-lg md:text-xl text-white mb-6 max-w-lg mx-auto lg:mx-0"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
              >
                From urgent repairs to routine maintenance, Alora connects you
                directly with certified professionals. Get immediate support
                with a single call.
              </p>
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 sm:px-8 sm:py-4 text-base font-semibold rounded-lg flex items-center justify-center w-full xs:w-auto"
                  onClick={() => navigate("/professionals")}
                >
                  <Plug className="mr-2" size={20} /> Call an Expert
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-white bg-green-700 text-white hover:bg-green-600 hover:text-gray-900 px-6 py-3 sm:px-8 sm:py-4 text-base font-semibold rounded-lg w-full xs:w-auto"
                  onClick={() => navigate("/professionals")}
                >
                  Explore Professionals
                </Button>
              </div>
            </div>

            {/* Right Search Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-100 w-full max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                Find Services Near You
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Home className="text-gray-400" size={20} />
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter your location"
                    className="pl-12 py-3 text-base sm:text-lg border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 sm:py-3 rounded-lg flex items-center justify-center text-sm sm:text-base"
                  onClick={() => {
                    if (detectUserLocation.Coordinates)
                      fetchAddressFromCoords(
                        detectUserLocation.Coordinates.lat,
                        detectUserLocation.Coordinates.lon
                      );
                  }}
                >
                  <Settings className="mr-2" size={16} /> Detect My Location
                </Button>
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 sm:py-4 text-base font-semibold rounded-lg flex items-center justify-center"
                  onClick={handleSearch}
                >
                  <Search className="mr-2" size={20} /> Search Services
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Comprehensive Services
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-12">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={
                  activeCategory === category.name ? "default" : "outline"
                }
                className={`rounded-full px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm md:px-6 md:py-3 md:text-base ${
                  activeCategory === category.name
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-blue-500"
                }`}
                onClick={() => setActiveCategory(category.name)}
              >
                <span className="hidden xs:inline mr-1 sm:mr-2">
                  {category.icon}
                </span>
                <span className="whitespace-nowrap">{category.name}</span>
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {services
              .filter((service) => {
                if (activeCategory === "All Services") return true;

                // Check if service has a category field that matches
                if (service.category && service.category === activeCategory) {
                  return true;
                }

                // Fallback: check service title for category keywords
                const title = service.title.toLowerCase();

                if (activeCategory === "Home Repair") {
                  return (
                    title.includes("plumber") ||
                    title.includes("electrician") ||
                    title.includes("appliance") ||
                    title.includes("fixture") ||
                    title.includes("repair") ||
                    title.includes("home")
                  );
                }
                if (activeCategory === "Tech Support") {
                  return (
                    title.includes("technical") ||
                    title.includes("tech") ||
                    title.includes("network") ||
                    title.includes("computer")
                  );
                }
                if (activeCategory === "Cleaning") {
                  return (
                    title.includes("cleanings") ||
                    title.includes("clean") ||
                    title.includes("window")
                  );
                }
                if (activeCategory === "Electrical") {
                  return (
                    title.includes("electrician") ||
                    title.includes("electrical") ||
                    title.includes("fixture") ||
                    title.includes("electric")
                  );
                }
                if (activeCategory === "Plumbing") {
                  return (
                    title.includes("plumber") ||
                    title.includes("plumbing") ||
                    title.includes("water") ||
                    title.includes("pipe")
                  );
                }

                return false;
              })
              .map((service) => {
                return (
                  <Card
                    key={service.title}
                    onClick={() => onClickToServiceButton(service.title)}
                    className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white h-full"
                  >
                    <CardContent className="p-4 sm:p-5 md:p-6 h-full flex flex-col">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0`}>
                          <span className="text-white text-lg sm:text-xl">
                            {service.icon || "📋"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors text-sm sm:text-base md:text-lg">
                            {service.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {howItWorksSteps.map((step) => (
              <Card
                key={step.step}
                className="p-5 sm:p-6 text-center border border-gray-100 shadow-sm h-full"
              >
                <div className="text-blue-600 font-bold text-xl sm:text-2xl mb-3">
                  {step.step}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 lg:gap-10">
              {testimonials.map((t, index) => (
                <Card
                  key={index}
                  className="p-5 sm:p-6 shadow-sm border border-gray-100 h-full"
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    <Users className="text-blue-600 mr-2" size={20} />
                    <h3 className="text-base sm:text-lg font-semibold">
                      {t.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base mb-3">
                    {t.message}
                  </p>
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="text-yellow-400 mr-1"
                        size={14}
                      />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-600 text-base sm:text-lg">
                No feedback available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
            Find trusted home service professionals near you with Alora.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg"
            onClick={() => navigate("/professionals")}
          >
            Explore Services
          </Button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
