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

interface UserDetails {
  _id?: string;
  user: string;
  dateOfBirth?: string;
  gender?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  identification?: {
    type?: string;
    number?: string;
    issuingCountry?: string;
    issuingAuthority?: string;
    issueDate?: string;
    expirationDate?: string;
  };
  preferences?: {
    communication?: {
      preferredMethod?: string;
      preferredLanguage?: string;
    };
    privacy?: {
      profileVisibility?: string;
      showEmail?: boolean;
      showPhone?: boolean;
    };
  };
  referralCode?: string;
  loyaltyPoints?: number;
}

interface UserDetailsFormProps {
  user: User | null;
  onUpdate: () => void;
}

export default function UserDetailsForm({
  user,
  onUpdate,
}: UserDetailsFormProps) {
  const { toast } = useToast();
  const userId = user?._id ?? "";
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    user: "",
    emergencyContact: {},
    identification: {},
    preferences: {
      communication: {},
      privacy: {},
    },
  });

  const fetchUserDetails = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      const response = await proxyApiRequest("/user-details", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails({
          ...data,
          user: userId,
        });
      } else if (response.status === 404) {
        setUserDetails({
          user: userId,
          emergencyContact: {},
          identification: {},
          preferences: {
            communication: {},
            privacy: {},
          },
        });
      } else {
        throw new Error(`Failed to fetch user details (${response.status})`);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive",
      });
    }
  }, [toast, userId]);

  // Fetch user details when component mounts
  useEffect(() => {
    void fetchUserDetails();
  }, [fetchUserDetails]);

  const handleSave = async () => {
    setLoading(true);
    try {
      let response;
      if (userDetails._id) {
        // Update existing user details
        response = await proxyApiRequest("/user-details", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: userDetails,
          credentials: "include",
        });
      } else {
        // Create new user details
        response = await proxyApiRequest("/user-details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: userDetails,
          credentials: "include",
        });
      }

      if (response.ok) {
        toast({
          title: "Success",
          description: "User details saved successfully",
        });
        onUpdate();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save user details");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save user details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof UserDetails,
    value: string | boolean | object
  ) => {
    setUserDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (
    parent: keyof UserDetails,
    field: string,
    value: string | boolean
  ) => {
    setUserDetails((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as object),
        [field]: value,
      },
    }));
  };

  const handlePreferencesChange = (
    category: string,
    field: string,
    value: string | boolean
  ) => {
    setUserDetails((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...(prev.preferences?.[category as keyof typeof prev.preferences] as object),
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600 mb-6">
          Manage your personal details and preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Date of Birth */}
        <div>
          <Label
            htmlFor="dateOfBirth"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Date of Birth
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={userDetails.dateOfBirth || ""}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className="w-full max-w-md"
          />
        </div>

        {/* Gender */}
        <div>
          <Label
            htmlFor="gender"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Gender
          </Label>
          <Select
            value={userDetails.gender || ""}
            onValueChange={(value) => handleInputChange("gender", value)}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Emergency Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="emergencyName"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Name
              </Label>
              <Input
                id="emergencyName"
                value={userDetails.emergencyContact?.name || ""}
                onChange={(e) =>
                  handleNestedInputChange("emergencyContact", "name", e.target.value)
                }
                placeholder="Contact name"
              />
            </div>
            <div>
              <Label
                htmlFor="emergencyPhone"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Phone
              </Label>
              <Input
                id="emergencyPhone"
                value={userDetails.emergencyContact?.phone || ""}
                onChange={(e) =>
                  handleNestedInputChange("emergencyContact", "phone", e.target.value)
                }
                placeholder="Contact phone"
              />
            </div>
            <div>
              <Label
                htmlFor="emergencyRelationship"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Relationship
              </Label>
              <Input
                id="emergencyRelationship"
                value={userDetails.emergencyContact?.relationship || ""}
                onChange={(e) =>
                  handleNestedInputChange("emergencyContact", "relationship", e.target.value)
                }
                placeholder="Relationship to you"
              />
            </div>
          </div>
        </div>

        {/* Identification */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Identification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="idType"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                ID Type
              </Label>
              <Select
                value={userDetails.identification?.type || ""}
                onValueChange={(value) =>
                  handleNestedInputChange("identification", "type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="driver-license">Driver's License</SelectItem>
                  <SelectItem value="national-id">National ID</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="idNumber"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                ID Number
              </Label>
              <Input
                id="idNumber"
                value={userDetails.identification?.number || ""}
                onChange={(e) =>
                  handleNestedInputChange("identification", "number", e.target.value)
                }
                placeholder="ID number"
              />
            </div>
            <div>
              <Label
                htmlFor="issuingCountry"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Issuing Country
              </Label>
              <Input
                id="issuingCountry"
                value={userDetails.identification?.issuingCountry || ""}
                onChange={(e) =>
                  handleNestedInputChange("identification", "issuingCountry", e.target.value)
                }
                placeholder="Country"
              />
            </div>
            <div>
              <Label
                htmlFor="issuingAuthority"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Issuing Authority
              </Label>
              <Input
                id="issuingAuthority"
                value={userDetails.identification?.issuingAuthority || ""}
                onChange={(e) =>
                  handleNestedInputChange("identification", "issuingAuthority", e.target.value)
                }
                placeholder="Authority"
              />
            </div>
            <div>
              <Label
                htmlFor="issueDate"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Issue Date
              </Label>
              <Input
                id="issueDate"
                type="date"
                value={userDetails.identification?.issueDate || ""}
                onChange={(e) =>
                  handleNestedInputChange("identification", "issueDate", e.target.value)
                }
              />
            </div>
            <div>
              <Label
                htmlFor="expirationDate"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Expiration Date
              </Label>
              <Input
                id="expirationDate"
                type="date"
                value={userDetails.identification?.expirationDate || ""}
                onChange={(e) =>
                  handleNestedInputChange("identification", "expirationDate", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Communication Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="preferredMethod"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Preferred Communication Method
              </Label>
              <Select
                value={userDetails.preferences?.communication?.preferredMethod || ""}
                onValueChange={(value) =>
                  handlePreferencesChange("communication", "preferredMethod", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="preferredLanguage"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Preferred Language
              </Label>
              <Select
                value={userDetails.preferences?.communication?.preferredLanguage || ""}
                onValueChange={(value) =>
                  handlePreferencesChange("communication", "preferredLanguage", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Privacy Preferences */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Privacy Preferences
          </h3>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="profileVisibility"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Profile Visibility
              </Label>
              <Select
                value={userDetails.preferences?.privacy?.profileVisibility || ""}
                onValueChange={(value) =>
                  handlePreferencesChange("privacy", "profileVisibility", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="professional-only">Professional Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showEmail"
                checked={userDetails.preferences?.privacy?.showEmail || false}
                onChange={(e) =>
                  handlePreferencesChange("privacy", "showEmail", e.target.checked)
                }
                className="rounded"
              />
              <Label htmlFor="showEmail" className="text-sm text-gray-700">
                Show email on profile
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showPhone"
                checked={userDetails.preferences?.privacy?.showPhone || false}
                onChange={(e) =>
                  handlePreferencesChange("privacy", "showPhone", e.target.checked)
                }
                className="rounded"
              />
              <Label htmlFor="showPhone" className="text-sm text-gray-700">
                Show phone on profile
              </Label>
            </div>
          </div>
        </div>

        {/* Referral and Loyalty */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Referral & Loyalty
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="referralCode"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Referral Code
              </Label>
              <Input
                id="referralCode"
                value={userDetails.referralCode || ""}
                onChange={(e) => handleInputChange("referralCode", e.target.value)}
                placeholder="Your referral code"
                readOnly
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Loyalty Points
              </Label>
              <div className="text-lg font-semibold text-gray-900">
                {userDetails.loyaltyPoints || 0} points
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Details"}
          </Button>
        </div>
      </div>
    </div>
  );
}