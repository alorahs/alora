import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function PlaceholderSection({ title }: { title: string }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          This section is coming soon.
        </p>
      </div>

      <Card className="p-6 sm:p-8 text-center">
        <CardContent>
          <div className="text-gray-400 mb-3 sm:mb-4">
            <Settings className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
            Feature Coming Soon
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 px-4">
            We're working on this feature. It will be available in a future
            update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
