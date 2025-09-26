import { StarIcon } from "lucide-react";
function Section4() {
  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Alora for Home Services?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We connect you with trusted professionals who are committed to
            excellence in home service delivery.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-green-200 transition-colors">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              ✅ Verified Professionals
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Background-checked, licensed, and insured professionals for your
              peace of mind and safety.
            </p>
          </div>

          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-blue-200 transition-colors">
              <StarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              💰 Transparent Pricing
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Know exactly what you'll pay upfront. No hidden fees, no surprise
              charges, just honest pricing.
            </p>
          </div>

          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="bg-purple-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-purple-200 transition-colors">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              ⚡ Quick Response
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Fast booking and rapid response times. Emergency services
              available within 30 minutes.
            </p>
          </div>

          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="bg-yellow-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-yellow-200 transition-colors">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              🛡️ Quality Guarantee
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              100% satisfaction guarantee. If you're not happy, we'll make it
              right or refund your money.
            </p>
          </div>

          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="bg-indigo-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-indigo-200 transition-colors">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              📞 24/7 Support
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Round-the-clock customer support to help you every step of the
              way, whenever you need it.
            </p>
          </div>

          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="bg-pink-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-pink-200 transition-colors">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              ❤️ Trusted by Thousands
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Join 50,000+ satisfied customers who trust Alora for their home
              service needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Section4;
