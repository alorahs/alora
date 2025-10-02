import { Card, CardContent } from "../../components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah J.",
    text: "Alora made finding a plumber incredibly easy and the service was top-notch. Highly recommend their prompt and professional team!",
    rating: 5,
  },
  {
    name: "David K.",
    text: "My computer was fixed in no time! The tech support was professional and efficient. Alora is a true lifesaver for my home tech needs!",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className="border-0 shadow-lg bg-white"
            >
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-yellow-400 fill-current"
                      size={20}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-gray-900">
                  - {testimonial.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
