import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <div className="py-16 bg-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Shape the Future with Alora?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Whether you're looking to partner, innovate, or join our growing team,
          we'd love to hear from you.
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
  );
}
