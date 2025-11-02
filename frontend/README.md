# Teams Clone Frontend

Modern React + Vite frontend with Microsoft Teams-inspired UI, real-time communication, and WebRTC video calling.

## Features

- 🔐 **Complete Auth Flow** - Registration, login, OTP verification (auto-submits on 6 digits)
- 💬 **Real-time Chat** - Instant messaging with Socket.IO, typing indicators, reactions
- 📞 **Video Calls** - WebRTC audio/video calls with screen sharing
- 📅 **Calendar Integration** - Meeting scheduling and management (UI in progress)
- 🎨 **Teams-like UI** - Professional interface built with TailwindCSS
- 👥 **User Presence** - Real-time online/offline status indicators
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Quick Setup

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173`

## Technologies

- **React 18.2** - Modern React with hooks
- **Vite 5.0** - Lightning-fast build tool
- **TailwindCSS 3.3** - Utility-first CSS framework
- **Socket.IO Client 4.8** - Real-time communication
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing (if used)

## Environment Variables

Create `.env` file:

```bash
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

## Project Structure

```
src/
├── App.jsx                    # Main app & routing
├── main.jsx                   # Entry point
├── components/
│   ├── Auth/
│   │   ├── Login.jsx         # Login form
│   │   ├── Register.jsx      # Registration form
│   │   └── RegisterOTPInput.jsx  # OTP verification (auto-submit)
│   ├── Chat/
│   │   ├── ChatArea.jsx      # Main chat interface
│   │   ├── Message.jsx       # Individual message
│   │   └── MessageInput.jsx  # Message composer
│   ├── Layout/
│   │   ├── Header.jsx        # Top navigation bar
│   │   ├── Sidebar.jsx       # Left sidebar with icons
│   │   └── ChannelList.jsx   # Teams/channels navigation
│   ├── Calls/
│   │   ├── VideoCall.jsx     # Video call interface
│   │   ├── CallControls.jsx  # Audio/video/screen controls
│   │   └── ParticipantGrid.jsx # Participant video grid
│   └── Calendar/
│       └── (UI components in progress)
└── assets/
    └── (static assets)
```

## Key Components

### Authentication Flow

1. **Register** - Email, name, password signup
2. **OTP Verification** - 6-digit code (dummy: 123456), auto-submits when complete
3. **Login** - Email/password with JWT token storage

### Chat Features

- Real-time message delivery
- Typing indicators (shows "User is typing...")
- Message reactions (emoji responses)
- User presence (online/offline status)
- Channel-based conversations

### Video Calls

- WebRTC peer-to-peer connections
- Audio on/off toggle
- Video on/off toggle
- Screen sharing
- Multi-participant support

## Building for Production

```bash
npm run build
npm run preview    # Preview production build
```

Production build outputs to `dist/` folder.

## Development

```bash
npm run dev        # Start dev server with HMR
npm run lint       # Run ESLint
npm run build      # Production build
```

## Documentation

- **[Main README](../README.md)** - Project overview
- **[Quickstart Guide](../QUICKSTART.md)** - Setup instructions
- **[API Reference](../API_ENDPOINTS.md)** - Backend API endpoints
