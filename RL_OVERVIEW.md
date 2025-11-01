# TeamsClone-RL System Overview

## 🎯 High-Level Architecture

The TeamsClone-RL system creates a closed-loop reinforcement learning environment where Python agents can interact with a simulated Microsoft Teams environment through REST APIs and Socket.IO.

```
┌──────────────┐         HTTP/REST          ┌──────────────┐
│              │   ────────────────────→    │              │
│  Python RL   │                            │   Backend    │
│    Agent     │   ←────────────────────    │   Server     │
│              │      JSON Responses        │  (Node.js)   │
└──────────────┘                            └──────────────┘
       ↑                                            │
       │                                            │
       │        /env/state, /env/actions            │
       │                                            │
       │                                            ↓
       │                                     Socket.IO Events
       │                                            │
       │                                            ↓
       └────────  Observation Loop  ────────   ┌──────────────┐
                                               │   Frontend   │
                                               │  (React UI)  │
                                               │  Visualizer  │
                                               └──────────────┘
```

## 🔄 Interaction Flow

### 1. **Episode Initialization**
```
Agent → POST /env/reset → Backend
                          Backend creates new episode
                          Backend returns episode_id, initial state
```

### 2. **Action Execution Loop**
```
Agent → GET /env/state → Backend returns current state
Agent processes state
Agent selects action
Agent → POST /env/step → Backend executes action
                          Backend computes reward
                          Backend updates state
                          Backend emits Socket.IO event
                          Frontend updates UI
                          Backend returns (state, reward, done, info)
```

### 3. **Episode Termination**
```
When done = true:
  Agent logs episode metrics
  Agent → POST /env/reset (optional, for next episode)
```

## 📡 Communication Protocols

### REST API Endpoints

| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| `/env/reset` | POST | Start new episode | `{task_type, user_id}` | `{episode_id, state, task_description}` |
| `/env/state` | GET | Query current state | Query params | `{state, episode_id, step_count}` |
| `/env/step` | POST | Execute action | `{action: {type, ...}}` | `{state, reward, done, info}` |
| `/env/actions` | GET | List valid actions | None | `{action_types: [...]}` |
| `/env/stats` | GET | Get episode stats | Query params | `{total_episodes, avg_reward, ...}` |

### Socket.IO Events (Real-time)

| Event | Direction | Purpose |
|-------|-----------|---------|
| `env:state-update` | Backend → Frontend | Broadcast state changes |
| `env:episode-start` | Backend → Frontend | Notify new episode |
| `env:episode-end` | Backend → Frontend | Notify episode completion |
| `message:new` | Backend → Frontend | New message in chat |
| `presence:update` | Backend → Frontend | User status change |

## 🧠 State Representation

The environment state includes:

```json
{
  "stepCount": 5,
  "currentChannel": "general",
  "userPresence": "available",
  "messages": [
    {
      "id": "msg-1",
      "content": "Hello!",
      "timestamp": "2025-11-02T01:30:00Z",
      "sender": "user-2"
    }
  ],
  "unreadCount": 2,
  "activeCall": null,
  "taskContext": {
    "type": "greeting_response",
    "target": "Respond to greeting",
    "progress": 0.6
  }
}
```

## 🎮 Action Space

Available actions:

1. **send_message** - Send text to current channel
2. **switch_channel** - Navigate to different channel
3. **react_to_message** - Add emoji reaction
4. **join_call** - Join or start a call
5. **set_status** - Change presence status
6. **schedule_meeting** - Create calendar event
7. **search_messages** - Query message history

## 🏆 Reward Structure

### Positive Rewards
- **Task completion**: +10.0
- **Appropriate message**: +2.0
- **Timely response**: +1.5
- **Helpful reaction**: +0.5

### Negative Rewards
- **Off-topic message**: -1.0
- **Ignored message**: -0.5
- **Timeout**: -2.0

### Time Penalty
- Each step: -0.1 (encourages efficiency)

## 🔧 Components

### Backend (Node.js + Express + Socket.IO)
- Manages episode lifecycle
- Computes rewards
- Maintains environment state
- Broadcasts updates to frontend

### Frontend (React + Vite + TailwindCSS)
- Visualizes agent actions in real-time
- Displays messages, presence, calls
- Shows task progress
- Provides developer debugging UI

### Python Agent (TeamsEnvClient + TaskAgent)
- Connects to backend via REST
- Processes observations
- Selects actions using policy
- Logs metrics for analysis

## 🚀 Getting Started

### Start Backend
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3001
```

### Start Frontend (optional, for visualization)
```bash
cd frontend
npm install
npm run dev
# UI available on http://localhost:5173
```

### Run Agent
```python
from python_agent.client import TeamsEnvClient
from python_agent.agent import TaskAgent

client = TeamsEnvClient("http://localhost:3001")
agent = TaskAgent()

episode = client.reset(task_type="greeting_response")
done = False

while not done:
    state = client.get_state()["state"]
    action = agent.select_action(state)
    result = client.step(action)
    done = result["done"]
```

## 📊 Metrics and Evaluation

The system tracks:
- **Episode rewards** (cumulative)
- **Step counts** (episode length)
- **Task completion rate**
- **Action distribution**
- **Average reward per task type**

## 🎓 Use Cases

1. **RL Algorithm Testing** - Benchmark PPO, DQN, A2C on collaboration tasks
2. **Agent Evaluation** - Compare rule-based vs. learned policies
3. **Task Design** - Create custom tasks with reward shaping
4. **Multi-agent Learning** - Multiple agents in same environment
5. **Human-AI Interaction** - Mixed human-agent episodes

## 🔮 Future Enhancements

- **LSTM/Transformer agents** for context awareness
- **Multi-task curriculum learning**
- **Continuous action spaces** for message generation
- **Adversarial agents** for robustness testing
- **Real-time human feedback** integration
