import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Shield, Users2, Target, Heart, Eye } from "lucide-react";

interface AboutUsData {
  ourValues: string[];
}

export default function ValuesSection({
  aboutUsData,
}: {
  aboutUsData: AboutUsData;
}) {
  return (
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
  );
}
