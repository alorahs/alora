import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth_provider"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

import { AtSign, Lock, Mail, Phone, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("email")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const authError = useAuth().error

  useEffect(() => {
    if (authError) {
      setError(Array.isArray(authError) ? authError[0].msg : authError)
    }
  }, [authError])

  const navigate = useNavigate()
  const { login, user } = useAuth()

  useEffect(() => {
    if (user) {
      if (user.emailVerified === false) {
        navigate("/auth/signup-success");
      } else {
        navigate("/");
      }
    }
  }, [user])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      type LoginResponse = { errors?: { msg: string }[] } | any
      const response: LoginResponse = await login({ password, email, username, phone })

      if (typeof response === "object" && response !== null && Array.isArray(response.errors)) {
        setError(response.errors[0].msg)
      } else {
        if (user.emailVerified === false) {
          navigate("/auth/signup-success");
        } else {
          navigate("/");
        }
      }
    } catch (error: unknown) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tabs for Email / Username / Phone */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="email"
                >
                  Email
                </TabsTrigger>
                <TabsTrigger
                  value="username"
                >
                  Username
                </TabsTrigger>
                <TabsTrigger
                  value="phone"
                >
                  Phone
                </TabsTrigger>
              </TabsList>

              {/* Email Tab */}
              <TabsContent value="email">
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Username Tab */}
              <TabsContent value="username">
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="username"
                      type="text"
                      placeholder="yourusername"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Phone Tab */}
              <TabsContent value="phone">
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Login Form */}
            <div className="flex flex-col gap-6 mt-6">
              {/* Password with toggle */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Your password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error message */}
              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                onClick={handleLogin}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              {/* Signup link */}
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="underline underline-offset-4 text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
