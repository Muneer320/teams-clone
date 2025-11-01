// import { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
// import ChannelList from "./components/ChannelList";
// import ChatArea from "./components/ChatArea";
// import "./App.css";

// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

// function App() {
//   const [socket, setSocket] = useState(null);
//   const [teams, setTeams] = useState([]);
//   const [currentChannel, setCurrentChannel] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [currentUser] = useState({ id: "user-1", name: "You", avatar: "👤" });

//   // Initialize socket connection
//   useEffect(() => {
//     const newSocket = io(SOCKET_URL);
//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("✅ Connected to server");
//       fetchInitialData();
//     });

//     newSocket.on("new_message", (message) => {
//       if (message.channelId === currentChannel?.id) {
//         setMessages((prev) => [...prev, message]);
//       }
//     });

//     newSocket.on("presence_update", ({ userId, status }) => {
//       setUsers((prev) =>
//         prev.map((user) => (user.id === userId ? { ...user, status } : user))
//       );
//     });

//     return () => {
//       newSocket.close();
//     };
//   }, []);

//   // Fetch initial data from backend
//   const fetchInitialData = async () => {
//     try {
//       const response = await fetch(`${SOCKET_URL}/env/state`);
//       const data = await response.json();

//       if (data.success) {
//         setTeams(data.state.teams);
//         setUsers(data.state.users);

//         // Set initial channel
//         if (
//           data.state.teams.length > 0 &&
//           data.state.teams[0].channels.length > 0
//         ) {
//           const firstChannel = data.state.teams[0].channels[0];
//           setCurrentChannel(firstChannel);
//           setMessages(data.state.recentMessages || []);

//           // Join the channel room
//           if (socket) {
//             socket.emit("join_channel", firstChannel.id);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching initial data:", error);
//     }
//   };

//   const handleChannelSwitch = (channel) => {
//     if (currentChannel && socket) {
//       socket.emit("leave_channel", currentChannel.id);
//     }

//     setCurrentChannel(channel);
//     setMessages([]); // Clear messages (in real app, fetch from backend)

//     if (socket) {
//       socket.emit("join_channel", channel.id);
//     }

//     // Fetch messages for this channel
//     fetchChannelMessages(channel.id);
//   };

//   const fetchChannelMessages = async (channelId) => {
//     // In a real implementation, fetch from backend
//     // For now, we'll get them from the environment state
//     try {
//       const response = await fetch(`${SOCKET_URL}/env/state`);
//       const data = await response.json();

