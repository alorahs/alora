import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { useGeolocation } from "@/hooks/use-geoloaction";
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

// Services data
const services = [
  {
    title: "Plumber",
    description:
      "Expert solutions for leaks, clogs, and pipe issues. Ensuring smooth water flow throughout your home.",
    icon: Wrench,
    color: "blue",
  },
  {
    title: "Techical",
    description:
      "On-demand assistance for software, hardware, and network problems. Get immediate help for all your tech issues.",
    icon: Monitor,
    color: "green",
  },
  {
    title: "Electrician",
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
  const navigate = useNavigate();
  const detectUserLocation = useGeolocation();
  const [activeCategory, setActiveCategory] = useState("All Services");
  const [searchQuery, setSearchQuery] = useState("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [locationName, setLocationName] = useState("");

  // Reverse Geocoding: Coords -> Address
  const fetchAddressFromCoords = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      if (data?.address.city_district) {
        setLocationName(data.address.city_district + ", " + data.address.state);
        setSearchQuery(data.address.city_district + ", " + data.address.state); // autofill input
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Geocoding: Address -> Coords
  const fetchCoordsFromAddress = async (address: string) => {
    
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json&limit=1`
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
      ).toLowerCase()}&location=${encodeURIComponent(
        locationName
      )}`
    );

  };
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Auto-sliding background images */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="slider-track flex w-max h-full animate-slideImages">
            {/* Original image set */}
            {[1, 2, 3, 4].map((img) => (
              <img
                key={img.toString()}
                src={`/${img}-image.jpg`}
                alt={`Slide ${img}`}
                className="w-screen h-full object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Optional dark overlay */}
        <div className="absolute inset-0 bg-black/10 z-10" />

        <style>{`
             @keyframes slideImages {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100%); }
    }

    .animate-slideImages {
      animation: slideImages 60s linear infinite;
    }
  `}</style>

        {/* Background overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
              >
                Connect with Local
                <span className="block">Home Service</span>
                <span className="block">Experts Instantly</span>
              </h1>
              <p
                className="text-base sm:text-lg text-white mb-6 lg:mb-8 max-w-lg mx-auto lg:mx-0"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
              >
                From urgent repairs to routine maintenance, Alora connects you
                directly with certified professionals. Get immediate support
                with a single call.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg flex items-center justify-center w-full sm:w-auto"
                  onClick={() => {
                    navigate("/professionals");
                  }}
                >
                  <Plug className="mr-2" size={20} />
                  Call an Expert
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-white bg-green-700 text-white hover:bg-green-600 hover:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg w-full sm:w-auto"
                  onClick={() => {
                    navigate("/professionals");
                  }}
                >
                  Explore Professionals
                </Button>
              </div>
            </div>

            {/* Right Search Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-gray-100 w-full max-w-md mx-auto lg:ml-auto lg:mr-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
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
                    placeholder="Enter your location"
                    className="pl-12 py-3 sm:py-4 text-base sm:text-lg border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Detect Location Button */}
                <Button
                  variant="ghost"
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 sm:py-3 rounded-lg flex items-center justify-center text-sm sm:text-base"
                  onClick={() => {
                    if (detectUserLocation.Coordinates) {
                      setCoordinates(detectUserLocation.Coordinates);
                      fetchAddressFromCoords(
                        detectUserLocation.Coordinates.lat,
                        detectUserLocation.Coordinates.lon
                      );
                    }
                  }}
                >
                  <Settings className="mr-2" size={16} />
                  Detect My Location
                </Button>

                {/* Search Button */}
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg flex items-center justify-center"
                  onClick={() => {
                    if (searchQuery) {
                      fetchCoordsFromAddress(searchQuery);
                      navigate("/professionals");
                    }
                  }}
                >
                  <Search className="mr-2" size={20} />
                  Search Services
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Our Comprehensive Services
            </h2>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={
                  activeCategory === category.name ? "default" : "outline"
                }
                className={`rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base ${
                  activeCategory === category.name
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-blue-500"
                }`}
                onClick={() => {
                  setActiveCategory(category.name);
                }}
              >
                <span className="hidden sm:inline">{category.icon} </span>
                {category.name}
              </Button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {services
              .filter((service) => {
                if (activeCategory === "All Services") return true;
                if (activeCategory === "Home Repair") {
                  return [
                    "Plumber",
                    "Electrician",
                    "Appliance Repair",
                    "Fixture Installation",
                  ].includes(service.title);
                }
                if (activeCategory === "Tech Support") {
                  return ["Techical", "Network Setup"].includes(service.title);
                }
                if (activeCategory === "Cleaning") {
                  return ["Deep Cleaning", "Window Cleaning"].includes(
                    service.title
                  );
                }
                if (activeCategory === "Electrical") {
                  return ["Electrician", "Fixture Installation"].includes(
                    service.title
                  );
                }
                if (activeCategory === "Plumbing") {
                  return service.title === "Plumber";
                }
              })
              .map((service) => {
                const IconComponent = service.icon;
                return (
                  <Card
                    key={service.title}
                    onClick={() => onClickToServiceButton(service.title)}
                    className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white h-full"
                  >
                    <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <div
                          className={`p-2 sm:p-3 rounded-lg bg-${service.color}-100 flex-shrink-0`}
                        >
                          <IconComponent
                            className={`text-${service.color}-600`}
                            size={20}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
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

      {/* How It Works */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              How Alora Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {howItWorksSteps.map((step, index) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-lg font-bold mb-4">
                    {step.step}
                  </div>
                  <div className="flex justify-center">
                    {index === 0 && (
                      <ClipboardCheck className="text-gray-400" size={28} />
                    )}
                    {index === 1 && (
                      <Users className="text-gray-400" size={28} />
                    )}
                    {index === 2 && (
                      <MessageCircle className="text-gray-400" size={28} />
                    )}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="border-0 shadow-lg bg-white"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="text-yellow-400 fill-current"
                        size={18}
                      />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-4 italic leading-relaxed">
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

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Transform Your Home?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
            Experience the convenience and quality of Alora's professional home
            services. Get started today!
          </p>
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg"
            onClick={() => {
              navigate("/professionals");
            }}
          >
            Get a Free Quote
          </Button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
