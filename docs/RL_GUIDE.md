# RL Environment System - Complete Guide

## 🎯 Overview

The TeamsClone-RL environment provides a **Gym-like API** for training reinforcement learning agents to interact with a Microsoft Teams-like interface. The environment features:

- **5 task types** with clear objectives and completion criteria
- **5 action types** for interacting with the environment
- **Sophisticated reward shaping** for effective learning
- **Multi-episode support** with history tracking
- **Rich state representation** with full observability
- **Python client library** for easy integration

## 📋 Quick Start

### 1. Start the Backend

```bash
cd backend
npm start
```

The server will start on `http://localhost:3001`

### 2. Test the Environment

```bash
cd python_agent
python test.py
```

This runs a quick test suite to verify everything is working.

### 3. Run the Agent

```bash
python agent.py
```

Watch the agent complete different tasks with task-specific policies!

## 🎮 Task Types

### 1. Greeting Response

**Objective**: Respond to a greeting message within 5 steps  
**Max Steps**: 10  
**Reward**: +2.0  
**Strategy**: Detect greetings ("hello", "hi", "welcome") and respond appropriately

### 2. Channel Explorer

**Objective**: Visit at least 3 different channels  
**Max Steps**: 20  
**Reward**: +1.5  
**Strategy**: Systematically switch between channels

### 3. Active Participant

**Objective**: Send at least 5 relevant messages  
**Max Steps**: 30  
**Reward**: +2.5  
**Strategy**: Send diverse, contextually appropriate messages

### 4. Meeting Joiner

**Objective**: Join a call when invited  
**Max Steps**: 15  
**Reward**: +3.0  
**Strategy**: Detect @mentions with "call"/"meeting" and join

### 5. Social Butterfly

**Objective**: React to 3 messages AND send 3 messages  
**Max Steps**: 25  
**Reward**: +2.0  
**Strategy**: Balance between reacting and messaging

## 🎬 Action Space

### 1. Send Message

```python
{
    'type': 'send_message',
    'payload': {
        'content': 'Hello team!',
        'channelId': 'channel-1'  # optional
    }
}
```

**Rewards**:

- Base: +0.1
- Responding to @mention: +0.5
- Relevant keywords: +0.3
- Spam/duplicate: -0.3

### 2. Switch Channel

```python
{
    'type': 'switch_channel',
    'payload': {
        'channelId': 'channel-2'
    }
}
```

**Rewards**:

- Success: +0.05
- Invalid channel: -0.3
- Already there: -0.1

### 3. React to Message

```python
{
    'type': 'react_to_message',
    'payload': {
        'messageId': 'msg-uuid',
        'reaction': '👍'
    }
}
```

**Rewards**:

- Success: +0.05
- Invalid message: -0.2

### 4. Join Call

```python
{
    'type': 'join_call',
    'payload': {
        'channelId': 'channel-1'  # optional
    }
}
```

**Rewards**:

- With invitation: +0.5
- Without invitation: +0.1

### 5. Set Status

```python
{
    'type': 'set_status',
    'payload': {
        'status': 'available'  # available, busy, away, dnd
    }
}
```

**Rewards**: +0.02

## 📊 Observation Space

The environment returns a rich observation dictionary:

```python
{
    'episodeId': 'uuid',
    'agentState': {
        'currentTeamId': 'team-1',
        'currentChannelId': 'channel-1',
        'userId': 'agent'
    },
    'currentChannel': {
        'id': 'channel-1',
        'name': 'General',
        'teamId': 'team-1',
        'unread': 0
    },
    'recentMessages': [
        {
            'id': 'msg-uuid',
            'channelId': 'channel-1',
            'userId': 'user-1',
            'content': 'Hello!',
            'timestamp': 1730000000000,
            'reactions': []
        }
    ],
    'teams': [...],  # All teams and channels
    'users': [...],  # All users
    'stats': {
        'stepCount': 5,
        'totalReward': 2.3,
        'messagesSent': 2,
        'channelsSwitched': 1,
        'reactionsGiven': 0,
        'callsJoined': 0,
        'invalidActions': 0,
        'taskCompleted': False
    },
    'task': {
        'type': 'greeting_response',
        'name': 'Greeting Response',
        'description': 'Respond to a greeting...',
        'maxSteps': 10,
        'completed': False
    },
    'timestamp': 1730000000000
}
```

## 🔌 API Endpoints

### Core RL API

**POST /env/reset**
Start a new episode

```json
{
  "episodeId": "optional-custom-id",
  "taskType": "greeting_response" // optional, random if omitted
}
```

**GET /env/state**
Get current observation

**POST /env/step**
Execute an action

```json
{
  "action": {
    "type": "send_message",
    "payload": { "content": "Hello!" }
  },
  "episodeId": "optional-episode-id"
}
```

Returns: `{state, reward, done, info}`

**GET /env/actions**
Get available actions with examples

**GET /env/stats**
Get current episode statistics

### Management API

**GET /env/info/:episodeId**
Get detailed episode information

**GET /env/history?limit=10**
Get completed episode history

**GET /env/tasks**
Get all task definitions

## 🐍 Python Client Usage

### Basic Usage

```python
from client import TeamsEnvClient

client = TeamsEnvClient()

# Start episode
result = client.reset(task_type='greeting_response')
episode_id = result['episodeId']
state = result['state']

# RL loop
done = False
total_reward = 0

while not done:
    # Your policy here
    action = select_action(state)

    # Execute action
    result = client.step(action, episode_id)

    state = result['state']
    reward = result['reward']
    done = result['done']
    info = result['info']

    total_reward += reward

    if info.get('taskCompleted'):
        print(f"Task completed! Bonus: +{info['taskReward']}")

print(f"Episode finished. Total reward: {total_reward}")
```

