import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowUserLogin, setUser, user, axios, navigate } = useAppContext();

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer for resend OTP cooldown
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      setIsSubmitting(true);
      
      if (state === "register" && !showOtpField) {
        const { data } = await axios.post(`/api/v1/user/register`, {
          name,
          email,
          password,
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

      if (state === "register" && showOtpField) {
        const { data } = await axios.post(`/api/v1/user/verify-otp`, {
          email: registeredEmail,
          otp,
        });
        
        if (data.success) {
          toast.success("Email verified successfully!");
          navigate("/");
          setUser(data.user);
          setShowUserLogin(false);
        } else {
          toast.error(data.message);
        }
        return;
      }

      if (state === "login") {
        const { data } = await axios.post(`/api/v1/user/login`, {
          email,
          password,
        });
        
        if (data.success) {
          navigate("/");
          setUser(data.user);
          setShowUserLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      console.error("Registration/Login error:", error);
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
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-shadow-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-indigo-500">User</span>
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && !showOtpField && (
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

        {state === "register" && showOtpField && (
          <>
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
                    className={`text-indigo-500 ${isResending ? 'opacity-50' : 'hover:underline cursor-pointer'}`}
                  >
                    {isResending ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {state === "login" && (
          <>
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

        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => {
                setState("login");
                setShowOtpField(false);
              }}
              className="text-indigo-500 cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => {
                setState("register");
                setShowOtpField(false);
              }}
              className="text-indigo-500 cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

        <button 
          type="submit"
          className={`bg-indigo-500 hover:bg-indigo-300 transition-all text-white w-full py-2 rounded-md cursor-pointer flex items-center justify-center ${
            isSubmitting ? 'opacity-75' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {state === "register" 
                ? (showOtpField ? "Verifying..." : "Registering...") 
                : "Logging in..."}
            </>
          ) : (
            state === "register" 
              ? (showOtpField ? "Verify OTP" : "Create Account") 
              : "Login"
          )}
        </button>
      </form>

      <button
        onClick={() => navigate("/seller")}
        className="fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-300 text-white px-4 py-2 rounded shadow-md transition-all z-40"
      >
        For Seller
      </button>
    </div>
  );
};

export default Login;