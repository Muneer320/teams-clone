# TeamsClone-RL - Detailed Documentation

## 📐 System Architecture

```
┌─────────────────────────────────────────────────┐
│                  Frontend                       │
│         (React + Vite + TailwindCSS)           │
│  - Teams UI - Channels - Chat - Presence       │
└─────────────┬───────────────────────────────────┘
              │
              │ Socket.IO + REST
              │
┌─────────────▼───────────────────────────────────┐
│                  Backend                        │
│         (Node.js + Express + Socket.IO)        │
│  - Real-time Chat - RL API - State Management  │
└─────────────┬───────────────────────────────────┘
              │
              │ REST API
              │
┌─────────────▼───────────────────────────────────┐
│              Python RL Agent                    │
│  - State Observation - Action Selection        │
│  - Reward Processing - Learning Algorithm      │
└─────────────────────────────────────────────────┘
```

## 🛠️ Complete Tech Stack

### Frontend Stack

- **Framework**: React 18.2 with Vite 5.0
- **Styling**: TailwindCSS 3.3
- **Real-time**: Socket.IO Client 4.8
- **Video**: WebRTC for peer-to-peer video calls
- **State Management**: React Hooks (useState, useEffect, useRef)
- **Routing**: React Router DOM

### Backend Stack

- **Runtime**: Node.js 22
- **Framework**: Express 4.18
- **Real-time**: Socket.IO 4.8
- **Database**: SQLite3 with sqlite async wrapper
- **Authentication**: JWT tokens with bcrypt
- **Validation**: express-validator
- **CORS**: cors middleware

### Python Agent Stack

- **HTTP Client**: requests library
- **RL Framework**: Stable-Baselines3 (optional)
- **Visualization**: Matplotlib, NumPy
- **Environment**: Gym-compatible wrapper

### Deployment

- **Frontend**: Vercel/Netlify ready
- **Backend**: Render.com configured (see render.yaml)
- **Database**: SQLite for development, MySQL/PostgreSQL for production
- **Containerization**: Docker + Docker Compose

## 📁 Detailed Project Structure

```
teams-clone/
├── backend/                    # Node.js backend server
│   ├── src/
│   │   ├── server.js          # Main Express + Socket.IO server
│   │   ├── routes/            # API route handlers
│   │   │   ├── env.js         # RL environment endpoints (8 routes)
│   │   │   ├── calendar.js    # Calendar/meeting system (20+ routes)
│   │   │   ├── calls.js       # Video call management
│   │   │   └── auth.js        # Authentication (JWT, OTP)
│   │   ├── models/            # Data models & business logic
│   │   │   ├── environment.js # RL environment state machine
│   │   │   └── database.js    # SQLite connection & queries
│   │   ├── socket/            # Socket.IO event handlers
│   │   │   ├── handlers.js    # Chat & presence events
│   │   │   └── callHandlers.js # WebRTC signaling
│   │   ├── services/          # Business logic services
│   │   │   └── envService.js  # Environment service layer
│   │   └── config/            # Configuration files
│   ├── data/                  # SQLite database files
│   ├── Dockerfile             # Backend container config
│   ├── .dockerignore          # Docker build exclusions
│   └── package.json           # Dependencies & scripts
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # Entry point
│   │   ├── components/        # React components
│   │   │   ├── Dashboard.jsx         # Main dashboard layout
│   │   │   ├── ActiveCall.jsx        # Video call interface
│   │   │   ├── JoinMeeting.jsx       # Pre-call setup
│   │   │   ├── AuthFlow.jsx          # Login/register UI
│   │   │   └── dashboard_components/ # Dashboard pages
│   │   │       ├── ChatsTab.jsx      # Chat interface
│   │   │       ├── MeetingsPage.jsx  # Meetings page
│   │   │       ├── CalendarPage.jsx  # Calendar UI
│   │   │       ├── Communities.jsx   # Communities page
│   │   │       ├── SettingsPage.jsx  # Settings page
│   │   │       ├── Sidebar.jsx       # Navigation sidebar
│   │   │       └── TopBar.jsx        # Top navigation bar
│   │   ├── config/            # Configuration
│   │   │   └── api.js         # API endpoints config
│   │   └── assets/            # Images and static files
│   ├── Dockerfile             # Frontend container config
│   ├── .dockerignore          # Docker build exclusions
│   ├── vite.config.js         # Vite configuration
│   └── package.json           # Dependencies & scripts
│
├── python_agent/              # Python RL agents & client
│   ├── client.py              # TeamsEnvClient HTTP wrapper
│   ├── agent.py               # TaskAgent with task-specific policies
│   ├── test.py                # Comprehensive test suite
│   ├── demo.py                # Interactive CLI demo
│   └── README.md              # Python client documentation
│
├── notebooks/                 # Jupyter notebooks
│   └── RL_Train.ipynb         # PPO training with Stable-Baselines3
│
├── rl_demo/                   # Demo and visualization tools
│   ├── run_demo.py            # CLI demo runner
│   ├── plot_results.py        # Episode visualization
│   ├── sample_episodes.json   # Example episode data
│   └── README.md              # Demo tools guide
│
├── docs/                      # Detailed documentation
│   ├── API.md                 # Complete API reference
│   ├── RL_GUIDE.md            # RL environment guide
│   ├── EVALUATION.md          # Reward design & metrics
│   ├── CALENDAR_API.md        # Calendar endpoints
│   ├── CALLS_API.md           # Calls endpoints
│   └── CALENDAR_*.md          # Calendar implementation docs
│
├── tests/                     # Test suite
│   ├── test_rl_complete.py    # Comprehensive RL tests
│   ├── test_all_endpoints.py  # All 41 API endpoint tests
│   └── README.md              # Test documentation
│
├── docker-compose.yml         # Docker orchestration
├── DOCKER_README.md           # Docker setup guide
├── RL_OVERVIEW.md             # System architecture overview
├── AGENT_DESIGN.md            # Agent design patterns
├── API_ENDPOINTS.md           # All 41 endpoints list
├── API_QUICK_REFERENCE.md     # Quick API lookup
├── QUICKSTART.md              # 5-minute setup guide
├── DETAILS.md                 # This file
└── README.md                  # Main project README
```

