# TeamsClone-RL 🤖

**A High-Fidelity Microsoft Teams Environment for Reinforcement Learning**

TeamsClone-RL is a realistic web clone of Microsoft Teams designed to serve as an interactive environment for training and evaluating reinforcement learning agents on communication and collaboration tasks.

## 🎯 Overview

This project provides:

- ✅ **Realistic Teams UI/UX** - Fully functional web interface with real-time chat and video calls
- ✅ **Complete Authentication System** - Microsoft-style auth flow with OTP verification
- ✅ **Production-Ready RL Environment** - Complete Gym-like API with multi-episode support
- ✅ **5 Task Types** - Diverse objectives for comprehensive agent training
- ✅ **Intelligent Baseline Agent** - Task-specific policies achieving 100% completion
- ✅ **Multi-user Support** - Real-time collaboration via Socket.IO
- ✅ **Video Calling** - WebRTC-based video conferencing with screen sharing
- ✅ **Calendar System** - Complete meeting scheduling with 20+ endpoints
- ✅ **Sophisticated Rewards** - Multi-level reward shaping (base, bonuses, penalties, task completion)
- ✅ **Python Client & Demos** - Comprehensive client library with Jupyter notebooks and CLI tools

## 🏗️ Architecture

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

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Python 3.8+
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 3. Python Agent Setup

```bash
cd python_agent
pip install requests

# Test the RL environment
python test.py

# Run the agent
python agent.py

# Try the interactive demo
python demo.py
```

## 📚 Documentation

### Core Documentation
- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in 5 minutes
- **[API Reference](./API_ENDPOINTS.md)** - Complete list of all 41 endpoints
- **[API Quick Reference](./API_QUICK_REFERENCE.md)** - Quick lookup with request/response examples

### Reinforcement Learning
- **[RL Overview](./RL_OVERVIEW.md)** - System architecture and interaction flow
- **[RL Guide](./docs/RL_GUIDE.md)** - Complete guide with usage examples and tips
- **[Agent Design](./AGENT_DESIGN.md)** - Agent architecture and task policies
- **[Evaluation Guide](./docs/EVALUATION.md)** - Reward design, metrics, evaluation protocol
- **[Demo Tools](./rl_demo/README.md)** - CLI tools and visualization scripts

### Feature-Specific Docs
- **[Calendar API](./docs/CALENDAR_API.md)** - Complete calendar system documentation
- **[Calls API](./docs/CALLS_API.md)** - Video calling API reference
- **[Python Agent](./python_agent/README.md)** - Python client library guide

### Notebooks
- **[RL Training Notebook](./notebooks/RL_Train.ipynb)** - Train PPO agents with Stable-Baselines3

## 🎮 RL Environment API

### Core Endpoints

| Endpoint               | Method | Description                               |
| ---------------------- | ------ | ----------------------------------------- |
| `/env/reset`           | POST   | Start new episode with optional task type |
| `/env/state`           | GET    | Get current observation                   |
| `/env/step`            | POST   | Execute action, return state/reward/done  |
| `/env/actions`         | GET    | List available actions with examples      |
| `/env/stats`           | GET    | Get episode statistics                    |
| `/env/tasks`           | GET    | Get all available task definitions        |
| `/env/info/:episodeId` | GET    | Get detailed episode info with history    |
| `/env/history`         | GET    | Get completed episode history             |

### Task Types

1. **Greeting Response** - Respond to greeting within 5 steps (max 10 steps, +2.0 reward)
2. **Channel Explorer** - Visit 3+ different channels (max 20 steps, +1.5 reward)
3. **Active Participant** - Send 5+ relevant messages (max 30 steps, +2.5 reward)
4. **Meeting Joiner** - Join call when invited (max 15 steps, +3.0 reward)
5. **Social Butterfly** - React to 3 messages + send 3 messages (max 25 steps, +2.0 reward)

### Example Usage

