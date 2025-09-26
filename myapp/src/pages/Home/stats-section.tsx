function StatsSection() {
  const stats = [
    {
      number: "50,000+",
      label: "Happy Customers",
      icon: "👥",
      description: "Trusted by families across India",
    },
    {
      number: "10,000+",
      label: "Verified Professionals",
      icon: "⭐",
      description: "Licensed & background-checked",
    },
    {
      number: "100,000+",
      label: "Services Completed",
      icon: "✅",
      description: "Successfully delivered projects",
    },
    {
      number: "4.9/5",
      label: "Average Rating",
      icon: "⭐",
      description: "Consistently excellent service",
    },
    {
      number: "30 Min",
      label: "Emergency Response",
      icon: "🚨",
      description: "Fast help when you need it",
    },
    {
      number: "24/7",
      label: "Customer Support",
      icon: "📞",
      description: "Always here to help you",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by Thousands of Homeowners
          </h2>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Join the growing community of satisfied customers who rely on Alora
            for all their home service needs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:text-yellow-300 transition-colors">
                {stat.number}
              </div>
              <div className="text-sm font-semibold text-blue-100 mb-2">
                {stat.label}
              </div>
              <div className="text-xs text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-70">
          <div className="flex items-center gap-2 text-white/80">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">SSL Secured</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">Verified Platform</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path
                fillRule="evenodd"
                d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">100% Satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
