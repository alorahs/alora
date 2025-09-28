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
  Heart,
} from "lucide-react"
import { useAuth } from "@/context/auth_provider"
import { User } from "@/interfaces/user"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import AdminProfilePage from "./admin"
import UserDashboard from "./dashboard"

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

  if (user.role === "customer" || user.role === "user") {
    return <UserDashboard />;
  }

  // For professionals, show their profile with an edit option
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Professional Profile</h1>
          <div className="flex space-x-2">
            <Button asChild>
              <Link to="/professional/dashboard">
                <Briefcase className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link to="/profile/edit">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Welcome, {user.fullName}</h2>
            <Button variant="outline" asChild>
              <Link to="/favorites">
                <Heart className="h-4 w-4 mr-2" />
                View Favorites
              </Link>
            </Button>
          </div>
          <p className="text-gray-600">This is your professional profile page. You can edit your information and manage your services here.</p>
        </div>
      </div>
    </div>
  );
}
