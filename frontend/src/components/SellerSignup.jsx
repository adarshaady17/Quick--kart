import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const SellerSignup = () => {
  const { setUser, axios, navigate } = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (!showOtpField) {
        const { data } = await axios.post(`/api/v1/user/register`, {
          name,
          email,
          password,
          role: "seller",
        });

        if (data.success) {
          setRegisteredEmail(email);
          setShowOtpField(true);
          setResendTimer(30);
          toast.success("OTP sent to your email. Please verify.");
        } else {
          toast.error(data.message);
        }
        return;
      }

      // Verify OTP
      const { data } = await axios.post(`/api/v1/user/verify-otp`, {
        email: registeredEmail,
        otp,
      });

      if (data.success) {
        setUser(data.user);
        toast.success("Email verified successfully!");
        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (resendTimer > 0 || isResending) return;

    setIsResending(true);
    try {
      const { data } = await axios.post(`/api/v1/user/resend-otp`, {
        email: registeredEmail,
      });

      if (data.success) {
        setResendTimer(30);
        toast.success("New OTP sent to your email");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white p-8"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-indigo-500">Seller</span> Sign Up
        </p>

        {!showOtpField && (
          <>
            <div className="w-full">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="text"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="w-full">
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                type="email"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="w-full">
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="password"
                required
                disabled={isSubmitting}
              />
            </div>
          </>
        )}

        {showOtpField && (
          <div className="w-full">
            <p>Enter OTP sent to {registeredEmail}</p>
            <input
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              placeholder="6-digit OTP"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="text"
              required
              maxLength="6"
              disabled={isSubmitting}
            />
            <div className="text-sm mt-1">
              {resendTimer > 0 ? (
                <span className="text-gray-500">
                  Resend OTP in {resendTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={isResending || isSubmitting}
                  className={`text-indigo-500 ${
                    isResending
                      ? "opacity-50"
                      : "hover:underline cursor-pointer"
                  }`}
                >
                  {isResending ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`bg-indigo-500 hover:bg-indigo-300 transition-all text-white w-full py-2 rounded-md cursor-pointer flex items-center justify-center ${
            isSubmitting ? "opacity-75" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? showOtpField
              ? "Verifying..."
              : "Creating Account..."
            : showOtpField
            ? "Verify OTP"
            : "Create Account"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/seller/login")}
          className="w-full py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
          disabled={isSubmitting}
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default SellerSignup;
