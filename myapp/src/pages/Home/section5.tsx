import { StarIcon } from "lucide-react"
function Section5() {
  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what real customers have to say about their experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              name: "Sarah Johnson",
              service: "Plumbing",
              rating: 5,
              text: "Amazing service! The plumber arrived on time, fixed my kitchen sink quickly, and cleaned up after himself. Highly recommend!",
              location: "San Francisco, CA",
            },
            {
              name: "Mike Chen",
              service: "Electrical",
              rating: 5,
              text: "Professional electrician who installed new outlets in my home office. Great communication and fair pricing. Will use again!",
              location: "Austin, TX",
            },
            {
              name: "Emily Rodriguez",
              service: "House Cleaning",
              rating: 5,
              text: "The cleaning team was thorough and efficient. My house has never looked better! Easy booking process too.",
              location: "Miami, FL",
            },
          ].map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">{testimonial.service}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="font-semibold">4.9/5</span>
            <span>•</span>
            <span>Over 10,000+ happy customers</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Section5