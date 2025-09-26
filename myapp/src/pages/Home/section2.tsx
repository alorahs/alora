interface Section2Props {
  categories: {
    name: string;
    icon: string;
    description?: string;
    demand?: string;
    avgPrice?: string;
  }[];
  handleCategoryClick: (name: string) => void;
}

function Section2({ categories, handleCategoryClick }: Section2Props) {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Popular Home Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our most requested services and connect with verified
            professionals in your area.
          </p>
        </div>

        {/* Enhanced service cards with demand indicators and pricing */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-2 transform group animate-fade-in-up relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Demand indicator */}
              {category.demand && (
                <div
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    category.demand === "Very High"
                      ? "bg-red-100 text-red-600"
                      : category.demand === "High"
                      ? "bg-orange-100 text-orange-600"
                      : category.demand === "Medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {category.demand}
                </div>
              )}

              <div className="text-3xl mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                {category.name}
              </h3>

              {/* Service description */}
              {category.description && (
                <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                  {category.description}
                </p>
              )}

              {/* Average pricing */}
              {category.avgPrice && (
                <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  {category.avgPrice}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Section2;
