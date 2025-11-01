import React, { useState } from 'react';
import AuthFlow from './components/AuthFlow';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  const handleAuthSuccess = (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
    // You would likely redirect to the main app here
    console.log("Authentication successful! Token:", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    console.log("Logged out.");
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Teams!</h1>
          <p className="text-lg mb-6">You are now logged in.</p>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
      ) : (


        <AuthFlow onAuthSuccess={handleAuthSuccess} />

        // <MicrosoftLoginClone/>
      )}
    </div>
  );
}

export default App;