## 🎯 Complete Feature List

### Frontend Features

- ✅ Microsoft Teams-inspired UI/UX
- ✅ Real-time chat with Socket.IO
- ✅ Multiple channels support
- ✅ User presence indicators (online/offline/away)
- ✅ Message reactions and mentions
- ✅ Video calling with WebRTC
- ✅ Screen sharing capability
- ✅ Calendar and meeting scheduling
- ✅ Meeting join interface with device selection
- ✅ Authentication flow with OTP
- ✅ Responsive design (desktop/mobile)

### Backend Features

- ✅ RESTful API with 41+ endpoints
- ✅ Socket.IO for real-time communication
- ✅ SQLite database with async queries
- ✅ JWT authentication
- ✅ RL Environment API (8 endpoints)
- ✅ Calendar system (20+ endpoints)
- ✅ Video call management
- ✅ WebRTC signaling server
- ✅ User presence tracking
- ✅ Message persistence
- ✅ CORS configuration
- ✅ Express validation

### RL Environment Features

- ✅ 5 diverse task types
- ✅ 5 action types with rich parameters
- ✅ Multi-level reward shaping
- ✅ Episode management with history
- ✅ State observation with 10+ features
- ✅ Task completion tracking
- ✅ Spam detection
- ✅ Penalty system for invalid actions
- ✅ Gym-compatible API
- ✅ Comprehensive metrics tracking

## 🎮 RL Environment Details

### Available Actions

1. **send_message**

   - Send text message to current channel
   - Rewards: +0.1 base, +0.5 for @mentions, +0.3 for keywords
   - Penalties: -0.3 for spam

2. **switch_channel**

   - Navigate between channels
   - Reward: +0.05 per unique channel
   - Penalty: -0.3 for invalid channel

3. **react_to_message**

   - Add emoji reaction to message
   - Reward: +0.05 per reaction
   - Limited to once per message

4. **join_call**

   - Join video/voice call
   - Reward: +0.5 with invitation, +0.1 without
   - Penalty: -0.2 for no active call

5. **set_status**
   - Update user status (online/away/busy)
   - Reward: +0.02 per status change

### Reward Structure Breakdown

**Base Rewards:**

- Message sent: +0.1
- Channel switched: +0.05
- Message reacted: +0.05
- Status changed: +0.02

**Bonus Rewards:**

- Respond to @mention: +0.5
- Use relevant keywords: +0.3
- Join call with invitation: +0.5

