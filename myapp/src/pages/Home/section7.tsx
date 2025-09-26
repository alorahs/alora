function Section7() {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          🏠 Stay Updated with Home Service Tips
        </h2>
        <p className="text-blue-100 text-lg mb-8">
          Get expert home maintenance tips, seasonal reminders, exclusive
          discounts, and early access to trusted professionals in your area.
        </p>

        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email for home tips"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none placeholder:text-gray-500"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              📧 Subscribe
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-3 flex items-center justify-center gap-2">
            🔒 No spam, unsubscribe at any time. 🎁 Get ₹100 off your first
            booking!
          </p>
        </div>

        {/* Value proposition */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-white/90 font-medium mb-1">
              📅 Seasonal Reminders
            </div>
            <div className="text-blue-200 text-xs">
              AC servicing, pest control, deep cleaning
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-white/90 font-medium mb-1">
              💰 Exclusive Offers
            </div>
            <div className="text-blue-200 text-xs">
              Special discounts for subscribers
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-white/90 font-medium mb-1">🥇 Expert Tips</div>
            <div className="text-blue-200 text-xs">
              Home maintenance & DIY guides
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Section7;
