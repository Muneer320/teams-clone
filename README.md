# TeamsClone-RL 🤖

A realistic Microsoft Teams clone designed as a reinforcement learning environment for training AI agents on communication and collaboration tasks.

## ✨ Features

- 🎨 Full-featured Teams UI with real-time chat and video calls
- 🤖 RL Environment with 5 task types and Gym-like API
- 🔐 Authentication system with OTP verification
- 📅 Calendar and meeting scheduling (20+ endpoints)
- 🐳 Docker support for easy setup
- 🐍 Python client library with baseline agents

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
docker-compose up
```

Access at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

See [DOCKER_README.md](./DOCKER_README.md) for details.

### Manual Setup

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev

# Python Agent (optional)
cd python_agent && pip install requests && python demo.py
```

## 🎮 RL Environment

### Quick Example

```python
from client import TeamsEnvClient

client = TeamsEnvClient()
result = client.reset(task_type='greeting_response')

# Send a message
action = {'type': 'send_message', 'payload': {'content': 'Hello!'}}
result = client.step(action, result['episodeId'])
print(f"Reward: {result['reward']}, Done: {result['done']}")
```

### 5 Task Types

1. **Greeting Response** - Reply to greetings (10 steps, +2.0 reward)
2. **Channel Explorer** - Visit 3+ channels (20 steps, +1.5 reward)
3. **Active Participant** - Send 5+ messages (30 steps, +2.5 reward)
4. **Meeting Joiner** - Join when invited (15 steps, +3.0 reward)
5. **Social Butterfly** - React & message (25 steps, +2.0 reward)

### Key Endpoints

- `POST /env/reset` - Start new episode
- `POST /env/step` - Execute action
- `GET /env/state` - Get observation
- `GET /env/tasks` - List all tasks

See [RL_GUIDE.md](./docs/RL_GUIDE.md) for complete API details and reward structure.

## 🛠️ Tech Stack

**Frontend:** React + Vite + TailwindCSS + Socket.IO + WebRTC  
**Backend:** Node.js + Express + Socket.IO + SQLite  
**RL Agent:** Python + Stable-Baselines3

See [DETAILS.md](./DETAILS.md) for complete tech stack and project structure.

## 📚 Documentation

- **[Quick Start](./QUICKSTART.md)** - 5-minute setup guide
- **[RL Guide](./docs/RL_GUIDE.md)** - Complete RL environment guide
- **[API Reference](./API_ENDPOINTS.md)** - All 41 endpoints
- **[Docker Setup](./DOCKER_README.md)** - Docker instructions
- **[Python Agent](./python_agent/README.md)** - Client library guide
- **[Details](./DETAILS.md)** - Architecture, structure, metrics

## 📝 License

MIT License - Built for educational and research purposes.

---

**🚀 Built with ❤️ for AI research**
