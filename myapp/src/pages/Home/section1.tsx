import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";

function Section1() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <section className="bg-background from-blue-50 to-indigo-100 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Your Trusted <span className="text-blue-600">Home Service</span>{" "}
            Partner
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
            Connect with verified professionals for all your home needs. From
            emergency repairs to regular maintenance, get quality service at
            transparent prices, right when you need it.
          </p>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-8 max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700">
                  <strong>🚑 Emergency Service Available:</strong> Urgent
                  plumbing or electrical issues? Our verified professionals
                  respond within 30 minutes, 24/7.
                </p>
              </div>
              <button className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105">
                📞 Emergency Help
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <form
              // onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-lg shadow-lg"
            >
              <div className="flex-1 relative">
                <Search
                  size={20}
                  className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                />
                <Input
                  placeholder="Search for plumber, electrician, cleaning..."
                  className="pl-10 border-0 focus:ring-0 text-base h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 px-8 h-12 font-semibold"
              >
                🔍 Find Professionals
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Section1;
