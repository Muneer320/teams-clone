# Quick Start Guide - TeamsClone-RL

## For Your Team Members

### 🚀 Getting Started (5 minutes)

1. **Clone the repository**

```bash
git clone https://github.com/Muneer320/teams-clone.git
cd teams-clone
```

2. **Install root dependencies**

```bash
npm install
```

3. **Choose your path:**

---

## 🔧 Backend Developer

**Setup:**

```bash
cd backend
npm install
```

**Required dependencies will install automatically:**

- express, socket.io, sqlite3, sqlite, bcryptjs, jsonwebtoken, etc.

**Run development server:**

```bash
npm start
# or for auto-reload during development:
npm run dev
```

Server runs on: `http://localhost:3001`

**Test it works:**

```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":...}
```

**Database Setup:**

SQLite database is auto-created in `backend/data/teams_clone.db` on first run. No manual setup needed!

**Your tasks:**

- [ ] Extend environment actions in `src/services/envService.js`
- [ ] Add more task types to the RL environment
- [ ] Enhance reward logic for better agent training
- [ ] Switch to MySQL/PostgreSQL for production (optional)
- [ ] Add more Socket.IO events for real-time features
- [ ] Implement file upload/attachment system

**Key files:**

- `src/server.js` - Main server with all routes
- `src/routes/env.js` - RL API endpoints (9 endpoints)
- `src/routes/calendar.js` - Calendar API (20 endpoints)
- `src/routes/calls.js` - Video call API (13 endpoints)
- `src/services/envService.js` - Environment business logic
- `src/models/database.js` - SQLite connection
- `src/socket/handlers.js` - Chat & presence events
- `src/socket/callHandlers.js` - Video call signaling

---

## 🎨 Frontend Developer

**Setup:**

```bash
cd frontend
npm install
```

**Run development server:**

```bash
npm run dev
```

App runs on: `http://localhost:5173`

**Current Features:**

- ✅ Microsoft-style authentication UI with OTP
- ✅ Multi-tab interface (Chat, Calendar, Calls, RL Test)
- ✅ Real-time chat with Socket.IO
- ✅ WebRTC video calling
- ✅ Calendar/meeting interface
- ✅ User selector for testing

**Key files:**

- `src/App.jsx` - Main app with tab navigation
- `src/components/AuthFlow.jsx` - Complete auth flow (sign in, register, OTP)
- `src/components/ChatTab.jsx` - Chat interface
- `src/components/CallsTab.jsx` - Video calls with WebRTC
- `src/components/CalendarTab.jsx` - Calendar UI
- `src/components/RLTestTab.jsx` - RL environment testing interface
- `tailwind.config.js` - Styling configuration

---

## 🤖 ML/RL Developer

**Setup:**

```bash
cd python_agent
pip install requests matplotlib numpy
# Optional for training:
pip install stable-baselines3 gym
```

**Test the environment:**

```bash
python test.py
```

**Run the rule-based agent:**

```bash
python agent.py
```

**Try the interactive demo:**

```bash
python demo.py
```

**Quick CLI demo:**

```bash
cd ../rl_demo
python run_demo.py --task greeting_response
```

**Train a PPO agent (Jupyter Notebook):**

Open `notebooks/RL_Train.ipynb` in Jupyter Lab or VS Code

**Your tasks:**

- [ ] Tune PPO hyperparameters for better performance
- [ ] Try different RL algorithms (DQN, A2C, SAC)
- [ ] Implement LSTM policy for context awareness
- [ ] Add state encoding with BERT for message understanding
- [ ] Create curriculum learning pipeline
- [ ] Implement multi-agent competitive scenarios
- [ ] Add custom reward shaping experiments
- [ ] Create real-time training dashboard

**Key files:**

- `client.py` - Environment HTTP client with all endpoints
- `agent.py` - Rule-based agent with task-specific policies
- `test.py` - Comprehensive test suite (40+ tests)
- `demo.py` - Interactive CLI demo
- `../rl_demo/run_demo.py` - Quick episode runner
- `../rl_demo/plot_results.py` - Visualization tool
- `../notebooks/RL_Train.ipynb` - PPO training notebook

