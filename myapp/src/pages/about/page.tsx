import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  Eye,
  Lightbulb,
  Shield,
  Users2,
  Heart,
  Mail,
} from "lucide-react";
import { useAuth, API_URL } from "@/context/auth_provider";

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  imageUrl?: string;
}

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

interface AboutUsData {
  title: string;
  description: string;
  ourMission: string;
  ourVision: string;
  ourValues: string[];
  teamMembers: TeamMember[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: SocialLinks;
}

function AboutPage() {
  // API_URL is imported directly from auth_provider
  const [aboutUsData, setAboutUsData] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutUsData();
  }, []);

  const fetchAboutUsData = async () => {
    try {
      const response = await fetch(`${API_URL}/aboutus`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAboutUsData(data);
      }
    } catch (error) {
      console.error("Error fetching About Us data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!aboutUsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Failed to load data
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {aboutUsData.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {aboutUsData.description}
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
                  {aboutUsData.ourMission}
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
                  {aboutUsData.ourVision}
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
            {aboutUsData.ourValues.map((value, index) => {
              // Define icons and colors for values
              const icons = [Lightbulb, Shield, Users2, Target, Heart, Eye];
              const colors = [
                "blue",
                "green",
                "purple",
                "yellow",
                "red",
                "indigo",
              ];
              const IconComponent = icons[index % icons.length];
              const color = colors[index % colors.length];
              const bgColor = `bg-${color}-100`;
              const iconColor = `text-${color}-600`;

              return (
                <Card key={index} className="shadow-lg border-0 text-center">
                  <CardContent className="p-8">
                    <div
                      className={`p-4 ${bgColor} rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}
                    >
                      <IconComponent className={`h-8 w-8 ${iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {value}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Description for {value} value.
                    </p>
                  </CardContent>
                </Card>
              );
            })}
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
            {aboutUsData.teamMembers.map((member, index) => (
              <Card key={index} className="shadow-lg border-0 text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 font-semibold mb-3">
                    {member.position}
                  </p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
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

      {/* Contact Information */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="p-3 bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Email Us
                </h3>
                <p className="text-gray-600">{aboutUsData.contactEmail}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="p-3 bg-green-100 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Users2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Call Us
                </h3>
                <p className="text-gray-600">{aboutUsData.contactPhone}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="p-3 bg-purple-100 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Visit Us
                </h3>
                <p className="text-gray-600">{aboutUsData.address}</p>
              </CardContent>
            </Card>
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