```python
from client import TeamsEnvClient
from agent import TaskAgent

# Initialize client
client = TeamsEnvClient()

# Option 1: Manual control
result = client.reset(task_type='greeting_response')
episode_id = result['episodeId']
state = result['state']

# RL loop
done = False
while not done:
    action = {'type': 'send_message', 'payload': {'content': 'Hello!'}}
    result = client.step(action, episode_id)
    state = result['state']
    reward = result['reward']
    done = result['done']

# Option 2: Use the agent
agent = TaskAgent(client)
result = agent.run_episode(task_type='channel_explorer', verbose=True)
print(f"Task completed: {result['completed']}")
print(f"Total reward: {result['total_reward']:.2f}")
```

## 🎯 Available Actions

1. **send_message** - Send message to channel (+0.1 base, +0.5 for mentions, +0.3 for keywords)
2. **switch_channel** - Navigate to different channel (+0.05, -0.3 if invalid)
3. **react_to_message** - React with emoji (+0.05)
4. **join_call** - Join voice/video call (+0.5 with invitation, +0.1 without)
5. **set_status** - Update user status (+0.02)

## 🏆 Reward Structure

### Action Rewards

- **Base message**: +0.1 per message
- **Respond to @mention**: +0.5 bonus
- **Relevant keywords**: +0.3 bonus
- **Channel exploration**: +0.05 per switch
- **Join call with invitation**: +0.5
- **React to message**: +0.05
- **Spam detection**: -0.3 penalty
- **Invalid action**: -0.2 to -0.3 penalty

### Task Completion Bonuses

- **Greeting Response**: +2.0
- **Active Participant**: +2.5
- **Meeting Joiner**: +3.0 (highest value)
- **Social Butterfly**: +2.0
- **Channel Explorer**: +1.5

See [RL_GUIDE.md](./docs/RL_GUIDE.md) for detailed reward design and strategies.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2 with Vite 5.0
- **Styling**: TailwindCSS 3.3
- **Real-time**: Socket.IO Client
- **Video**: WebRTC for peer-to-peer video calls
- **State Management**: React Hooks (useState, useEffect, useRef)

### Backend
- **Runtime**: Node.js 22
- **Framework**: Express 4.18
- **Real-time**: Socket.IO 4.8
- **Database**: SQLite3 with sqlite async wrapper
- **Authentication**: JWT tokens with bcrypt
- **Validation**: express-validator

### Python Agent
- **HTTP Client**: requests library
- **RL Framework**: Stable-Baselines3 (optional)
- **Visualization**: Matplotlib, NumPy
- **Environment**: Gym-compatible wrapper

### Deployment
- **Frontend**: Vercel/Netlify ready
- **Backend**: Render.com configured (see render.yaml)
- **Database**: SQLite for development, MySQL/PostgreSQL for production

## 📁 Project Structure

