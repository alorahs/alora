import { Card, CardContent } from "@/components/ui/card";
import { Mail, Users2, Target } from "lucide-react";

interface AboutUsData {
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export default function ContactSection({
  aboutUsData,
}: {
  aboutUsData: AboutUsData;
}) {
  return (
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">{aboutUsData.contactEmail}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 text-center">
            <CardContent className="p-6">
              <div className="p-3 bg-green-100 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Users2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">{aboutUsData.contactPhone}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 text-center">
            <CardContent className="p-6">
              <div className="p-3 bg-purple-100 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">{aboutUsData.address}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
