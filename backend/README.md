# Teams Clone Backend

Node.js/Express backend server providing real-time communication, RL environment, and comprehensive API services.

## Features

- 🔐 **Authentication System** - JWT-based auth with bcrypt password hashing and OTP verification
- 💬 **Real-time Chat** - Socket.IO for instant messaging, typing indicators, presence updates
- 🤖 **RL Environment API** - 8 endpoints for training reinforcement learning agents
- 📅 **Calendar System** - 20 endpoints for meetings, scheduling, availability, reminders
- 📞 **Video Calls** - 13 endpoints for audio/video calls with WebRTC signaling
- 🗄️ **SQLite Database** - Auto-creates `data/teams_clone.db` on first run
- 🎯 **Teams/Channels** - Full Teams-like organization structure

## Quick Setup

```bash
npm install
npm start
```

Server runs on `http://localhost:3001`

**Note**: Database auto-creates on first run. No manual database setup required.

## API Overview

**Total: 41 REST Endpoints**

- **RL Environment** (8): `/api/env/*` - Agent interaction, episode tracking, rewards
- **Calendar** (20): `/api/calendar/*` - Meetings, scheduling, availability, reminders
- **Calls** (13): `/api/calls/*` - Audio/video calls, screen sharing, recording

See [`../API_ENDPOINTS.md`](../API_ENDPOINTS.md) for complete endpoint list.

## Key Technologies

- **Express 4.18** - REST API framework
- **Socket.IO 4.8** - Real-time bidirectional communication
- **SQLite3 + sqlite** - Lightweight database with async wrapper
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **uuid** - Unique ID generation

## Architecture

```
backend/src/
├── server.js              # Main entry point
├── socket.js              # Socket.IO setup
├── models/
│   ├── Environment.js     # RL environment logic
│   ├── calendarManager.js # Calendar operations
│   └── callsManager.js    # Call management
├── routes/
│   ├── auth.js           # Authentication endpoints
│   ├── env.js            # RL environment endpoints
│   ├── calendar.js       # Calendar endpoints
│   └── calls.js          # Calls endpoints
└── data/
    └── teams_clone.db    # Auto-created SQLite database
```

## Environment Variables

Create `.env` file (optional - has sensible defaults):

```bash
PORT=3001
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Database Schema

SQLite database includes tables for:
- `users` - User accounts with hashed passwords
- `channels` - Team channels
- `messages` - Chat messages with reactions
- `meetings` - Calendar meetings with attendees
- `calls` - Call sessions and participants
- `episodes` - RL training episode history

Database auto-creates on first run. No migrations needed.

## Socket.IO Events

**Client → Server:**
- `join_channel` - Join channel room
- `send_message` - Send message
- `typing` - Typing indicator
- `update_presence` - Update user status
- `add_reaction` - React to message
- `webrtc-offer`, `webrtc-answer`, `webrtc-ice-candidate` - WebRTC signaling

**Server → Client:**
- `new_message` - New message broadcast
- `user_typing` - Typing indicator
- `presence_update` - User status change
- `reaction_added` - Reaction added
- `unread_update` - Unread count update
- `webrtc-*` - WebRTC signaling events

## Development

```bash
npm run dev    # Run with nodemon (auto-reload)
npm start      # Production mode
```

## Documentation

- **[API Endpoints](../API_ENDPOINTS.md)** - Complete endpoint list
- **[RL Overview](../RL_OVERVIEW.md)** - RL environment architecture
- **[Calendar API](../docs/CALENDAR_API.md)** - Calendar system guide
- **[Calls API](../docs/CALLS_API.md)** - Video calls system guide
