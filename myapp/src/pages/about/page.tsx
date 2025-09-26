import Feedback from "@/components/feedback";

function AboutPage() {
  return (
    <div>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Us</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Welcome to our company! We are dedicated to providing exceptional home services 
            that transform living spaces and create lasting value for our clients.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-600">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To deliver innovative and reliable home services that meet our customers' needs and exceed their expectations.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We strive to be a trusted partner in making your house the perfect home.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-green-600">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To be the leading provider of premium home services in our region.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We envision a future where every home receives the care and attention it deserves.
            </p>
          </div>
        </div>

        {/* CEO, Co-Founder & Partners */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Leaders</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* CEO */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <img 
                  src="https://media.istockphoto.com/id/1413766112/photo/successful-mature-businessman-looking-at-camera-with-confidence.jpg?s=2048x2048&w=is&k=20&c=KPnbXWbV0dJewQ5B1sbbcX7ox5UpuzHnrTrPVkLhdNc="
                  alt="Sarah Johnson - CEO"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sarah Johnson</h3>
                <p className="text-blue-600 font-semibold mb-3">Chief Executive Officer</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  With over 15 years of experience in home services industry, Sarah leads our company with vision and dedication to excellence.
                </p>
              </div>
            </div>
            
            {/* Co-Founder */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Michael Rodriguez - Co-Founder"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Michael Rodriguez</h3>
                <p className="text-green-600 font-semibold mb-3">Co-Founder & Innovation Director</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Michael co-founded the company with a vision to revolutionize home services through innovative solutions and customer-first approach.
                </p>
              </div>
            </div>
            
            {/* Partner */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Emily Chen - Strategic Partner"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Emily Chen</h3>
                <p className="text-purple-600 font-semibold mb-3">Strategic Partner</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Emily brings strategic partnerships and business development expertise, ensuring our continued growth and market expansion.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality Service</h3>
              <p className="text-gray-600">We deliver exceptional home services with attention to every detail.</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Reliability</h3>
              <p className="text-gray-600">We maintain the highest standards and reliability in all our home services.</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Customer Focus</h3>
              <p className="text-gray-600">Your satisfaction is our priority in every home service we provide.</p>
            </div>
          </div>
        </div>

        {/* Statistics - The Best Home Services */}
        <div className="bg-gray-900 text-white rounded-2xl p-12 mb-16">
          <h2 className="text-4xl font-bold text-center mb-4">The Best Home Services</h2>
          <p className="text-xl text-center text-gray-300 mb-12">Our Statistics Speak for Themselves</p>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">2,500+</div>
              <p className="text-gray-300">Homes Serviced</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">98%</div>
              <p className="text-gray-300">Customer Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
              <p className="text-gray-300">Emergency Support</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">10+</div>
              <p className="text-gray-300">Years of Excellence</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-lg text-blue-300 font-semibold">#1 Rated Home Services Provider in the Region</p>
          </div>
        </div>

        {/* Services Highlight */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Home Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Plumbing</h3>
              <p className="text-sm text-gray-600">Expert plumbing repairs and installations</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Electrical</h3>
              <p className="text-sm text-gray-600">Professional electrical services and repairs</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Cleaning</h3>
              <p className="text-sm text-gray-600">Deep cleaning and maintenance services</p>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">HVAC</h3>
              <p className="text-sm text-gray-600">Heating, ventilation, and air conditioning</p>
            </div>
          </div>
        </div>

        {/* Contact Section - FREE Home Services */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-12 text-white text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <svg className="w-16 h-16 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.018-4.06A9.02 9.02 0 0121 6a8.966 8.966 0 01-4.414 7.757l-2.414-2.414A1.5 1.5 0 0013 10V9a1 1 0 00-1-1h-1a1 1 0 00-1 1v1a1.5 1.5 0 00-1.172 1.343l-2.414 2.414A8.966 8.966 0 013 6a9.02 9.02 0 006.94-3.06z" />
            </svg>
            <h2 className="text-5xl font-bold">Contact Us for FREE Home Services!</h2>
          </div>
          <p className="text-2xl mb-8 opacity-90">
            Get your FREE consultation and estimate today - absolutely no cost or obligation!
          </p>
          
          {/* FREE Services Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2V7a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">FREE Assessment</h3>
              <p className="opacity-90">Complete home evaluation at no charge</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">FREE Quote</h3>
              <p className="opacity-90">Detailed pricing with no hidden fees</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">FREE Support</h3>
              <p className="opacity-90">24/7 customer service and guidance</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">FREE Hotline</h3>
              <p className="opacity-90 text-lg">+1 (555) FREE-HOME</p>
              <p className="opacity-75 text-sm">(+1 555-373-3466)</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="opacity-90 text-lg">free@homeservices.com</p>
              <p className="opacity-75 text-sm">Quick response guaranteed</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Available</h3>
              <p className="opacity-90 text-lg">24/7 Emergency</p>
              <p className="opacity-75 text-sm">Always here when you need us</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <button className="bg-white text-green-600 px-10 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition-colors duration-200 mr-4">
              Get Your FREE Quote Now!
            </button>
            <button className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-full font-bold text-xl hover:bg-yellow-300 transition-colors duration-200">
              Call for FREE Consultation
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg">
            <p className="text-lg font-semibold mb-2">🎉 Special Offer: Contact us this month and receive:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">FREE Home Inspection</span>
              <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">FREE Priority Scheduling</span>
              <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">10% Off First Service</span>
            </div>
          </div>
        </div>
      </div>
      <Feedback/>
    </div>
  );
}
export default AboutPage;
