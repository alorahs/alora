"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Phone,
  Mail,
  Star,
  DollarSign,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Edit,
  Calendar,
  Award,
  Briefcase,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react"
import { useAuth } from "@/context/auth_provider"
import { User } from "@/interfaces/user"
import { useNavigate } from "react-router"
import AdminProfilePage from "./admin"

export default function ProfilePage() {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<User | null>(authUser || null)
  const navigate = useNavigate()
  const [editData, setEditData] = useState<User>(
    authUser || {
      _id: "",
      fullName: "",
      email: "",
      username: "",
      phone: "",
      role: "user",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      skills: [],
      availability: [],
      workGallery: [],
      socialLinks: { linkedin: "", twitter: "", facebook: "", instagram: "" },
      address: { street: "", city: "", state: "", zip: "" },
      ratings: [],
      reviews: [],
    }
  )
  const [isEditing, setIsEditing] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    if (authUser) {
      setUser(authUser)
      setEditData({
        ...authUser,
        skills: authUser.skills || [],
        availability: authUser.availability || [],
        workGallery: authUser.workGallery || [],
        socialLinks: {
          linkedin: authUser.socialLinks?.linkedin || "",
          twitter: authUser.socialLinks?.twitter || "",
          facebook: authUser.socialLinks?.facebook || "",
          instagram: authUser.socialLinks?.instagram || "",
        },
        address: {
          street: authUser.address?.street || "",
          city: authUser.address?.city || "",
          state: authUser.address?.state || "",
          zip: authUser.address?.zip || "",
        },
      })
    } else {
      navigate("/");
    }
  }, [authUser])

  const averageRating =
    user?.ratings?.length && user.ratings.length > 0
      ? user.ratings.reduce((a, b) => a + b, 0) / user.ratings.length
      : 0

  const handleEdit = () => {
    if (user) setEditData({ ...user })
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editData) setUser({ ...editData })
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (user) setEditData({ ...user })
    setIsEditing(false)
  }

  const handleInputChange = <K extends keyof User>(field: K, value: User[K]) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = <K extends keyof NonNullable<User["address"]>>(field: K, value: string) => {
    setEditData((prev) => ({
      ...prev,
      address: { ...(prev.address || {}), [field]: value },
    }))
  }

  const handleSocialChange = <K extends keyof NonNullable<User["socialLinks"]>>(platform: K, value: string) => {
    setEditData((prev) => ({
      ...prev,
      socialLinks: { ...(prev.socialLinks || {}), [platform]: value },
    }))
  }

  const handleAddSkill = () => {
    const skill = newSkill.trim()
    if (!skill || editData.skills?.includes(skill)) return
    setEditData((prev) => ({ ...prev, skills: [...(prev.skills || []), skill] }))
    setNewSkill("")
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((skill) => skill !== skillToRemove) || [],
    }))
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  if( user.role === "admin") {
    return (
      <AdminProfilePage />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <Card className="border-border bg-card">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
                <div className="flex-shrink-0 mx-auto lg:mx-0">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-primary/20">
                    <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.fullName} />
                    <AvatarFallback className="text-xl sm:text-2xl bg-primary/10 text-primary">
                      {user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="text-center lg:text-left">
                      {isEditing ? (
                        <Input
                          value={editData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className="text-2xl sm:text-3xl font-bold text-center lg:text-left"
                        />
                      ) : (
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{user.fullName}</h1>
                      )}
                      <div className="flex items-center justify-center lg:justify-start gap-2 mt-2 flex-wrap">
                        <Badge variant={user.role === "professional" ? "default" : "secondary"} className="capitalize">
                          {user.role}
                        </Badge>
                        {user.category && user.role === "professional" && (
                          <Badge variant="outline" className="capitalize">
                            {user.category}
                          </Badge>
                        )}
                        {user.emailVerified && (
                          <Badge variant="outline" className="text-green-400 border-green-400/50">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center sm:justify-end">
                      {isEditing ? (
                        <>
                          <Button onClick={handleSave} className="gap-2">
                            <Save className="w-4 h-4" />
                            Save
                          </Button>
                          <Button onClick={handleCancel} variant="outline" className="gap-2 bg-transparent">
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={handleEdit} variant="outline" className="gap-2 bg-transparent">
                          <Edit className="w-4 h-4" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>

                  {user.role === "professional" && user.ratings?.length ? (
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground">{averageRating.toFixed(1)}</span>
                        <span>({user.ratings.length} reviews)</span>
                      </div>
                      <Separator orientation="vertical" className="h-4 hidden sm:block" />
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editData.hourlyRate || 0}
                            onChange={(e) => handleInputChange("hourlyRate", Number(e.target.value))}
                            className="w-20 h-6 text-sm"
                          />
                        ) : (
                          <span>${user.hourlyRate || 0}/hour</span>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {isEditing ? (
                    <Textarea
                      value={editData.bio}
                      placeholder="Write a short bio about yourself..."
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="text-muted-foreground leading-relaxed resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-muted-foreground text-pretty leading-relaxed text-center lg:text-left">
                      {user.bio || "bio not set yet."}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="about" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex h-auto p-1">
            <TabsTrigger value="about" className="text-xs sm:text-sm">
              About
            </TabsTrigger>
            {user.role === "professional" && (
              <>
                <TabsTrigger value="portfolio" className="text-xs sm:text-sm">
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="availability" className="text-xs sm:text-sm">
                  Availability
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs sm:text-sm">
                  Reviews
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4 sm:space-y-6 w-full">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Contact Information */}
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">Email</p>
                        {isEditing ? (
                          <Input
                            type="email"
                            value={editData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="font-medium break-all">{user.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        {isEditing ? (
                          <Input
                            value={editData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="font-medium">{user.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Address</p>
                      {isEditing ? (
                        <div className="space-y-2 mt-1">
                          <Input
                            placeholder="Street"
                            value={editData.address?.street || ""}
                            onChange={(e) => handleAddressChange("street", e.target.value)}
                          />
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <Input
                              placeholder="City"
                              value={editData.address?.city || ""}
                              onChange={(e) => handleAddressChange("city", e.target.value)}
                            />
                            <Input
                              placeholder="State"
                              value={editData.address?.state || ""}
                              onChange={(e) => handleAddressChange("state", e.target.value)}
                            />
                            <Input
                              placeholder="ZIP"
                              value={editData.address?.zip || ""}
                              onChange={(e) => handleAddressChange("zip", e.target.value)}
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="font-medium">
                          {user.address?.street || "street not set yet."}
                          <br />
                          {user.address?.city || "city not set yet."}, {user.address?.state || "state not set yet."} {user.address?.zip || "zip not set yet."}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Social Links</p>
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="linkedin" className="text-xs">
                              LinkedIn
                            </Label>
                            <Input
                              id="linkedin"
                              value={editData.socialLinks?.linkedin || ""}
                              onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                              placeholder="https://linkedin.com/in/username"
                            />
                          </div>
                          <div>
                            <Label htmlFor="twitter" className="text-xs">
                              Twitter
                            </Label>
                            <Input
                              id="twitter"
                              value={editData.socialLinks?.twitter || ""}
                              onChange={(e) => handleSocialChange("twitter", e.target.value)}
                              placeholder="https://twitter.com/username"
                            />
                          </div>
                          <div>
                            <Label htmlFor="facebook" className="text-xs">
                              Facebook
                            </Label>
                            <Input
                              id="facebook"
                              value={editData.socialLinks?.facebook || ""}
                              onChange={(e) => handleSocialChange("facebook", e.target.value)}
                              placeholder="https://facebook.com/username"
                            />
                          </div>
                          <div>
                            <Label htmlFor="instagram" className="text-xs">
                              Instagram
                            </Label>
                            <Input
                              id="instagram"
                              value={editData.socialLinks?.instagram || ""}
                              onChange={(e) => handleSocialChange("instagram", e.target.value)}
                              placeholder="https://instagram.com/username"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user.socialLinks?.linkedin && (
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent text-xs sm:text-sm">
                            <Linkedin className="w-4 h-4" />
                            <span className="hidden sm:inline">LinkedIn</span>
                          </Button>
                        )}
                        {user.socialLinks?.twitter && (
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent text-xs sm:text-sm">
                            <Twitter className="w-4 h-4" />
                            <span className="hidden sm:inline">Twitter</span>
                          </Button>
                        )}
                        {user.socialLinks?.facebook && (
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent text-xs sm:text-sm">
                            <Facebook className="w-4 h-4" />
                            <span className="hidden sm:inline">Facebook</span>
                          </Button>
                        )}
                        {user.socialLinks?.instagram && (
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent text-xs sm:text-sm">
                            <Instagram className="w-4 h-4" />
                            <span className="hidden sm:inline">Instagram</span>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              {user.role === "professional" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Award className="w-5 h-5" />
                      Skills & Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add new skill"
                            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                          />
                          <Button onClick={handleAddSkill} size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {editData.skills?.map((skill) => (
                            <div key={skill} className="flex items-center gap-1">
                              <Badge variant="secondary" className="text-xs sm:text-sm">
                                {skill}
                              </Badge>
                              <Button
                                onClick={() => handleRemoveSkill(skill)}
                                size="sm"
                                variant="ghost"
                                className="p-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user.skills?.map((skill) => (
                          <Badge key={skill}>{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
