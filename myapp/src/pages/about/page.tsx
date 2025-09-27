import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Eye, Lightbulb, Shield, Users2, Heart } from "lucide-react";

function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Empowering Futures, Building Legacies.
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                At Alora, we believe in the power of innovation to shape a
                better tomorrow. Discover our journey, our values, and the
                dedicated individuals driving our vision forward.
              </p>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                Our Journey
              </Button>
            </div>
            <div className="flex justify-center">
              <div className="w-96 h-80 bg-gray-900 rounded-2xl flex items-center justify-center">
                <div className="text-center text-blue-400">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4"></div>
                  <p className="text-sm">Innovation Network</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Our Story: A Journey of Innovation and Impact
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-6">
            <p>
              Founded in 2019 by Dr. Alora Vance, Alora began with a simple yet
              ambitious vision: to harness the power of technology and human
              insight to create meaningful change.
            </p>
            <p>
              Today, Alora stands as a beacon of innovation, proud of our past
              achievements and excited for the future.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Our Mission
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  To empower businesses and communities by delivering innovative
                  and sustainable technological solutions that drive progress
                  and create a positive global impact.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <Eye className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Our Vision
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  To be the most trusted and transformative technology partner,
                  shaping a future where intelligent systems enhance every
                  aspect of life and work.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-8">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Lightbulb className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Innovation
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Constantly exploring creative ways to solve complex
                  challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-8">
                <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Integrity
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Upholding the highest standards in all our actions.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-8">
                <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users2 className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Collaboration
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Working together to achieve shared goals.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-8">
                <div className="p-4 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Excellence
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Committed to delivering outstanding quality.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-8">
                <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Customer Focus
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Placing customers at the center of our efforts.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-8">
                <div className="p-4 bg-indigo-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Eye className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Agility
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Embracing change in a dynamic environment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Alora Vance",
                role: "CEO & Founder",
                initials: "AV",
                bgColor: "bg-blue-100",
                iconColor: "bg-blue-600",
              },
              {
                name: "Marcus Chen",
                role: "Chief Technology Officer",
                initials: "MC",
                bgColor: "bg-green-100",
                iconColor: "bg-green-600",
              },
              {
                name: "Sarah Jenkins",
                role: "Head of Operations",
                initials: "SJ",
                bgColor: "bg-purple-100",
                iconColor: "bg-purple-600",
              },
              {
                name: "David Rodriguez",
                role: "VP of Marketing",
                initials: "DR",
                bgColor: "bg-yellow-100",
                iconColor: "bg-yellow-600",
              },
              {
                name: "Aisha Khan",
                role: "Lead UI Designer",
                initials: "AK",
                bgColor: "bg-red-100",
                iconColor: "bg-red-600",
              },
              {
                name: "James O'Connell",
                role: "Head of Sales",
                initials: "JO",
                bgColor: "bg-indigo-100",
                iconColor: "bg-indigo-600",
              },
            ].map((member, index) => (
              <Card key={index} className="shadow-lg border-0 text-center">
                <CardContent className="p-6">
                  <div
                    className={`w-24 h-24 ${member.bgColor} rounded-full mx-auto mb-4 flex items-center justify-center`}
                  >
                    <div
                      className={`w-16 h-16 ${member.iconColor} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-lg">
                        {member.initials}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 font-semibold mb-3">
                    {member.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="px-8 py-3">
              View All Team Members
            </Button>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Shape the Future with Alora?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're looking to partner, innovate, or join our growing
            team, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3"
            >
              Contact Us Today
            </Button>
            <Button
              size="lg"
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3"
            >
              Go Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
