import React, { useState, useEffect, useRef } from "react";
import MICROSOFT_LOGO from "../assets/logo.png";
import BACKGROUND_IMAGE from "../assets/fluent_web_dark_2.svg";

// Use the new asset paths you provided
// import microsoftLogo from "../assets/logo.png"; // Removed import
// import bg from "../assets/fluent_web_dark_2.svg"; // Removed import

// --- Configuration ---
const API_URL = 'http://localhost:3001/auth';

// --- Main AuthFlow Component ---
export default function AuthFlow({ onAuthSuccess }) {
  // States to manage the multi-step flow
  const [currentStep, setCurrentStep] = useState('email'); // 'email', 'password', 'register-email', 'register-otp', 'register-details'
  const [emailIdentifier, setEmailIdentifier] = useState(''); // Stores email/phone for login/registration
  const [password, setPassword] = useState(''); // Stores password for login/registration
  const [userName, setUserName] = useState(''); // Stores name for registration

  // Animation related states
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('left'); // 'left' or 'right'
  const [isInitialLoad, setIsInitialLoad] = useState(true); // For initial fade-in

  useEffect(() => {
    // Set initial load to false after first render
    const timer = setTimeout(() => setIsInitialLoad(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Function to handle transitions between steps with animation
  const navigateTo = (newStep, direction = 'left') => {
    setAnimationDirection(direction);
    setIsAnimating(true);

    // Wait for the slide-out animation to complete (0.3s)
    setTimeout(() => {
      setCurrentStep(newStep);
      setIsAnimating(false); // Reset animation state for slide-in
      // Clear specific inputs if transitioning away from them
      if (newStep === 'email' || newStep === 'register-email') {
          setPassword('');
          setUserName('');
      }
    }, 300); // Duration matches CSS transition
  };

  // --- Handlers for authentication success ---
  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    onAuthSuccess(token);
  };

  const handleRegistrationSuccess = (token) => {
    localStorage.setItem('token', token);
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
        navigateTo('password');
      },
      onSwitchToRegister: () => navigateTo('register-email'),
      onLoginSuccess: handleLoginSuccess,
      onBack: (step) => navigateTo(step, 'right'),
      onRegisterNext: (email) => {
        setEmailIdentifier(email);
        console.log(`Simulating OTP send to: ${email}`);
        navigateTo('register-otp');
      },
      onSwitchToLogin: () => navigateTo('email', 'right'),
      onOtpVerified: () => navigateTo('register-details'),
      onRegisterSuccess: handleRegistrationSuccess,
    };

    // Render the component for the current step
    switch (currentStep) {
      case 'email':
        return <EmailInput {...stepProps} />;
      case 'password':
        return <PasswordInput {...stepProps} />;
      case 'register-email':
        return <RegisterEmailInput {...stepProps} />;
      case 'register-otp':
        return <RegisterOTPInput {...stepProps} email={stepProps.emailIdentifier} onBack={() => stepProps.onBack('register-email')} />;
      case 'register-details':
        return <RegisterDetailsInput {...stepProps} email={stepProps.emailIdentifier} onBack={() => stepProps.onBack('register-otp')} />;
      default:
        return <EmailInput {...stepProps} />;
    }
  };

  // Dynamically apply animation classes to the box
  const getAnimationClasses = () => {
    if (isInitialLoad) return 'opacity-0'; // Start invisible for initial fade-in
    if (!isAnimating) return 'opacity-100'; // Fully visible when not animating
    
    // When animating, apply slide-out class
    if (animationDirection === 'left') {
      return 'animate-slide-out-left';
    }
    return 'animate-slide-out-right';
  };

  // Apply animation classes to the *content* inside the box
  const getContentAnimationClasses = () => {
    if (isInitialLoad) return 'opacity-0'; // Start invisible for initial fade-in
    if (!isAnimating) {
        // When not animating, slide in the content
        return animationDirection === 'left' ? 'animate-slide-in-right' : 'animate-slide-in-left';
    }
    // While animating, content fades out
    return 'opacity-0'; 
  };


  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    >
      {/* Form box */}
      <div
        className={`w-full max-w-[432px] bg-[#292929] text-white shadow-2xl rounded-2xl p-8 
                    transition-all duration-300 relative overflow-hidden ${getAnimationClasses()}`}
      >
        {/* Animated Content Wrapper */}
        <div className={`transition-opacity duration-300 ${getContentAnimationClasses()}`}>
            {renderStep()}
        </div>
      </div>
         
      {/* Footer (below form) */}
      <div className="text-[11px] text-white text-center mt-8 space-x-3 flex flex-wrap justify-center gap-y-2">
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
function EmailInput({ emailIdentifier, setEmailIdentifier, onNext, onSwitchToRegister }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Simulate checking if user exists
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
    onNext(emailIdentifier);
  };

  return (
    <div className="flex flex-col space-y-6"> {/* REMOVED h-full and justify-between */}
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
              onClick={() => alert('Forgot username functionality would go here!')}
            >
              Forgot your username?
            </button>
          </div>

          {/* Next button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F52B2] hover:bg-[#4144a3] text-white font-semibold py-2 rounded-md transition mt-6 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Next'}
          </button>
        </form>
      </div>

      {/* Create account */}
      <div className="text-center text-sm text-gray-400"> {/* REMOVED mt-4 */}
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
function PasswordInput({ emailIdentifier, password, setPassword, onLoginSuccess, onBack }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailIdentifier, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Incorrect password.');
      }
      onLoginSuccess(data.token);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6"> {/* REMOVED h-full and justify-between */}
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
          <button onClick={() => onBack('email')} className="p-1 rounded-full hover:bg-gray-700 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
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
            <button
              type="button"
              className="text-sm text-[#6F74D1] hover:underline inline-block"
              onClick={() => alert('Forgot password functionality would go here!')}
            >
              Forgot password?
            </button>
          </div>

          {/* Next button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F52B2] hover:bg-[#4144a3] text-white font-semibold py-2 rounded-md transition mt-6 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>

      {/* Other ways to sign in */}
      <div className="text-center text-sm">
        <button
          onClick={() => alert('Other ways to sign in would go here!')}
          className="text-[#6F74D1] hover:underline"
        >
          Other ways to sign in
        </button>
      </div>
    </div>
  );
}

// Register Step 1: Email Input
function RegisterEmailInput({ emailIdentifier, setEmailIdentifier, onRegisterNext, onSwitchToLogin }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate OTP send
        setLoading(false);
        onRegisterNext(emailIdentifier);
    };

    return (
      <div className="flex flex-col space-y-6"> {/* REMOVED h-full and justify-between */}
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
              {loading ? 'Sending...' : 'Next'}
            </button>
          </form>
        </div>

        {/* Sign in link */}
        <div className="text-center text-sm text-gray-400"> {/* REMOVED mt-4 */}
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
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 500));
        if (otp === '123456') { // Dummy OTP
            onOtpVerified();
        } else {
            setError('Invalid OTP. Use 123456 to continue.');
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
            <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-700 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </button>
            <span className="truncate">{email}</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-semibold text-center">Enter code</h2>
          <p className="text-sm text-center text-gray-400">
            We sent a code to <strong className="text-white">{email}</strong>.
          </p>

          {error && (
              <div className="text-red-400 text-sm text-center mt-4">{error}</div>
          )}

          {/* Input field */}
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <input
                placeholder="Enter code"
                maxLength="6"
                className="w-full bg-transparent border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#4F52B2] outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoFocus
              />
              <button
                type="button"
                className="text-sm text-[#6F74D1] hover:underline inline-block"
                onClick={() => alert('Resend code functionality would go here!')}
              >
                Resend code
              </button>
            </div>

            {/* Next button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#4F52B2] hover:bg-[#4144a3] text-white font-semibold py-2 rounded-md transition mt-6 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Next'}
            </button>
          </form>
        </div>
      </div>
    );
}

// Register Step 3: Name and Password Input
function RegisterDetailsInput({ email, name, setName, password, setPassword, onRegisterSuccess, onBack }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                const errorMsg = data.errors ? data.errors[0].msg : (data.msg || 'Failed to register');
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
            <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-700 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </button>
            <span className="truncate">{email}</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-semibold text-center">Tell us about yourself</h2>

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
              {loading ? 'Creating account...' : 'Next'}
            </button>
          </form>
        </div>
      </div>
    );
}



