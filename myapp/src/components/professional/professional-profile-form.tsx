import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { proxyApiRequest } from "@/lib/apiProxy";
import { User } from "@/interfaces/user";

interface ProfessionalProfile {
  _id?: string;
  user: string;
  category: string;
  subCategories: string[];
  bio: string;
  skills: string[];
  hourlyRate: number;
  experience: {
    years: number;
    description: string;
  };
  responseTime: number;
  cancellationPolicy: string;
  languages: string[];
  isVerified?: boolean;
}

interface ProfessionalProfileFormProps {
  user: User | null;
  onUpdate: () => void;
}

export default function ProfessionalProfileForm({
  user,
  onUpdate,
}: ProfessionalProfileFormProps) {
  const { toast } = useToast();
  const userId = user?._id ?? "";
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfessionalProfile>({
    user: "",
    category: "",
    subCategories: [],
    bio: "",
    skills: [],
    hourlyRate: 0,
    experience: {
      years: 0,
      description: "",
    },
    responseTime: 24,
    cancellationPolicy: "moderate",
    languages: ["en"],
  });
  const [newSkill, setNewSkill] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");

  const fetchProfessionalProfile = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      const response = await proxyApiRequest(`/professional/${userId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch professional profile (${response.status})`);
      }

      const data = await response.json();
      setProfile({
        ...data,
        user: userId,
      });
    } catch (error) {
      console.error("Error fetching professional profile:", error);
      toast({
        title: "Error",
        description: "Failed to load professional profile",
        variant: "destructive",
      });
    }
  }, [toast, userId]);

  // Fetch professional profile when component mounts
  useEffect(() => {
    void fetchProfessionalProfile();
  }, [fetchProfessionalProfile]);

  const handleSave = async () => {
    setLoading(true);
    try {
      let response;
      if (profile._id) {
        // Update existing profile
        response = await proxyApiRequest(`/professional/${profile._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: profile,
          credentials: "include",
        });
      } else {
        // Create new profile
        response = await proxyApiRequest("/professional", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: profile,
          credentials: "include",
        });
      }

      if (response.ok) {
        toast({
          title: "Success",
          description: "Professional profile saved successfully",
        });
        onUpdate();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save professional profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof ProfessionalProfile,
    value: string | number | string[] | number[]
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExperienceChange = (field: string, value: string | number) => {
    setProfile((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        [field]: value,
      },
    }));
  };

  const addSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (!trimmedSkill) {
      return;
    }

    setProfile((prev) => {
      if (prev.skills.includes(trimmedSkill)) {
        return prev;
      }

      return {
        ...prev,
        skills: [...prev.skills, trimmedSkill],
      };
    });
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addSubCategory = () => {
    const trimmedCategory = newSubCategory.trim();
    if (!trimmedCategory) {
      return;
    }

    setProfile((prev) => {
      if (prev.subCategories.includes(trimmedCategory)) {
        return prev;
      }

      return {
        ...prev,
        subCategories: [...prev.subCategories, trimmedCategory],
      };
    });
    setNewSubCategory("");
  };

  const removeSubCategory = (category: string) => {
    setProfile((prev) => ({
      ...prev,
      subCategories: prev.subCategories.filter((c) => c !== category),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Professional Profile
        </h2>
        <p className="text-gray-600 mb-6">
          Manage your professional information and services.
        </p>
      </div>

      <div className="space-y-8">
        {/* Category */}
        <div>
          <Label
            htmlFor="category"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Primary Category
          </Label>
          <Select
            value={profile.category}
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select your primary category" />
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

        {/* Sub Categories */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Sub Categories
          </Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newSubCategory}
              onChange={(e) => setNewSubCategory(e.target.value)}
              placeholder="Add a sub category"
              className="max-w-xs"
            />
            <Button onClick={addSubCategory} type="button">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.subCategories.map((category, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {category}
                <button
                  type="button"
                  onClick={() => removeSubCategory(category)}
                  className="ml-2 text-blue-600 hover:text-blue-900"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <Label
            htmlFor="bio"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Professional Bio
          </Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            className="w-full"
            placeholder="Describe your experience, expertise, and services..."
            rows={4}
          />
        </div>

        {/* Skills */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Skills & Expertise
          </Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="max-w-xs"
            />
            <Button onClick={addSkill} type="button">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-green-600 hover:text-green-900"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
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
            value={profile.hourlyRate}
            onChange={(e) =>
              handleInputChange("hourlyRate", Number(e.target.value))
            }
            className="w-full max-w-md"
            placeholder="Enter your hourly rate"
            min="0"
          />
        </div>

        {/* Experience */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Experience
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="years"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Years of Experience
              </Label>
              <Input
                id="years"
                type="number"
                value={profile.experience.years}
                onChange={(e) =>
                  handleExperienceChange("years", Number(e.target.value))
                }
                className="w-full"
                min="0"
              />
            </div>
            <div>
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Experience Description
              </Label>
              <Textarea
                id="description"
                value={profile.experience.description}
                onChange={(e) =>
                  handleExperienceChange("description", e.target.value)
                }
                className="w-full"
                placeholder="Describe your experience..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div>
          <Label
            htmlFor="responseTime"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Response Time (hours)
          </Label>
          <Input
            id="responseTime"
            type="number"
            value={profile.responseTime}
            onChange={(e) =>
              handleInputChange("responseTime", Number(e.target.value))
            }
            className="w-full max-w-md"
            placeholder="Average response time in hours"
            min="1"
          />
        </div>

        {/* Cancellation Policy */}
        <div>
          <Label
            htmlFor="cancellationPolicy"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Cancellation Policy
          </Label>
          <Select
            value={profile.cancellationPolicy}
            onValueChange={(value) =>
              handleInputChange("cancellationPolicy", value)
            }
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select cancellation policy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flexible">Flexible</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="strict">Strict</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Languages */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Languages Spoken
          </Label>
          <div className="flex flex-wrap gap-2">
            {["en", "es", "fr", "de", "hi"].map((lang) => (
              <div key={lang} className="flex items-center">
                <input
                  type="checkbox"
                  id={`lang-${lang}`}
                  checked={profile.languages.includes(lang)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleInputChange("languages", [
                        ...profile.languages,
                        lang,
                      ]);
                    } else {
                      handleInputChange(
                        "languages",
                        profile.languages.filter((l) => l !== lang)
                      );
                    }
                  }}
                  className="mr-2"
                />
                <Label htmlFor={`lang-${lang}`} className="text-sm">
                  {lang === "en" && "English"}
                  {lang === "es" && "Spanish"}
                  {lang === "fr" && "French"}
                  {lang === "de" && "German"}
                  {lang === "hi" && "Hindi"}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}