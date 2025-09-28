import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth_provider"

export default function SignupSuccessPage() {
  const {user} = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    const handleNavigation = async () => {
      if (user) {
        if (user.emailVerified === true) {
          navigate("/");
        } else {
          await new Promise((r) => setTimeout(r, 2000));
          navigate("/");
        }
      } else {
        await new Promise((r) => setTimeout(r, 2000));
        navigate("/auth/login");
      }
    };
    handleNavigation();
  }, [user, navigate])

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Check your email</CardTitle>
            <CardDescription className="text-center">We&apos;ve sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Please check your email and click the confirmation link to activate your account. Once confirmed, you can
              sign in to your ALORA dashboard.
            </p>          
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
