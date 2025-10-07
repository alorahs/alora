import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Home,
  Wrench,
  Monitor,
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
  MessageCircle,
  Star,
} from "lucide-react";

const categories = [
  { name: "All Services", active: true, icon: "🏠" },
  { name: "Home Repair", active: false, icon: "🔧" },
  { name: "Tech Support", active: false, icon: "💻" },
  { name: "Cleaning", active: false, icon: "🧹" },
  { name: "Electrical", active: false, icon: "⚡" },
  { name: "Plumbing", active: false, icon: "🚿" },
];

interface Service {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  // Add other properties as needed
}

export default function ServicesGridSection({ services }: { services: Service[] }) {
  return (
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
          {services.map((service) => {
            const IconComponent =
              service.icon.toString() === "Home"
                ? Home
                : service.icon.toString() === "Wrench"
                ? Wrench
                : service.icon.toString() === "Monitor"
                ? Monitor
                : service.icon.toString() === "Zap"
                ? Zap
                : service.icon.toString() === "Paintbrush"
                ? Paintbrush
                : service.icon.toString() === "Shield"
                ? Shield
                : service.icon.toString() === "Lock"
                ? Lock
                : service.icon.toString() === "Network"
                ? Network
                : service.icon.toString() === "Droplets"
                ? Droplets
                : service.icon.toString() === "Lightbulb"
                ? Lightbulb
                : service.icon.toString() === "Eye"
                ? Eye
                : service.icon.toString() === "Wind"
                ? Wind
                : service.icon.toString() === "ClipboardCheck"
                ? ClipboardCheck
                : service.icon.toString() === "MessageCircle"
                ? MessageCircle
                : Star;
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
  );
}