### Using the Task Agent

```python
from agent import TaskAgent
from client import TeamsEnvClient

client = TeamsEnvClient()
agent = TaskAgent(client)

# Run single episode
result = agent.run_episode(
    task_type='active_participant',
    verbose=True
)

print(f"Completed: {result['completed']}")
print(f"Total reward: {result['total_reward']}")
```

### Multi-Episode Training

```python
from agent import train_multiple_episodes

# Train on random tasks
train_multiple_episodes(num_episodes=10)

# Practice specific task
train_multiple_episodes(
    num_episodes=5,
    task_type='channel_explorer'
)
```

## 💡 Tips for Training Agents

### 1. Start with Task-Specific Policies

- Study the provided `TaskAgent` class
- Understand what each task requires
- Build rule-based policies first as baselines

### 2. Reward Shaping is Key

- Base rewards are small (+0.1)
- Task completion bonuses are large (+1.5 to +3.0)
- Learn to detect and respond to mentions (+0.5 bonus)
- Avoid spam (penalties up to -0.3)

### 3. State Representation

- `recentMessages` contains last 10 messages
- Check `task.type` to understand current objective
- Monitor `stats` to track progress toward goal
- Use `currentChannel` to know your location

### 4. Episode Termination

Episodes end when:

- Task completed (✓ success)
- Max steps reached (timeout)
- Too many invalid actions (5+ invalid)

### 5. Multi-Task Learning

- Train on multiple tasks for better generalization
- Use curriculum learning (easy → hard tasks)
- Track performance across different task types

## 📈 Evaluation Metrics

### Per-Episode Metrics

- **Success rate**: % of episodes with task completed
- **Average reward**: Mean total reward per episode
- **Average steps**: Mean steps to completion
- **Invalid action rate**: % of invalid actions

### Across-Task Metrics

- **Multi-task success**: Success rate across all tasks
- **Transfer learning**: Performance on unseen tasks
- **Sample efficiency**: Episodes needed to reach threshold

### Example Evaluation

```python
from client import TeamsEnvClient

client = TeamsEnvClient()

# Get history
history = client.get_history(limit=100)

# Calculate metrics
total = len(history)
completed = sum(1 for h in history if h['completed'])
avg_reward = sum(h['totalReward'] for h in history) / total
avg_steps = sum(h['steps'] for h in history) / total

print(f"Success rate: {completed/total*100:.1f}%")
print(f"Average reward: {avg_reward:.2f}")
print(f"Average steps: {avg_steps:.1f}")
```

## 🔬 Research Ideas

### 1. Reinforcement Learning Algorithms

- DQN with experience replay
- PPO for continuous improvement
- A3C for parallel training
- Soft Actor-Critic (SAC)

### 2. Multi-Task Learning

- Single policy for all tasks
- Task embedding networks
- Meta-learning approaches
- Transfer learning experiments

### 3. Curriculum Learning

- Progressive task difficulty
- Adaptive task selection
- Automatic curriculum generation

### 4. Imitation Learning

- Behavioral cloning from rule-based agent
- Inverse RL from demonstrations
- GAIL for policy learning

### 5. Exploration Strategies

- Curiosity-driven exploration
- Intrinsic motivation
- Count-based exploration

## 🛠️ Advanced Customization

### Creating Custom Tasks

Add to `environment.js` `initializeTaskDefinitions()`:

```javascript
my_custom_task: {
    name: "Custom Task Name",
    description: "Task description",
    checkCompletion: (episode) => {
        // Return true when task is complete
        return episode.stats.someMetric >= threshold;
    },
    reward: 2.5,
    maxSteps: 20,
}
```

### Custom Reward Functions

Modify action methods in `environment.js`:

```javascript
actionSendMessage(episode, payload) {
    // Your custom reward logic
    let reward = baseReward;

    if (meetsCustomCriteria) {
        reward += bonusReward;
    }

    return reward;
}
```

### Adding New Actions

1. Add action handler to `environment.js` `step()` method
2. Implement action method (e.g., `actionNewAction()`)
3. Update `getAvailableActions()` with new action spec
4. Document in this README

## 📚 Additional Resources

- **Backend Code**: `backend/src/models/environment.js`
- **API Routes**: `backend/src/routes/env.js`
- **Python Client**: `python_agent/client.py`
- **Agent**: `python_agent/agent.py`
- **Test Script**: `python_agent/test.py`
- **Demo**: `python_agent/demo.py`

## 🐛 Troubleshooting

### Backend won't start

```bash
cd backend
npm install
npm start
```

### Python client errors

```bash
cd python_agent
pip install requests
```

### Connection refused

- Ensure backend is running on port 3001
- Check firewall settings
- Verify URL in client: `http://localhost:3001`

### Episode not found

- Episode IDs are temporary (in-memory)
- Server restart clears all episodes
- Use the returned episode_id from reset()

## 🤝 Contributing

To add features or fix bugs:

1. Modify `environment.js` for core logic
2. Update `env.js` routes if adding endpoints
3. Extend `client.py` for new functionality
4. Update this guide with examples
5. Test with `test.py`

## 📝 License

Part of TeamsClone-RL hackathon project.

---

**Happy Training! 🚀**

For questions or issues, refer to the main project documentation.
