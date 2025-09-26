import { CheckCircleIcon } from "lucide-react";
function Section3() {
  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How Alora Works
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Getting quality home service has never been easier - here's how we
            make it happen
          </p>
        </div>

        {/* Enhanced how it works section with more detail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              step: "1",
              title: "Tell Us What You Need",
              description:
                "Search by service type, describe your issue, or browse categories. Our smart matching finds the right professionals for you.",
              details:
                "Emergency repairs, routine maintenance, installations - we handle it all",
              icon: (
                <svg
                  className="h-8 w-8"
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
              ),
            },
            {
              step: "2",
              title: "Choose Your Professional",
              description:
                "Compare verified professionals with ratings, reviews, and transparent pricing. Book instantly or request a quote.",
              details:
                "All professionals are background-checked, licensed, and insured",
              icon: (
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              ),
            },
            {
              step: "3",
              title: "Relax While We Handle It",
              description:
                "Track your service in real-time, communicate directly with your professional, and pay securely through our platform.",
              details: "100% satisfaction guarantee with 24/7 customer support",
              icon: <CheckCircleIcon className="h-8 w-8" />,
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className="text-center animate-fade-in-up group hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 shadow-lg">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.step}. {item.title}
              </h3>
              <p className="text-gray-600 mb-3 leading-relaxed">
                {item.description}
              </p>
              <p className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full inline-block">
                {item.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Section3;
