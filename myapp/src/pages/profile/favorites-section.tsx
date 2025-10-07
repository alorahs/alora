import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Trash2,
  Eye,
  Calendar,
  Phone,
  Mail,
  Heart,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Favorite {
  _id: string;
  professional: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    category: string;
    rating: number;
    profilePicture?: string;
    hourlyRate?: number;
  };
  createdAt: string;
}

export default function FavoritesSection({
  favorites,
  favoritesLoading,
  handleRemoveFavorite,
  API_URL,
}: {
  favorites: Favorite[];
  favoritesLoading: boolean;
  handleRemoveFavorite: (professionalId: string) => void;
  API_URL: string;
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
          My Favorites
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          Your favorite professionals for quick access.
        </p>
      </div>

      {favoritesLoading ? (
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600">
              Loading your favorites...
            </p>
          </div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
            No favorites yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
            Start exploring professionals and add them to your favorites for
            quick access.
          </p>
          <Link to="/professionals">
            <Button className="text-sm sm:text-base w-full sm:w-auto">
              <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Browse Professionals
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {favorites.map((favorite) => (
            <Card
              key={favorite._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                      <AvatarImage
                        src={
                          favorite.professional.profilePicture
                            ? `${API_URL}/proxy/file/${favorite.professional.profilePicture}`
                            : undefined
                        }
                      />
                      <AvatarFallback className="text-sm">
                        {favorite.professional.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {favorite.professional.fullName}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {favorite.professional.category}
                      </p>
                      {favorite.professional.rating && (
                        <div className="flex items-center mt-1">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                          <span className="text-xs sm:text-sm text-gray-600 ml-1">
                            {favorite.professional.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleRemoveFavorite(favorite.professional._id)
                    }
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2 flex-shrink-0"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>

                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                  {favorite.professional.hourlyRate && (
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="font-semibold text-green-600">
                        ₹{favorite.professional.hourlyRate}/hr
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {favorite.professional.phone}
                    </span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {favorite.professional.email}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    to={`/professionals/${favorite.professional._id}`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs sm:text-sm"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="truncate">View Profile</span>
                    </Button>
                  </Link>
                  <Link
                    to={`/booking/${favorite.professional._id}`}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                    >
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="truncate">Book Now</span>
                    </Button>
                  </Link>
                </div>

                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Added on {new Date(favorite.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
