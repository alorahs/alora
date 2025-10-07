import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { proxyApiRequest } from "@/lib/apiProxy";

function EmailVerify() {
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    

    if (!token) {
      setStatus("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await proxyApiRequest(`/_/users/verify-email`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: { token },
        });

        if (res.ok) {
          setStatus("✅ Email verified successfully!");
          await new Promise((r) => setTimeout(r, 2000));
          navigate("/");
        } else {
          const data = await res.json().catch(() => ({}));
          setStatus(data.message || "❌ Verification failed.");
        }
      } catch (err) {
        setStatus("⚠️ Server error. Please try again later.");
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-lg font-semibold">
      {status}
    </div>
  );
}

export default EmailVerify;