//       if (data.success) {
//         // Filter messages for this channel (mock)
//         setMessages(data.state.recentMessages || []);
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   const handleSendMessage = (content) => {
//     if (!socket || !currentChannel) return;

//     const messageData = {
//       channelId: currentChannel.id,
//       userId: currentUser.id,
//       content,
//     };

//     socket.emit("send_message", messageData);
//   };

//   return (
//     <div className="app-container">
//       <Header currentUser={currentUser} />
//       <div className="teams-layout">
//         <Sidebar teams={teams} />
//         <ChannelList
//           teams={teams}
//           currentChannel={currentChannel}
//           onChannelSwitch={handleChannelSwitch}
//         />
//         <ChatArea
//           channel={currentChannel}
//           messages={messages}
//           users={users}
//           currentUser={currentUser}
//           onSendMessage={handleSendMessage}
//         />
//       </div>
//     </div>
//   );
// }

// export default App;






















// import React, { useState, useEffect } from 'react';

// // --- Configuration ---
// const API_URL = 'http://localhost:3001/auth';

// // --- Main App Component ---
// export default function App() {
//   const [token, setToken] = useState(localStorage.getItem('token'));
  
//   // This state now controls the entire auth flow
//   // 'login', 'register-email', 'register-otp', 'register-details'
//   const [authState, setAuthState] = useState('login');
  
//   // We need to store the email across registration steps
//   const [registrationEmail, setRegistrationEmail] = useState('');

//   useEffect(() => {
//     if (token) {
//       localStorage.setItem('token', token);
//     } else {
//       localStorage.removeItem('token');
//     }
//   }, [token]);

//   // --- Handlers ---
//   const handleLoginSuccess = (newToken) => {
//     setToken(newToken);
//   };

//   const handleRegisterSuccess = (newToken) => {
//     setToken(newToken);
//     // On success, reset auth flow to login
//     setAuthState('login');
//   };

//   const handleLogout = () => {
//     setToken(null);
//     setAuthState('login');
//   };

//   // This function is called from the 'RegisterEmail' component
//   const handleEmailSubmit = (email) => {
//     setRegistrationEmail(email);
//     setAuthState('register-otp');
//     // TODO: This is where you would call your backend to send a real OTP
//     console.log(`Simulating OTP send for: ${email}`);
//   };

//   // This function is called from the 'RegisterOTP' component
//   const handleOtpSuccess = () => {
//     setAuthState('register-details');
//   };

//   // --- Render Logic ---
//   const renderAuthView = () => {
//     switch (authState) {
//       case 'login':
//         return (
//           <Login
//             onLoginSuccess={handleLoginSuccess}
//             onSwitchToRegister={() => setAuthState('register-email')}
//           />
//         );
//       case 'register-email':
//         return (
//           <RegisterEmail
//             onEmailSubmit={handleEmailSubmit}
//             onSwitchToLogin={() => setAuthState('login')}
//           />
//         );
//       case 'register-otp':
//         return (
//           <RegisterOTP
//             email={registrationEmail}
//             onOtpSuccess={handleOtpSuccess}
//             onBack={() => setAuthState('register-email')}
//           />
//         );
//       case 'register-details':
//         return (
//           <RegisterDetails
//             email={registrationEmail}
//             onRegisterSuccess={handleRegisterSuccess}
//             onBack={() => setAuthState('register-otp')}
//           />
//         );
//       default:
//         return <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setAuthState('register-email')} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {token ? (
//           <Dashboard token={token} onLogout={handleLogout} />
//         ) : (
//           renderAuthView()
//         )}
//       </div>
//     </div>
//   );
// }

// // --- Login Component ---
// function Login({ onLoginSuccess, onSwitchToRegister }) {
//   // We'll just call the state 'identifier' to be generic
//   const [identifier, setIdentifier] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       // NOTE: Your backend only accepts 'email'. 
//       // For a real 'Email or Phone' login, the backend
//       // would need to check for both.
//       const response = await fetch(`${API_URL}/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         // We send it as 'email' since that's what the backend expects
//         body: JSON.stringify({ email: identifier, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.msg || 'Failed to login');
//       }
      
//       onLoginSuccess(data.token);

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
//       <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
//         Sign In to Teams
//       </h2>
//       {error && (
//         <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-md mb-4" role="alert">
//           <span className="block sm:inline">{error}</span>
//         </div>
//       )}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Email or Phone
//           </label>
//           <input
//             type="text" // Changed from 'email' to 'text'
//             value={identifier}
//             onChange={(e) => setIdentifier(e.target.value)}
//             className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Password
//           </label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
//         >
//           {loading ? 'Signing In...' : 'Sign In'}
//         </button>
//       </form>
//       <p className="text-center text-gray-400 text-sm mt-6">
//         Don't have an account?{' '}
//         <button
//           onClick={onSwitchToRegister}
//           className="font-medium text-blue-400 hover:text-blue-300"
//         >
//           Create one!
//         </button>
//       </p>
//     </div>
//   );
// }

// // --- Register Step 1: Email ---
// function RegisterEmail({ onEmailSubmit, onSwitchToLogin }) {
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     // Here, you would normally call your backend API to send the OTP
//     // e.g., await fetch(`${API_URL}/send-otp`, { method: 'POST', ... })
//     // For now, we just simulate it and move to the next step.
//     await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
//     setLoading(false);
//     onEmailSubmit(email);
//   };

//   return (
//     <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
//       <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
//         Create Account
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Enter your email
//           </label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
//         >
//           {loading ? 'Sending...' : 'Next'}
//         </button>
//       </form>
//       <p className="text-center text-gray-400 text-sm mt-6">
//         Already have an account?{' '}
//         <button
//           onClick={onSwitchToLogin}
//           className="font-medium text-blue-400 hover:text-blue-300"
//         >
//           Sign in
//         </button>
//       </p>
//     </div>
//   );
// }

// // --- Register Step 2: OTP ---
// function RegisterOTP({ email, onOtpSuccess, onBack }) {
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     // --- SIMULATED OTP CHECK ---
//     // TODO: Replace this with a real API call to your backend
//     // e.g., const response = await fetch(`${API_URL}/verify-otp`, ...)
//     await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

//     if (otp === '123456') {
//       // Dummy OTP is correct
//       onOtpSuccess();
//     } else {
//       setError('Invalid OTP. Use 123456 to continue.');
//       setLoading(false);
//     }
//     // --- END SIMULATION ---
//   };

//   return (
//     <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
//       <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
//         Verify your email
//       </h2>
//       <p className="text-center text-gray-400 text-sm mb-6">
//         Enter the 6-digit code sent to <br/>
//         <strong className="text-gray-200">{email}</strong>
//       </p>
//       {error && (
//         <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-md mb-4" role="alert">
//           <span className="block sm:inline">{error}</span>
//         </div>
//       )}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Verification Code (use 123456)
//           </label>
//           <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             maxLength="6"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
//         >
//           {loading ? 'Verifying...' : 'Verify'}
//         </button>
//       </form>
//       <button
//         onClick={onBack}
//         className="text-center text-gray-400 text-sm mt-6 w-full hover:text-gray-200"
//       >
//         &larr; Back
//       </button>
//     </div>
//   );
// }

// // --- Register Step 3: Details ---
// function RegisterDetails({ email, onRegisterSuccess, onBack }) {
//   const [name, setName] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       // This is the final registration call to the endpoint we already built
//       const response = await fetch(`${API_URL}/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         // We send the email from the previous step, plus the new name and password
//         body: JSON.stringify({ name, email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         const errorMsg = data.errors ? data.errors[0].msg : (data.msg || 'Failed to register');
//         throw new Error(errorMsg);
//       }

//       // On success, pass the token up to log the user in
//       onRegisterSuccess(data.token);

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
//       <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
//         Final Step
//       </h2>
//       <p className="text-center text-gray-400 text-sm mb-6">
//         Create your password for <strong className="text-gray-200">{email}</strong>
//       </p>
//       {error && (
//         <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-md mb-4" role="alert">
//           <span className="block sm:inline">{error}</span>
//         </div>
//       )}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Your Name
//           </label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Password (6+ characters)
//           </label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
//         >
//           {loading ? 'Creating Account...' : 'Finish Sign Up'}
//         </button>
//       </form>
//        <button
//         onClick={onBack}
//         className="text-center text-gray-400 text-sm mt-6 w-full hover:text-gray-200"
//       >
//         &larr; Back
//       </button>
//     </div>
//   );
// }

// // --- Dashboard Component (The "Logged In" View) ---
// function Dashboard({ token, onLogout }) {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       setUser(payload.user);
//     } catch (e) {
//       console.error('Failed to decode token:', e);
//       onLogout();
//     }
//   }, [token, onLogout]);

//   return (
//     <div className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
//       <h2 className="text-3xl font-bold text-blue-400 mb-4">
//         Welcome to Teams
//       </h2>
//       {user ? (
//         <p className="text-lg text-gray-300 mb-6">
//           You are logged in as <strong className="font-medium">{user.email}</strong>
//         </p>
//       ) : (
//         <p className="text-lg text-gray-300 mb-6">Loading user data...</p>
//       )}
//       <button
//         onClick={onLogout}
//         className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
//       >
//         Sign Out
//       </button>
//     </div>
//   );
// }



















// src/App.jsx (or main.jsx)
import React, { useState } from 'react';
import AuthFlow from './components/AuthFlow'; // Adjust path as needed
import MicrosoftLoginClone from './components/microsoftLoginClone';

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