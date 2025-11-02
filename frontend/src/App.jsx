import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import HomePage from "./components/HomePage";
import AuthFlow from "./components/AuthFlow";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";
import JoinMeeting from "./components/JoinMeeting";
// import Temp from "./components/Temp";

// ✅ This small component handles logout automatically
function Logout({ onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    onLogout(); // Clear token, set state, etc.
    navigate("/login"); // Redirect after logout
  }, [onLogout, navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-foreground">
      <p>Logging you out...</p>
    </div>
  );
}

// Component to handle protected route redirects
function ProtectedRoute({ children, isAuthenticated }) {
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the current location to redirect after login
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setToken] = useState(null);
  const navigate = useNavigate();

  // ✅ Check for saved token when app loads
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ Handle login success
  const handleAuthSuccess = (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem("token", newToken);
    console.log("Authentication successful! Token:", newToken);

    // Check if there's a saved redirect URL
    const redirectUrl = localStorage.getItem("redirectAfterLogin");
    if (redirectUrl) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectUrl);
    } else {
      navigate("/dashboard");
    }
  };

  // ✅ Handle logout
  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    console.log("Logged out.");
  };

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <HomePage />
            )
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthFlow onAuthSuccess={handleAuthSuccess} />
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthFlow onAuthSuccess={handleAuthSuccess} />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Join Meeting - Full page route */}
        <Route
          path="/join-meeting"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <JoinMeeting />
            </ProtectedRoute>
          }
        />

        {/* ✅ Logout route */}
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />

        {/* 404 fallback */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  );
}

// function App() {
//   return (
//     <Router>
//       <AppContent />
//      </Router>
//   );
// }

export default AppContent;
