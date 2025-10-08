import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { proxyApiRequest } from "@/lib/apiProxy";

interface OTPLoginProps {
  onLoginSuccess: () => void;
  onSwitchToPassword: () => void;
}

export default function OTPLogin({
  onLoginSuccess,
  onSwitchToPassword,
}: OTPLoginProps) {
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleRequestOTP = async () => {
    if (!identifier.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email, username, or phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await proxyApiRequest("/auth/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { identifier: identifier.trim() },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setStep("verify");
        toast({
          title: "OTP Sent",
          description: `OTP has been sent to your ${data.method}. Please check and enter the code.`,
        });
        
        // Start timer for resend OTP
        setTimer(30);
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.errors?.[0]?.msg || errorData.message || "Failed to send OTP"
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      toast({
        title: "Error",
        description: "Please enter the OTP code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await proxyApiRequest("/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { 
          identifier: identifier.trim(),
          otp: otp.trim()
        },
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Login successful!",
        });
        onLoginSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.errors?.[0]?.msg || errorData.message || "Failed to verify OTP"
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to verify OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (timer > 0) return;
    handleRequestOTP();
  };

  return (
    <div className="space-y-6">
      {step === "request" ? (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="identifier">Email, Username, or Phone</Label>
            <Input
              id="identifier"
              type="text"
              placeholder="Enter your email, username, or phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <Button
            className="w-full"
            disabled={loading}
            onClick={handleRequestOTP}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Enter the 6-digit code sent to your device
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="otp">OTP Code</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              required
            />
          </div>
          <Button
            className="w-full"
            disabled={loading || otp.length !== 6}
            onClick={handleVerifyOTP}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={timer > 0}
              className="text-blue-600 hover:text-blue-500 disabled:opacity-50"
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </div>
        </div>
      )}
      
      <div className="text-center text-sm">
        <button
          type="button"
          onClick={onSwitchToPassword}
          className="text-blue-600 hover:text-blue-500"
        >
          Login with password instead
        </button>
      </div>
    </div>
  );
}