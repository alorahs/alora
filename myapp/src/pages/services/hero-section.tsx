import { Button } from "../../components/ui/button";
import { ArrowRight, Wrench, Zap, Shield, Settings } from "lucide-react";

export default function HeroSection({
  onExploreServices,
}: {
  onExploreServices: () => void;
}) {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Trusted Partner for
              <span className="block text-blue-600">All Home Services</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Connecting you with reliable professionals for every home need,
              from plumbing to tech support, ensuring quality and peace of mind.
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg font-semibold rounded-lg"
              onClick={onExploreServices}
            >
              Explore Services
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-3xl p-8 relative overflow-hidden">
              {/* House Illustration */}
              <div className="relative z-10">
                <div className="bg-white rounded-2xl p-6 shadow-lg mx-auto max-w-xs">
                  <div className="bg-gray-800 h-4 rounded-t-lg mb-2"></div>
                  <div className="bg-blue-500 h-16 rounded-lg mb-2 relative">
                    <div className="bg-white w-6 h-6 rounded absolute top-2 right-2"></div>
                  </div>
                  <div className="bg-green-500 h-12 rounded-lg mb-2"></div>
                  <div className="bg-gray-200 h-8 rounded-lg"></div>
                </div>
              </div>
              {/* Floating Icons */}
              <div className="absolute top-4 left-4 bg-orange-400 p-2 rounded-lg">
                <Wrench className="text-white" size={16} />
              </div>
              <div className="absolute top-12 right-8 bg-blue-500 p-2 rounded-lg">
                <Zap className="text-white" size={16} />
              </div>
              <div className="absolute bottom-16 left-8 bg-green-500 p-2 rounded-lg">
                <Shield className="text-white" size={16} />
              </div>
              <div className="absolute bottom-4 right-4 bg-purple-500 p-2 rounded-lg">
                <Settings className="text-white" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
