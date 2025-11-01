import React, { useState, useEffect, useRef } from "react";
import MICROSOFT_LOGO from "../assets/logo.png";
import BACKGROUND_IMAGE from "../assets/fluent_web_dark_2.svg";

// Use the new asset paths you provided
// import microsoftLogo from "../assets/logo.png"; // Removed import
// import bg from "../assets/fluent_web_dark_2.svg"; // Removed import

// --- Configuration ---
const API_URL = "http://localhost:3001/auth";

// --- Main AuthFlow Component ---
export default function AuthFlow({ onAuthSuccess }) {
  // States to manage the multi-step flow
  const [currentStep, setCurrentStep] = useState("email"); // 'email', 'password', 'register-email', 'register-otp', 'register-details', 'forgot-password', 'forgot-otp'
  const [emailIdentifier, setEmailIdentifier] = useState(""); // Stores email/phone for login/registration
  const [password, setPassword] = useState(""); // Stores password for login/registration
  const [userName, setUserName] = useState(""); // Stores name for registration

  // Animation related states
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState("left"); // 'left' or 'right'
  const [isInitialLoad, setIsInitialLoad] = useState(true); // For initial fade-in

  useEffect(() => {
    // Set initial load to false after first render
    const timer = setTimeout(() => setIsInitialLoad(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Function to handle transitions between steps with animation
  const navigateTo = (newStep, direction = "left") => {
    setAnimationDirection(direction);
    setIsAnimating(true);

    // Wait for the slide-out animation to complete (0.3s)
    setTimeout(() => {
      setCurrentStep(newStep);
      setIsAnimating(false); // Reset animation state for slide-in
      // Clear specific inputs if transitioning away from them
      if (newStep === "email" || newStep === "register-email") {
        setPassword("");
        setUserName("");
      }
    }, 300); // Duration matches CSS transition
  };

  // --- Handlers for authentication success ---
  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    onAuthSuccess(token);
  };

  const handleRegistrationSuccess = (token) => {
    localStorage.setItem("token", token);
    onAuthSuccess(token);
  };

  // Render the current step
  const renderStep = () => {
    const stepProps = {
      emailIdentifier,
      setEmailIdentifier,
      password,
      setPassword,
      name: userName, // <-- This was 'userName', I've changed it to 'name'
      setName: setUserName,
      onNext: (identifier) => {
        setEmailIdentifier(identifier);
        navigateTo("password");
      },
      onSwitchToRegister: () => navigateTo("register-email"),
      onLoginSuccess: handleLoginSuccess,
      onBack: (step) => navigateTo(step, "right"),
      onRegisterNext: (email) => {
        setEmailIdentifier(email);
        console.log(`Simulating OTP send to: ${email}`);
        navigateTo("register-otp");
      },
      onSwitchToLogin: () => navigateTo("email", "right"),
      onOtpVerified: () => navigateTo("register-details"),
      onRegisterSuccess: handleRegistrationSuccess,
      onForgotPassword: () => navigateTo("forgot-password"),
    };

    // Render the component for the current step
    switch (currentStep) {
      case "email":
        return <EmailInput {...stepProps} />;
      case "password":
        return <PasswordInput {...stepProps} />;
      case "register-email":
        return <RegisterEmailInput {...stepProps} />;
      case "register-otp":
        return (
          <RegisterOTPInput
            {...stepProps}
            email={stepProps.emailIdentifier}
            onBack={() => stepProps.onBack("register-email")}
          />
        );
      case "register-details":
        return (
          <RegisterDetailsInput
            {...stepProps}
            email={stepProps.emailIdentifier}
            onBack={() => stepProps.onBack("register-otp")}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordInput
            {...stepProps}
            onBack={() => stepProps.onBack("email")}
            onNext={(email) => {
              setEmailIdentifier(email);
              navigateTo("forgot-otp");
            }}
          />
        );
      case "forgot-otp":
        return (
          <ForgotOTPInput
            {...stepProps}
            email={stepProps.emailIdentifier}
            onBack={() => stepProps.onBack("forgot-password")}
          />
        );
      default:
        return <EmailInput {...stepProps} />;
    }
  };

  // Dynamically apply animation classes to the box
  const getAnimationClasses = () => {
    if (isInitialLoad) return "opacity-0"; // Start invisible for initial fade-in
    if (!isAnimating) return "opacity-100"; // Fully visible when not animating

    // When animating, apply slide-out class
    if (animationDirection === "left") {
      return "animate-slide-out-left";
    }
    return "animate-slide-out-right";
  };

  // Apply animation classes to the *content* inside the box
  const getContentAnimationClasses = () => {
    if (isInitialLoad) return "opacity-0"; // Start invisible for initial fade-in
    if (!isAnimating) {
      // When not animating, slide in the content
      return animationDirection === "left"
        ? "animate-slide-in-right"
        : "animate-slide-in-left";
    }
    // While animating, content fades out
    return "opacity-0";
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    >
      {/* Main content area - centered */}
      <div className="flex-1 flex items-center justify-center py-8">
        {/* Form box */}
        <div
          className={`w-full max-w-[432px] bg-[#292929] text-white shadow-2xl rounded-2xl p-8 
                      transition-all duration-300 relative overflow-hidden ${getAnimationClasses()}`}
        >
          {/* Animated Content Wrapper */}
          <div
            className={`transition-opacity duration-300 ${getContentAnimationClasses()}`}
          >
            {renderStep()}
          </div>
        </div>
      </div>

      {/* Footer - pinned to bottom */}
      <div className="text-[11px] text-white text-center pb-6 space-x-3 flex flex-wrap justify-center gap-y-2">
        <a href="#" className="hover:underline text-[#8EA6F0]">
          Help and feedback
        </a>
        <a href="#" className="hover:underline text-[#8EA6F0]">
          Terms of use
        </a>
        <a href="#" className="hover:underline text-[#8EA6F0]">
          Privacy and cookies
        </a>
        <p className="mt-2 w-full text-white">
          Use private browsing if this is not your device.{" "}
          <a href="#" className="text-[#8EA6F0] hover:underline">
            Learn more
          </a>
        </p>
      </div>
    </div>
  );
}

// --- Sub-components for each step ---

// Email/Phone Input Component
function EmailInput({
  emailIdentifier,
  setEmailIdentifier,
  onNext,
  onSwitchToRegister,
  onForgotPassword,
}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Simulate checking if user exists
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    onNext(emailIdentifier);
  };

  return (
    <div className="flex flex-col space-y-6">
      {" "}
      {/* REMOVED h-full and justify-between */}
      <div>
        {/* Microsoft logo */}
        <div className="flex justify-center mb-2">
          <img
            src={MICROSOFT_LOGO}
            alt="Microsoft Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center">Sign in</h2>
        <p className="text-sm text-center text-gray-400">
          Use your Microsoft account.
        </p>

        {error && (
          <div className="text-red-400 text-sm text-center mt-4">{error}</div>
        )}

        {/* Input field */}
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <input
              placeholder="Email or phone number"
              className="w-full bg-transparent border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#4F52B2] outline-none"
              value={emailIdentifier}
              onChange={(e) => setEmailIdentifier(e.target.value)}
              required
              autoFocus
            />
            <button
              type="button"
              className="text-sm text-[#6F74D1] hover:underline inline-block"
              onClick={onForgotPassword}
            >
              Forgot username?
            </button>
          </div>

          {/* Next button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F52B2] hover:bg-[#4144a3] text-white font-semibold py-2 rounded-md transition mt-6 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Next"}
          </button>
        </form>
      </div>
      {/* Create account */}
      <div className="text-center text-sm text-gray-400">
        {" "}
        {/* REMOVED mt-4 */}
        New to Microsoft?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-[#6F74D1] hover:underline"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}

// Password Input Component
function PasswordInput({
  emailIdentifier,
  password,
  setPassword,
  onBack,
  onLoginSuccess,
}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailIdentifier, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "Incorrect password.");
      }
      onLoginSuccess(data.token);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {" "}
      {/* REMOVED h-full and justify-between */}
      <div>
        {/* Microsoft logo */}
        <div className="flex justify-center mb-2">
          <img
            src={MICROSOFT_LOGO}
            alt="Microsoft Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Back button and email */}
        <div className="flex items-center text-gray-300 text-sm mb-4">
          <button
            onClick={() => onBack("email")}
            className="p-1 rounded-full hover:bg-gray-700 mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <span className="truncate">{emailIdentifier}</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center">Enter password</h2>

        {error && (
          <div className="text-red-400 text-sm text-center mt-4">{error}</div>
        )}

        {/* Input field */}
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#4F52B2] outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Next button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F52B2] hover:bg-[#4144a3] text-white font-semibold py-2 rounded-md transition mt-6 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
      {/* Other ways to sign in */}
      <div className="text-center text-sm">
        <button
          onClick={() => alert("Other ways to sign in would go here!")}
          className="text-[#6F74D1] hover:underline"
        >
          Other ways to sign in
        </button>
      </div>
    </div>
  );
}

// Register Step 1: Email Input
function RegisterEmailInput({
  emailIdentifier,
  setEmailIdentifier,
  onRegisterNext,
  onSwitchToLogin,
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate OTP send
    setLoading(false);
    onRegisterNext(emailIdentifier);
  };

  return (
    <div className="flex flex-col space-y-6">
      {" "}
      {/* REMOVED h-full and justify-between */}
      <div>
        {/* Microsoft logo */}
        <div className="flex justify-center mb-2">
          <img
            src={MICROSOFT_LOGO}
            alt="Microsoft Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center">Create account</h2>

        {/* Input field */}
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-transparent border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#4F52B2] outline-none"
              value={emailIdentifier}
              onChange={(e) => setEmailIdentifier(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Next button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F52B2] hover:bg-[#4144a3] text-white font-semibold py-2 rounded-md transition mt-6 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Next"}
          </button>
        </form>
      </div>
      {/* Sign in link */}
      <div className="text-center text-sm text-gray-400">
        {" "}
        {/* REMOVED mt-4 */}
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-[#6F74D1] hover:underline"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

// Register Step 2: OTP Input
function RegisterOTPInput({ email, onOtpVerified, onBack }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (index === 5 && value) {
      // All boxes are now filled
      const completeOtp = [...newOtp];
      completeOtp[index] = value;
      const otpCode = completeOtp.join("");

      // Trigger submission automatically
      setTimeout(() => {
        if (otpCode === "123456") {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            onOtpVerified();
          }, 500);
        } else {
          setError("Invalid OTP. Use 123456 to continue.");
        }
      }, 100);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError(null);
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));
    if (otpCode === "123456") {
      // Dummy OTP
      setLoading(false);
      alert(
        "✅ Email verified successfully! Please complete your registration."
      );
      onOtpVerified();
    } else {
      setError("Invalid OTP. Use 123456 to continue.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    // Simulate resending code
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert("Code resent!");
  };

  return (
    <div className="flex flex-col space-y-6">
      <div>
        {/* Header with back button and Microsoft logo */}
        <div className="flex items-center justify-between mb-6">
          {/* Back button */}
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-gray-700 text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Microsoft logo */}
          <img
            src={MICROSOFT_LOGO}
            alt="Microsoft Logo"
            className="h-10 w-auto"
          />

          {/* Spacer to keep logo centered */}
          <div className="w-7"></div>
        </div>

        {/* Email display with fully rounded border */}
        <div className="flex justify-center mb-6">
          <div className="border border-gray-600 rounded-full px-6 py-2 text-center">
            <span className="text-gray-300 text-sm">{email}</span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center mb-2">
          Verify your email
        </h2>
        <p className="text-sm text-center text-gray-400 mb-6">
          Enter the code we sent to your email address.
        </p>

        {error && (
          <div className="text-red-400 text-sm text-center mb-4">{error}</div>
        )}

        {/* OTP Input - 6 boxes */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                className="w-12 h-14 bg-transparent border border-gray-600 text-white text-center text-xl rounded-md focus:ring-2 focus:ring-[#4F52B2] outline-none"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Resend code link */}
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-[#6F74D1] hover:underline"
              onClick={handleResend}
            >
              Resend code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Register Step 3: Name and Password Input
function RegisterDetailsInput({
  email,
  name,
  setName,
  password,
  setPassword,
  onRegisterSuccess,
  onBack,
}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.errors
          ? data.errors[0].msg
          : data.msg || "Failed to register";
        throw new Error(errorMsg);
      }
      onRegisterSuccess(data.token);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-6">
      <div>
        {/* Microsoft logo */}
        <div className="flex justify-center mb-2">
          <img
            src={MICROSOFT_LOGO}
            alt="Microsoft Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Back button and email */}
        <div className="flex items-center text-gray-300 text-sm mb-4">
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-gray-700 mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <span className="truncate">{email}</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center">
          Tell us about yourself
        </h2>

        {error && (
          <div className="text-red-400 text-sm text-center mt-4">{error}</div>
        )}

        {/* Input field */}
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              placeholder="Full name"
              className="w-full bg-transparent border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#4F52B2] outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            <input
              type="password"
              placeholder="Create password"
              className="w-full bg-transparent border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#4F52B2] outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Next button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F52B2] hover:bg-[#4144a3] text-white font-semibold py-2 rounded-md transition mt-6 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Forgot Username Component
function ForgotPasswordInput({ onBack, onNext }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [usePhone, setUsePhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate sending recovery code
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    onNext(emailOrPhone);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div>
        {/* Header with close button and Microsoft logo */}
        <div className="flex items-center justify-between mb-6">
          {/* Close button */}
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-gray-700 text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Microsoft logo */}
          <img
            src={MICROSOFT_LOGO}
            alt="Microsoft Logo"
            className="h-10 w-auto"
          />

          {/* Spacer to keep logo centered */}
          <div className="w-7"></div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center mb-2">
          Recover your username
        </h2>
        <p className="text-sm text-center text-gray-400 mb-6">
          Enter an email that might be associated with your Microsoft account.
          If it matches, we'll send you a code.
        </p>

        {error && (
          <div className="text-red-400 text-sm text-center mb-4">{error}</div>
        )}

        {/* Input field */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type={usePhone ? "tel" : "email"}
              placeholder={usePhone ? "Phone number" : "Email"}
              className="w-full bg-transparent border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#4F52B2] outline-none"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
              autoFocus
            />

            {/* Toggle between email/phone */}
            <button
              type="button"
              className="text-sm text-[#6F74D1] hover:underline inline-block"
              onClick={() => {
                setUsePhone(!usePhone);
                setEmailOrPhone("");
              }}
            >
              {usePhone ? "Use email instead" : "Use phone number instead"}
            </button>
          </div>

          {/* Next button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F52B2] hover:bg-[#4144a3] text-white font-semibold py-2 rounded-md transition mt-6 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Forgot Username OTP Verification Component
function ForgotOTPInput({ email, onBack }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError(null);
    setLoading(true);

    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    alert(`Username recovery successful! Code: ${otpCode}`);
    // In a real app, display the username or navigate to success page
  };

  return (
    <div className="flex flex-col space-y-6">
      <div>
        {/* Header with close button and Microsoft logo */}
        <div className="flex items-center justify-between mb-6">
          {/* Close button */}
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-gray-700 text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Microsoft logo */}
          <img
            src={MICROSOFT_LOGO}
            alt="Microsoft Logo"
            className="h-10 w-auto"
          />

          {/* Spacer to keep logo centered */}
          <div className="w-7"></div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center mb-2">
          Verify your email
        </h2>
        <p className="text-sm text-center text-gray-400 mb-6">
          Enter the code we sent to {email}.
        </p>

        {error && (
          <div className="text-red-400 text-sm text-center mb-4">{error}</div>
        )}

        {/* OTP Input */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                className="w-12 h-14 bg-transparent border border-gray-600 text-white text-center text-xl rounded-md focus:ring-2 focus:ring-[#4F52B2] outline-none"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Try different email link */}
          <div className="text-center mb-6">
            <button
              type="button"
              className="text-sm text-[#6F74D1] hover:underline"
              onClick={onBack}
            >
              Try a different email or phone number
            </button>
          </div>

          {/* Verify button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F52B2] hover:bg-[#4144a3] text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}
