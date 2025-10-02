import { Button } from "@/components/ui/button";

interface AboutUsData {
  title: string;
  description: string;
}

export default function HeroSection({
  aboutUsData,
}: {
  aboutUsData: AboutUsData;
}) {
  return (
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
            <div className="w-96 h-80 bg-gray-900 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
              <img
                src="/about us image.jpg"
                alt="About Us"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white text-lg font-semibold bg-black bg-opacity-50 px-4 py-2 rounded-lg inline-block">
                  Innovation Network
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
