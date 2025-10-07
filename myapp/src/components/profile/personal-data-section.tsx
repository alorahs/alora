import { useState } from "react";
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
import { Upload, User } from "lucide-react";
import type { User as UserType } from "@/interfaces/user"; // Import the User type

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
  // Fix: Replace 'any' with the specific User type
  user: UserType | null;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal data</h2>
        <p className="text-gray-600 mb-6">
          Real-time information and activities of your prototype.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Picture Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Data
          </h3>

          <div className="flex items-center space-x-6 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={
                  previewImageUrl ||
                  (profileData.profilePicture
                    ? `${API_URL}/files/${profileData.profilePicture}`
                    : undefined)
                }
                alt="Profile"
              />
              <AvatarFallback className="text-lg">
                {profileData.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Profile picture
                  </h4>
                  <p className="text-sm text-gray-500">PNG, JPEG under 15MB</p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleOnSubmitProfilePicture();
                    }}
                    disabled={!isEditing && !loading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {loading
                      ? "Uploading..."
                      : pendingProfilePictureFile
                      ? "Change Picture"
                      : isEditing
                      ? "Select Picture"
                      : "Upload new picture"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700 mb-2 block"
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
              className="w-full"
            />
          </div>

          <div>
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700 mb-2 block"
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
              className="w-full"
            />
          </div>
        </div>

        {/* Contact Email Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Contact email
          </h3>
          <p className="text-gray-600 mb-4">
            Allows for accurate identification and communication with you.
          </p>

          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              className="w-full max-w-md"
            />
          </div>
        </div>

        {/* Phone Number Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Phone number
          </h3>
          <p className="text-gray-600 mb-4">
            The phone number is an important data field that helps identify and
            directly communicate with an individual.
          </p>

          <div>
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Phone number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
              className="w-full max-w-md"
              placeholder="(+1) (409) 124-1241"
            />
          </div>
        </div>

        {/* Professional Work Section */}
        {user && user.role === "professional" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Professional Information
            </h3>
            <p className="text-gray-600 mb-4">
              Your professional details and services you provide.
            </p>

            <div className="space-y-6">
              {/* Work Category */}
              <div>
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700 mb-2 block"
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
                  <SelectTrigger className="w-full max-w-md">
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
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Professional Bio
                </Label>
                <Textarea
                  id="bio"
                  value={profileData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                  placeholder="Describe your experience, expertise, and services..."
                  rows={4}
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <Label
                  htmlFor="hourlyRate"
                  className="text-sm font-medium text-gray-700 mb-2 block"
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
                  className="w-full max-w-md"
                  placeholder="Enter your hourly rate"
                  min="0"
                />
              </div>

              {/* Skills */}
              <div>
                <Label
                  htmlFor="skills"
                  className="text-sm font-medium text-gray-700 mb-2 block"
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
                  className="w-full"
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
        <div className="flex space-x-4 pt-6">
          {isEditing ? (
            <>
              <Button
                onClick={handleSaveChanges}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
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
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