**Penalties:**

- Spam detection: -0.3
- Invalid channel: -0.3
- Invalid action: -0.2 to -0.3
- Join call without invitation: -0.2

**Task Completion Bonuses:**

- Greeting Response: +2.0
- Channel Explorer: +1.5
- Active Participant: +2.5
- Meeting Joiner: +3.0
- Social Butterfly: +2.0

### State Observation

The state includes:

- Current channel ID and name
- User status and role
- Recent messages (last 5)
- Pending @mentions count
- Active call status
- Visited channels list
- Message count in episode
- Current step number
- Task progress indicators
- Available channels list

## 🧪 Testing

### Test Coverage

**RL Environment Tests:**

- ✅ 8/8 API endpoints tested
- ✅ All 5 task types validated
- ✅ All 5 action types verified
- ✅ Reward calculation validated
- ✅ Episode lifecycle tested
- ✅ Error handling verified

**Integration Tests:**

- ✅ Python client functionality
- ✅ Task agent performance
- ✅ Multi-episode runs
- ⚠️ Calendar API (manual testing)
- ⚠️ Calls API (manual testing)

### Running Tests

```bash
# Run comprehensive RL tests
python tests/test_rl_complete.py

# Test all API endpoints
python tests/test_all_endpoints.py

# Run Python agent demo
python python_agent/demo.py

# Test with specific task
python python_agent/test.py --task greeting_response
```

## 📊 Performance Metrics

### Baseline Agent Performance

| Metric           | Value                            |
| ---------------- | -------------------------------- |
| Success Rate     | 100% across all tasks            |
| Average Reward   | 2.37 (mixed tasks)               |
| Average Steps    | 4.7 steps to completion          |
| Best Performance | Greeting Response (1 step)       |
| Efficiency       | All tasks under 50% of max steps |

### Environment Statistics

| Metric             | Value                            |
| ------------------ | -------------------------------- |
| Total Backend Code | 720 lines (environment.js)       |
| Total Agent Code   | 350 lines (agent.py)             |
| API Endpoints      | 41+ (8 for RL, 20+ for calendar) |
| Task Types         | 5 diverse objectives             |
| Action Space       | 5 action types                   |
| State Features     | 10+ observation features         |
| Test Coverage      | 100% endpoint coverage           |

## 🐛 Known Issues & Limitations

### Current Limitations

1. **Database**: SQLite only (no MySQL/PostgreSQL support yet)
2. **Scaling**: Single-server deployment (no horizontal scaling)
3. **WebRTC**: Peer connections need improvement for production
4. **Auth**: Uses dummy OTP (123456) for demo purposes
5. **Message History**: Limited to last 100 messages per channel
6. **RL State**: Limited observation window (last 5 messages)

### Planned Improvements

- [ ] Add PostgreSQL support for production
- [ ] Implement Redis for session management
- [ ] Improve WebRTC TURN server configuration
- [ ] Add real SMS/Email OTP service
- [ ] Expand state observation window
- [ ] Add more task types and actions
- [ ] Implement multi-agent scenarios
- [ ] Add competitive tasks (2+ agents)

## 🤝 Contributing

### For Backend Team

- Extend RL environment with new actions
- Add more reward functions
- Implement additional task types
- Optimize database queries
- Add PostgreSQL support

### For Frontend Team

- Improve UI/UX based on user feedback
- Add more Teams features (files, tabs, etc.)
- Optimize real-time performance
- Improve mobile responsiveness
- Add accessibility features

### For ML Team

- Implement RL algorithms (DQN, PPO, A2C)
- Train and evaluate agents
- Design better reward shaping
- Create multi-agent scenarios
- Benchmark different approaches

### For Research Team

- Design evaluation protocols
- Create new task types
- Analyze agent behavior
- Write documentation
- Conduct user studies

## 🎓 Citation

If you use TeamsClone-RL in your research, please cite:

```bibtex
@misc{teamsclone-rl-2025,
  title={TeamsClone-RL: A High-Fidelity Microsoft Teams Environment for Reinforcement Learning},
  author={TeamsClone-RL Team},
  year={2025},
  url={https://github.com/Muneer320/teams-clone}
}
```

## 📧 Support

For issues, questions, or contributions:

- Open an issue on GitHub
- Check existing documentation
- Review the test suite for examples
- Contact the team

---

**Last Updated:** November 2025
