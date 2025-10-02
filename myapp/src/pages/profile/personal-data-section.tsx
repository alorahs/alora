import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  profilePicture?: string;
  category?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
}

export default function PersonalDataSection({
  profileData,
  isEditing,
  loading,
  pendingProfilePictureFile,
  previewImageUrl,
  API_URL,
  handleInputChange,
  setIsEditing,
  setPendingProfilePictureFile,
  setPreviewImageUrl,
  handleSaveChanges,
  handleOnSubmitProfilePicture,
  handleDeleteProfilePicture,
  user,
}: {
  profileData: UserProfile;
  isEditing: boolean;
  loading: boolean;
  pendingProfilePictureFile: File | null;
  previewImageUrl: string;
  API_URL: string;
  handleInputChange: (field: keyof UserProfile, value: string) => void;
  setIsEditing: (editing: boolean) => void;
  setPendingProfilePictureFile: (file: File | null) => void;
  setPreviewImageUrl: (url: string) => void;
  handleSaveChanges: () => void;
  handleOnSubmitProfilePicture: () => void;
  handleDeleteProfilePicture: () => void;
  user: any;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
          Personal data
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          Real-time information and activities of your prototype.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Profile Picture Section */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Personal Data
          </h3>

          <div className="flex flex-col items-center sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
              <AvatarImage
                src={
                  previewImageUrl ||
                  (profileData.profilePicture
                    ? `${API_URL}/files/${profileData.profilePicture}`
                    : undefined)
                }
                alt="Profile"
              />
              <AvatarFallback className="text-base sm:text-lg">
                {profileData.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="mb-3 sm:mb-0">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900">
                    Profile picture
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500">
                    PNG, JPEG under 15MB
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleOnSubmitProfilePicture();
                    }}
                    disabled={!isEditing && !loading}
                    className="text-xs sm:text-sm w-full sm:w-auto"
                  >
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="whitespace-nowrap">
                      {loading
                        ? "Uploading..."
                        : pendingProfilePictureFile
                        ? "Change Picture"
                        : isEditing
                        ? "Select Picture"
                        : "Upload new picture"}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 text-xs sm:text-sm w-full sm:w-auto"
                    onClick={handleDeleteProfilePicture}
                    disabled={!isEditing}
                  >
                    {!isEditing && loading ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label
              htmlFor="firstName"
              className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block"
            >
              First name
            </Label>
            <Input
              id="firstName"
              value={profileData.fullName.split(" ")[0] || ""}
              onChange={(e) => {
                const lastName = profileData.fullName
                  .split(" ")
                  .slice(1)
                  .join(" ");
                handleInputChange(
                  "fullName",
                  `${e.target.value} ${lastName}`.trim()
                );
              }}
              disabled={!isEditing}
              className="w-full text-sm"
            />
          </div>

          <div>
            <Label
              htmlFor="lastName"
              className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block"
            >
              Last name
            </Label>
            <Input
              id="lastName"
              value={profileData.fullName.split(" ").slice(1).join(" ") || ""}
              onChange={(e) => {
                const firstName = profileData.fullName.split(" ")[0] || "";
                handleInputChange(
                  "fullName",
                  `${firstName} ${e.target.value}`.trim()
                );
              }}
              disabled={!isEditing}
              className="w-full text-sm"
            />
          </div>
        </div>

        {/* Contact Email Section */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
            Contact email
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            Allows for accurate identification and communication with you.
          </p>

          <div>
            <Label
              htmlFor="email"
              className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              className="w-full text-sm"
            />
          </div>
        </div>

        {/* Phone Number Section */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
            Phone number
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            The phone number is an important data field that helps identify and
            directly communicate with an individual.
          </p>

          <div>
            <Label
              htmlFor="phone"
              className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block"
            >
              Phone number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
              className="w-full text-sm"
              placeholder="(+1) (409) 124-1241"
            />
          </div>
        </div>

        {/* Professional Work Section */}
        {user && user.role === "professional" && (
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
              Professional Information
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Your professional details and services you provide.
            </p>

            <div className="space-y-4 sm:space-y-6">
              {/* Work Category */}
              <div>
                <Label
                  htmlFor="category"
                  className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block"
                >
                  Work Category
                </Label>
                <Select
                  value={profileData.category || ""}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select your profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="carpentry">Carpentry</SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bio/Description */}
              <div>
                <Label
                  htmlFor="bio"
                  className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block"
                >
                  Professional Bio
                </Label>
                <Textarea
                  id="bio"
                  value={profileData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-sm"
                  placeholder="Describe your experience, expertise, and services..."
                  rows={4}
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <Label
                  htmlFor="hourlyRate"
                  className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block"
                >
                  Hourly Rate (₹)
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={profileData.hourlyRate || ""}
                  onChange={(e) =>
                    handleInputChange("hourlyRate", e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full text-sm"
                  placeholder="Enter your hourly rate"
                  min="0"
                />
              </div>

              {/* Skills */}
              <div>
                <Label
                  htmlFor="skills"
                  className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block"
                >
                  Skills & Expertise
                </Label>
                <Input
                  id="skills"
                  value={profileData.skills?.join(", ") || ""}
                  onChange={(e) => {
                    const skillsArray = e.target.value
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter((skill) => skill.length > 0);
                    // Since we can't directly modify state here, we'll need to pass this up
                    handleInputChange(
                      "skills" as keyof UserProfile,
                      e.target.value
                    );
                  }}
                  disabled={!isEditing}
                  className="w-full text-sm"
                  placeholder="Enter skills separated by commas (e.g., Pipe Installation, Leak Repair, Emergency Services)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple skills with commas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-4 pt-4 sm:pt-6">
          {isEditing ? (
            <>
              <Button
                onClick={handleSaveChanges}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm w-full sm:w-auto"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setPendingProfilePictureFile(null);
                  setPreviewImageUrl("");
                }}
                disabled={loading}
                className="text-xs sm:text-sm w-full sm:w-auto"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm w-full sm:w-auto"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
