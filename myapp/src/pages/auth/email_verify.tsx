import { API_URL } from "@/context/auth_provider";
import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";

function EmailVerify() {
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${API_URL}/_/users/verify-email`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({token: token}),
        });

        if (res.ok) {
          setStatus("✅ Email verified successfully!");
          redirect("/");
        } else {
          const data = await res.json().catch(() => ({}));
          setStatus(data.message || "❌ Verification failed.");
        }
      } catch (err) {
        setStatus("⚠️ Server error. Please try again later.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-lg font-semibold">
      {status}
    </div>
  );
}

export default EmailVerify;
