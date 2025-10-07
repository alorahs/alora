import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth_provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Settings,
  User,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { proxyApiRequest } from "@/lib/apiProxy";

interface UserSettings {
  // Notification preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  bookingReminders: boolean;
  reviewNotifications: boolean;

  // Privacy settings
  profileVisibility: "public" | "private" | "professional-only";
  showEmail: boolean;
  showPhone: boolean;
  allowDirectMessages: boolean;

  // App preferences
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;

  // Security settings
  twoFactorEnabled: boolean;
  sessionTimeout: number;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [settings, setSettings] = useState<UserSettings>({
    // Default values
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    bookingReminders: true,
    reviewNotifications: true,
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowDirectMessages: true,
    theme: "system",
    language: "en",
    timezone: "Asia/Kolkata",
    twoFactorEnabled: false,
    sessionTimeout: 30,
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("notifications");

  // Load user settings on mount
  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const response = await proxyApiRequest("/user/settings", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setSettings((prevSettings) => ({ ...prevSettings, ...data.settings }));
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const response = await proxyApiRequest("/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings saved successfully",
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await proxyApiRequest("/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();

      // Clear any cached data from your app
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }

      toast({
        title: "Success",
        description: "Cache cleared successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cache",
        variant: "destructive",
      });
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await proxyApiRequest("/user/delete-account", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Account deletion request submitted",
        });
        // Redirect to home or logout
        window.location.href = "/";
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  const sidebarItems = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "account", label: "Account", icon: User },
  ];

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h2>
        <p className="text-gray-600 mb-6">
          Manage how you receive notifications and updates.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>General email notifications</Label>
              <p className="text-sm text-gray-600">
                Receive important updates and announcements
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  emailNotifications: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Booking reminders</Label>
              <p className="text-sm text-gray-600">
                Get reminded about upcoming bookings
              </p>
            </div>
            <Switch
              checked={settings.bookingReminders}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, bookingReminders: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Review notifications</Label>
              <p className="text-sm text-gray-600">
                Get notified when you receive new reviews
              </p>
            </div>
            <Switch
              checked={settings.reviewNotifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  reviewNotifications: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Marketing emails</Label>
              <p className="text-sm text-gray-600">
                Receive promotional content and offers
              </p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, marketingEmails: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            Push & SMS Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Push notifications</Label>
              <p className="text-sm text-gray-600">
                Receive push notifications on your device
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, pushNotifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>SMS notifications</Label>
              <p className="text-sm text-gray-600">
                Receive text messages for important updates
              </p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, smsNotifications: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy</h2>
        <p className="text-gray-600 mb-6">
          Control your privacy and data visibility settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Who can see your profile</Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={(
                value: "public" | "private" | "professional-only"
              ) =>
                setSettings((prev) => ({ ...prev, profileVisibility: value }))
              }
            >
              <SelectTrigger className="w-full max-w-md mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Everyone</SelectItem>
                <SelectItem value="professional-only">
                  Professionals only
                </SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Show email address</Label>
              <p className="text-sm text-gray-600">
                Allow others to see your email
              </p>
            </div>
            <Switch
              checked={settings.showEmail}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, showEmail: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show phone number</Label>
              <p className="text-sm text-gray-600">
                Allow others to see your phone number
              </p>
            </div>
            <Switch
              checked={settings.showPhone}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, showPhone: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Allow direct messages</Label>
              <p className="text-sm text-gray-600">
                Let other users send you messages
              </p>
            </div>
            <Switch
              checked={settings.allowDirectMessages}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  allowDirectMessages: checked,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security</h2>
        <p className="text-gray-600 mb-6">
          Manage your account security and authentication settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                }
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            onClick={changePassword}
            disabled={
              loading ||
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              !passwordData.confirmPassword
            }
            className="w-full"
          >
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable two-factor authentication</Label>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={settings.twoFactorEnabled}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, twoFactorEnabled: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Session timeout (minutes)</Label>
            <Select
              value={settings.sessionTimeout.toString()}
              onValueChange={(value) =>
                setSettings((prev) => ({
                  ...prev,
                  sessionTimeout: parseInt(value),
                }))
              }
            >
              <SelectTrigger className="w-full max-w-md mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="0">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appearance</h2>
        <p className="text-gray-600 mb-6">
          Customize how the app looks and feels.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {settings.theme === "dark" ? (
              <Moon className="h-5 w-5 mr-2" />
            ) : (
              <Sun className="h-5 w-5 mr-2" />
            )}
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Choose your theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value: "light" | "dark" | "system") =>
                setSettings((prev) => ({ ...prev, theme: value }))
              }
            >
              <SelectTrigger className="w-full max-w-md mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, language: value }))
              }
            >
              <SelectTrigger className="w-full max-w-md mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Timezone</Label>
            <Select
              value={settings.timezone}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, timezone: value }))
              }
            >
              <SelectTrigger className="w-full max-w-md mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                <SelectItem value="America/New_York">
                  America/New_York (EST)
                </SelectItem>
                <SelectItem value="Europe/London">
                  Europe/London (GMT)
                </SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account</h2>
        <p className="text-gray-600 mb-6">
          Manage your account data and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            Cache Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Clear application cache</Label>
              <p className="text-sm text-gray-600">
                Clear stored data to free up space and refresh the app
              </p>
            </div>
            <Button variant="outline" onClick={clearCache}>
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Edit profile information</Label>
              <p className="text-sm text-gray-600">
                Update your personal details and profile
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/profile">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <Trash2 className="h-5 w-5 mr-2" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-red-600">Delete account</Label>
              <p className="text-sm text-gray-600">
                Permanently delete your account and all associated data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "notifications":
        return renderNotificationsSection();
      case "privacy":
        return renderPrivacySection();
      case "security":
        return renderSecuritySection();
      case "appearance":
        return renderAppearanceSection();
      case "account":
        return renderAccountSection();
      default:
        return renderNotificationsSection();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p className="text-center">Please log in to access settings.</p>
            <div className="mt-4 text-center">
              <Button asChild>
                <Link to="/auth/login">Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
            <div className="flex items-center mb-6">
              <Settings className="h-6 w-6 mr-3 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {renderContent()}

              {/* Save Button - Only show for sections that need saving */}
              {["notifications", "privacy", "appearance"].includes(
                activeSection
              ) && (
                <div className="mt-8 pt-6 border-t">
                  <Button
                    onClick={saveSettings}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
