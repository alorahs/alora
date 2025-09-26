import { Link } from "react-router-dom";

function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Help & Support
            </h1>
            <p className="text-lg text-gray-600">
              Find answers, get support, and learn how to make the most of our
              platform
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              How can we help you today?
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles, guides, or FAQs..."
                className="w-full px-6 py-4 pr-12 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                🔍
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Browse by Category
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🚀</span>
                    <div>
                      <h4 className="font-medium text-blue-900">
                        Getting Started
                      </h4>
                      <p className="text-sm text-blue-700">Setup and basics</p>
                    </div>
                  </div>
                </button>

                <button className="w-full text-left p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors border border-green-200">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">⚙️</span>
                    <div>
                      <h4 className="font-medium text-green-900">
                        Account Settings
                      </h4>
                      <p className="text-sm text-green-700">
                        Profile and preferences
                      </p>
                    </div>
                  </div>
                </button>

                <button className="w-full text-left p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💡</span>
                    <div>
                      <h4 className="font-medium text-purple-900">Features</h4>
                      <p className="text-sm text-purple-700">
                        How to use tools
                      </p>
                    </div>
                  </div>
                </button>

                <button className="w-full text-left p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-200">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🔧</span>
                    <div>
                      <h4 className="font-medium text-orange-900">
                        Troubleshooting
                      </h4>
                      <p className="text-sm text-orange-700">
                        Fix common issues
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Need More Help?</h3>
              <p className="mb-4 opacity-90">
                Can't find what you're looking for? Our support team is here to
                help.
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            {/* Popular Articles */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Popular Help Articles
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <article className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📖</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Complete User Guide
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Everything you need to know to get started and become an
                        expert user.
                      </p>
                      <span className="text-blue-600 text-sm font-medium">
                        Read more →
                      </span>
                    </div>
                  </div>
                </article>

                <article className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🎥</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Video Tutorials
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Step-by-step video guides covering all major features
                        and workflows.
                      </p>
                      <span className="text-blue-600 text-sm font-medium">
                        Watch now →
                      </span>
                    </div>
                  </div>
                </article>

                <article className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">💬</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Community Forum
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Connect with other users, share tips, and get community
                        support.
                      </p>
                      <span className="text-blue-600 text-sm font-medium">
                        Join discussion →
                      </span>
                    </div>
                  </div>
                </article>

                <article className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🔄</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        API Documentation
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Technical documentation for developers and advanced
                        integrations.
                      </p>
                      <span className="text-blue-600 text-sm font-medium">
                        View docs →
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <details className="border border-gray-200 rounded-lg">
                  <summary className="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    How do I reset my password?
                  </summary>
                  <div className="px-4 pb-4 text-gray-600">
                    You can reset your password by clicking the "Forgot
                    Password" link on the login page and following the
                    instructions sent to your email.
                  </div>
                </details>

                <details className="border border-gray-200 rounded-lg">
                  <summary className="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    Can I upgrade or downgrade my plan?
                  </summary>
                  <div className="px-4 pb-4 text-gray-600">
                    Yes, you can change your plan at any time from your account
                    settings. Changes will take effect on your next billing
                    cycle.
                  </div>
                </details>

                <details className="border border-gray-200 rounded-lg">
                  <summary className="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    Is my data secure?
                  </summary>
                  <div className="px-4 pb-4 text-gray-600">
                    Absolutely. We use industry-standard encryption and security
                    measures to protect your data. Learn more in our security
                    documentation.
                  </div>
                </details>

                <details className="border border-gray-200 rounded-lg">
                  <summary className="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    How do I cancel my subscription?
                  </summary>
                  <div className="px-4 pb-4 text-gray-600">
                    You can cancel your subscription from your account settings
                    under the billing section. Your access will continue until
                    the end of your billing period.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Contact Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Still Need Help?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our support team is available 24/7 to help you with any questions
              or issues you might have.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">📧</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Email Support</h4>
              <p className="text-gray-600 mb-4">Get detailed help via email</p>
              <Link to="/contact">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Send Email
                </button>
              </Link>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">💬</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Live Chat</h4>
              <p className="text-gray-600 mb-4">Instant help from our team</p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Start Chat
              </button>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">📅</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Schedule Call</h4>
              <p className="text-gray-600 mb-4">Book a one-on-one session</p>
              <Link to="/">
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Book Now
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Help Center</h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    How do I get started?
                  </h3>
                  <p className="text-gray-600">
                    You can begin by creating an account and following our quick
                    setup guide.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    How can I contact support?
                  </h3>
                  <p className="text-gray-600">
                    You can reach our support team via email at
                    support@example.com or through our live chat.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Is there a mobile app?
                  </h3>
                  <p className="text-gray-600">
                    Yes, our mobile app is available for both iOS and Android
                    devices.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Quick Links
              </h2>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <h3 className="font-medium text-blue-900">User Guide</h3>
                  <p className="text-blue-700 text-sm">
                    Complete documentation for all features
                  </p>
                </a>
                <a
                  href="#"
                  className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <h3 className="font-medium text-green-900">
                    Video Tutorials
                  </h3>
                  <p className="text-green-700 text-sm">
                    Step-by-step video guides
                  </p>
                </a>
                <a
                  href="#"
                  className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <h3 className="font-medium text-purple-900">
                    Community Forum
                  </h3>
                  <p className="text-purple-700 text-sm">
                    Connect with other users
                  </p>
                </a>
                <a
                  href="#"
                  className="block p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <h3 className="font-medium text-red-900">Report a Bug</h3>
                  <p className="text-red-700 text-sm">
                    Help us improve the platform
                  </p>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Contact Support
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 text-xl">📧</span>
                </div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600 text-sm">support@example.com</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 text-xl">💬</span>
                </div>
                <h3 className="font-medium text-gray-900">Live Chat</h3>
                <p className="text-gray-600 text-sm">Available 24/7</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 text-xl">📞</span>
                </div>
                <h3 className="font-medium text-gray-900">Phone</h3>
                <p className="text-gray-600 text-sm">1-800-HELP-US</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HelpPage;