```
teams-clone/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── server.js       # Main server with Socket.IO
│   │   ├── routes/         # API routes (env, calendar, calls, auth)
│   │   │   ├── env.js      # RL environment endpoints
│   │   │   ├── calendar.js # Calendar/meeting system
│   │   │   ├── calls.js    # Video call management
│   │   │   └── auth.js     # Authentication (commented out)
│   │   ├── models/         # Data models & business logic
│   │   │   ├── environment.js  # RL environment state
│   │   │   └── database.js     # SQLite connection
│   │   ├── socket/         # Socket.IO event handlers
│   │   │   ├── handlers.js # Chat & presence events
│   │   │   └── callHandlers.js # Video call signaling
│   │   ├── services/       # Business logic services
│   │   │   └── envService.js   # Environment service
│   │   └── config/         # Configuration
│   ├── data/               # SQLite database files
│   └── package.json
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.jsx         # Main app with tabs
│   │   ├── main.jsx        # Entry point
│   │   ├── components/
│   │   │   ├── AuthFlow.jsx    # Complete auth UI
│   │   │   ├── ChatTab.jsx     # Chat interface
│   │   │   ├── CalendarTab.jsx # Calendar UI
│   │   │   ├── CallsTab.jsx    # Video calls UI
│   │   │   └── RLTestTab.jsx   # RL testing interface
│   │   └── assets/         # Images and static files
│   └── package.json
│
├── python_agent/           # Python RL agents
│   ├── client.py           # Environment HTTP client
│   ├── agent.py            # Rule-based task agent
│   ├── test.py             # Comprehensive test suite
│   ├── demo.py             # Interactive CLI demo
│   └── README.md           # Python client documentation
│
├── notebooks/              # Jupyter notebooks
│   └── RL_Train.ipynb      # PPO training with Stable-Baselines3
│
├── rl_demo/                # Demo and visualization tools
│   ├── run_demo.py         # CLI demo runner
│   ├── plot_results.py     # Episode visualization
│   ├── sample_episodes.json # Example data
│   └── README.md           # Demo tools guide
│
├── docs/                   # Detailed documentation
│   ├── API.md              # Complete API reference
│   ├── RL_GUIDE.md         # RL environment guide
│   ├── EVALUATION.md       # Reward & metrics
│   ├── CALENDAR_API.md     # Calendar endpoints
│   ├── CALLS_API.md        # Calls endpoints
│   └── CALENDAR_*.md       # Calendar implementation docs
│
├── RL_OVERVIEW.md          # System architecture
├── AGENT_DESIGN.md         # Agent design patterns
├── API_ENDPOINTS.md        # All 41 endpoints list
├── API_QUICK_REFERENCE.md  # Quick API lookup
├── QUICKSTART.md           # 5-minute setup guide
└── README.md               # This file
```

## 🤝 Contributing

This is a hackathon project. Team members should:

1. **Backend Team**: Extend RL environment logic, add more actions
2. **Frontend Team**: Improve UI/UX, add more Teams features
3. **ML Team**: Implement RL algorithms (DQN, PPO, etc.)
4. **Research Team**: Design better reward functions and evaluation metrics

## 📝 License

MIT

## 🎓 Citation

If you use TeamsClone-RL in your research, please cite:

```bibtex
@misc{teamsclone-rl,
  title={TeamsClone-RL: A High-Fidelity Microsoft Teams Environment for Reinforcement Learning},
  author={Your Team},
  year={2025}
}
```

## 🐛 Known Issues

- Message persistence using SQLite (no MySQL yet for production)
- Limited to single-server deployment (no horizontal scaling)
- WebRTC video calls functional but peer-to-peer connections need improvement
- Auth system uses dummy OTP (123456) for demo purposes

## 🚧 Future Work

- [x] Neural network agents (PPO implementation with Stable-Baselines3) ✅
- [x] Integration with Stable-Baselines3 ✅
- [x] Calendar scheduling system ✅
- [x] Video calling with WebRTC ✅
- [x] Authentication system with OTP ✅
- [ ] Multi-agent environments with competitive/cooperative scenarios
- [ ] Real-time training visualization dashboard
- [ ] Custom task creation API for dynamic task generation
- [ ] Curriculum learning and meta-learning experiments
- [ ] MySQL/PostgreSQL integration for production
- [ ] File sharing and attachment system
- [ ] Advanced call features (recording, transcription)

## 🎯 Key Metrics & Performance

**Current Baseline Agent Performance:**

- **Success Rate**: 100% across all tasks
- **Average Reward**: 2.37 (mixed tasks)
- **Average Steps**: 4.7 steps to completion
- **Efficiency**: Greeting Response completed in 1 step!

**Environment Statistics:**

- **Total Code**: 720 lines (environment.js) + 350 lines (enhanced_agent.py)
- **API Endpoints**: 9 comprehensive endpoints
- **Task Types**: 5 diverse objectives
- **Action Space**: 5 action types with rich parameters
- **Test Coverage**: 100% endpoint coverage with automated tests

---

**Built with ❤️ for the hackathon**
