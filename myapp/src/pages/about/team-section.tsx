import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/context/auth_provider";

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  imageUrl?: string;
}

interface AboutUsData {
  teamMembers: TeamMember[];
}

export default function TeamSection({
  aboutUsData,
}: {
  aboutUsData: AboutUsData;
}) {
  return (
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
                      src={`${API_URL}/files/${member.imageUrl}`}
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
  );
}
