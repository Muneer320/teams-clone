# Teams Clone - Python RL Agent

Python client library and example agents for interacting with the Teams Clone RL environment.

## Features

- 🤖 **TeamsEnvClient** - High-level Python client for environment interaction
- 🎲 **Random Agent** - Baseline agent with random action selection
- 📏 **Rule-Based Agent** - Task-specific policies for consistent performance
- 🧠 **RL Training Support** - Compatible with Stable-Baselines3, RLlib, custom algorithms

## Quick Setup

```bash
pip install -r requirements.txt
```

**Requirements:**
- `requests` - HTTP client for API calls
- `numpy` - Numerical operations
- `matplotlib` (optional) - Visualization and plotting

## Usage

### 1. Run Demo Tools

**Interactive CLI Demo:**
```bash
python ../rl_demo/run_demo.py
```
Runs 10 episodes with rule-based agent, shows live progress and final statistics.

**Visualize Results:**
```bash
python ../rl_demo/plot_results.py
```
Generates reward curves and performance charts.

### 2. Run Rule-Based Agent

```bash
python task_agent.py
```

This agent uses task-specific policies:
- **Respond to Mentions**: React quickly to @mentions
- **Schedule Meetings**: Accept invitations, coordinate schedules
- **Manage Files**: Review and organize file uploads
- **Reply to Messages**: Engage in conversations naturally
- **Help Requests**: Prioritize urgent help requests

**Expected Performance:**
- Avg Reward: 0.10-0.15 per step
- Mention Response Rate: 95%+
- Avg Response Time: <3 steps

### 3. Train RL Agent (PPO)

Use the included Jupyter notebook:

```bash
jupyter notebook ../notebooks/RL_Train.ipynb
```

The notebook includes:
- Gym wrapper for Stable-Baselines3 compatibility
- PPO training with customizable hyperparameters
- Training progress visualization
- Model saving and evaluation

**Example Training:**
```python
from stable_baselines3 import PPO
from teams_env_wrapper import TeamsGymEnv

env = TeamsGymEnv(base_url='http://localhost:3001')
model = PPO('MlpPolicy', env, verbose=1)
model.learn(total_timesteps=50000)
model.save('teams_ppo_agent')
```

## Creating Custom Agents

### Basic Agent Structure

```python
from teams_env_client import TeamsEnvClient

class MyAgent:
    def __init__(self, base_url='http://localhost:3001'):
        self.client = TeamsEnvClient(base_url)
    
    def select_action(self, state):
        """Your agent logic here"""
        return {
            'type': 'send_message',
            'payload': {
                'channelId': state['current_channel'],
                'content': 'Hello from my agent!'
            }
        }
    
    def run_episode(self):
        state = self.client.reset()
        total_reward = 0
        done = False
        
        while not done:
            action = self.select_action(state)
            result = self.client.step(action)
            
            state = result['state']
            total_reward += result['reward']
            done = result['done']
        
        return total_reward

# Run agent
agent = MyAgent()
reward = agent.run_episode()
print(f"Episode reward: {reward:.2f}")
```

### Available Actions

```python
# 1. Send message
{'type': 'send_message', 'payload': {'channelId': 'channel-1', 'content': 'Hello!'}}

# 2. Create channel
{'type': 'create_channel', 'payload': {'name': 'New Channel', 'teamId': 'team-1'}}

# 3. Upload file
{'type': 'upload_file', 'payload': {'channelId': 'channel-1', 'fileName': 'doc.pdf', 'fileSize': 102400}}

# 4. Schedule meeting
{'type': 'schedule_meeting', 'payload': {'title': 'Team Sync', 'startTime': '2025-11-01T10:00:00Z'}}

# 5. Update status
{'type': 'update_status', 'payload': {'status': 'available'}}
```

## Key Files

```
python_agent/
├── teams_env_client.py    # Python client for environment API
├── task_agent.py          # Rule-based agent with task policies
├── requirements.txt       # Python dependencies
└── README.md             # This file

../rl_demo/
├── run_demo.py           # CLI demo tool (runs episodes)
├── plot_results.py       # Visualization tool
└── README.md

../notebooks/
└── RL_Train.ipynb        # PPO training notebook with Gym wrapper
```

## Environment API

The client interacts with 8 RL environment endpoints:

- `POST /env/reset` - Reset to initial state
- `GET /env/state` - Get current observation
- `POST /env/step` - Execute action, get reward
- `GET /env/actions` - List available actions
- `GET /env/stats` - Get episode statistics
- `GET /env/info/:episodeId` - Get episode details
- `GET /env/history` - Get all episodes
- `GET /env/tasks` - Get task descriptions

## Documentation

- **[RL Overview](../RL_OVERVIEW.md)** - Environment architecture and design
- **[Agent Design](../AGENT_DESIGN.md)** - Agent patterns and task policies
- **[RL Guide](../docs/RL_GUIDE.md)** - Complete environment guide
- **[Evaluation Guide](../docs/EVALUATION.md)** - Metrics and evaluation protocol
- **[API Reference](../API_ENDPOINTS.md)** - Complete endpoint list