**Suggested libraries:**

- **Stable-Baselines3** (PPO, DQN, A2C, SAC)
- **RLlib** (advanced distributed RL)
- **PyTorch / TensorFlow** (custom networks)
- **Transformers** (BERT for message embeddings)
- **Weights & Biases** (experiment tracking)

---

## 📚 Research/Documentation Team

**Your tasks:**

- [ ] Improve reward function design
- [ ] Create evaluation metrics
- [ ] Write experiment protocols
- [ ] Document findings
- [ ] Create visualizations
- [ ] Prepare presentation

**Key files:**

- `docs/ENV_SPEC.md` - Environment details
- `docs/EVALUATION.md` - Evaluation guide
- `docs/API.md` - API reference

---

## 🏃 Running Everything Together

**Option 1: Use root scripts (recommended)**

```bash
# From project root
npm run dev
```

This runs both frontend and backend simultaneously.

**Option 2: Separate terminals**

Terminal 1 - Backend:

```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

Terminal 3 - Python Agent:

```bash
cd python_agent
python agents/random_agent.py
```

---

## 📋 Development Workflow

1. **Pull latest changes**

```bash
git pull origin main
```

2. **Create feature branch**

```bash
git checkout -b feature/your-feature
```

3. **Make changes and test**

4. **Commit**

```bash
git add .
git commit -m "feat: describe your change"
```

5. **Push**

```bash
git push origin feature/your-feature
```

6. **Create Pull Request on GitHub**

---

## 🧪 Testing Your Work

### Backend

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test reset
curl -X POST http://localhost:3001/env/reset

# Test state
curl http://localhost:3001/env/state

# Test step
curl -X POST http://localhost:3001/env/step \
  -H "Content-Type: application/json" \
  -d '{"action":{"type":"send_message","payload":{"content":"Hello!"}}}'
```

### Frontend

- Open `http://localhost:5173`
- Try sending messages
- Switch channels
- Check console for errors

### Python Agent

```bash
cd python_agent
python agents/random_agent.py
```

---

## 🐛 Common Issues

### Backend won't start

- Check if port 3001 is available
- Run `npm install` in backend folder
- Check Node.js version (need 16+)

### Frontend won't start

- Check if port 5173 is available
- Run `npm install` in frontend folder
- Delete `node_modules` and reinstall if needed

### Python agent can't connect

- Make sure backend is running first
- Check URL in `rl_client.py` (default: `http://localhost:3001`)
- Verify backend is accessible: `curl http://localhost:3001/health`

### CORS errors

- Backend has CORS enabled for `http://localhost:5173`
- If using different port, update `backend/src/config/config.js`

---

## 📁 Project Structure

```
teams-clone/
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── server.js    # Main server
│   │   ├── routes/      # API endpoints
│   │   ├── models/      # Environment logic
│   │   ├── socket/      # Socket.IO handlers
│   │   └── config/      # Configuration
│   └── package.json
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── App.jsx     # Main component
│   │   └── components/ # UI components
│   └── package.json
│
├── python_agent/        # Python RL agents
│   ├── rl_client.py    # Environment client
│   ├── agents/         # Agent implementations
│   └── requirements.txt
│
├── docs/               # Documentation
│   ├── ENV_SPEC.md    # Environment spec
│   ├── EVALUATION.md  # Evaluation guide
│   └── API.md         # API reference
│
└── package.json        # Root scripts
```

---

## 🎯 Hackathon Tips

1. **Communication**: Use team chat frequently
2. **Small commits**: Commit often with clear messages
3. **Pull regularly**: Pull latest changes before starting work
4. **Ask questions**: Don't hesitate to ask teammates
5. **Document**: Add comments for complex code
6. **Test**: Test your changes before pushing

---

## 📞 Need Help?

- Check the main README.md
- Read docs in `docs/` folder
- Ask in team chat
- Create an issue on GitHub

---

## ✅ Quick Checklist

Before pushing:

- [ ] Code runs without errors
- [ ] Tested changes locally
- [ ] Added comments for complex logic
- [ ] Followed code style guidelines
- [ ] Updated documentation if needed

---

**Good luck with the hackathon! 🚀**
