import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth_provider"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

import { User, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login, user, error: authError } = useAuth()

  useEffect(() => {
    if (!authError) {
      setError(null)
      return
    }

    if (Array.isArray(authError.errors) && authError.errors.length > 0) {
      setError(authError.errors.map((err) => err.msg).join("\n"))
      return
    }

    if (typeof authError.message === "string") {
      setError(authError.message)
      return
    }

    setError("Login failed. Please try again.")
  }, [authError])

  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (user.emailVerified === false) {
        navigate("/auth/signup-success")
      } else {
        navigate("/")
      }
    }
  }, [user, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    // Validate required fields
    if (!identifier.trim() || !password.trim()) {
      toast({
        title: "Please fill in all required fields", 
        description: "Username/Email/Phone and Password are required"
      })
      setIsLoading(false)
      return
    }

    const loginData = {
      identifier: identifier.trim(),
      password: password.trim()
    }

    try {
      const response = await login(loginData)

      if (!response) {
        // Login failed, error should be in the auth context
        // We don't need to handle it here as the toast is already shown in the context
      } else {
        // Login successful
        if (user?.emailVerified === false) {
          navigate("/auth/signup-success")
        } else {
          navigate("/")
        }
      }
    } catch (error) {
      const errorMsg = "An unexpected error occurred during login"
      setError(errorMsg)
      toast({
        title: "Login Error",
        description: errorMsg,
        variant: "destructive"
      })
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
            {/* Login Form */}
            <div className="flex flex-col gap-6">
              {/* Identifier Input */}
              <div className="grid gap-2">
                <Label htmlFor="identifier">Email, Username, or Phone</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter your email, username, or phone"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
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
