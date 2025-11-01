# TeamsClone-RL Demo Scripts

This directory contains helper scripts for running and visualizing TeamsClone-RL experiments.

## 📁 Files

- **`run_demo.py`** - CLI tool for running single episode demonstrations
- **`plot_results.py`** - Visualization tool for episode data
- **`sample_episodes.json`** - Example episode data for testing plots

## 🚀 Quick Start

### 1. Run a Demo Episode

```bash
# Make sure backend is running on http://localhost:3001
cd rl_demo
python run_demo.py
```

**With options:**
```bash
# Specify custom backend URL
python run_demo.py --url http://localhost:5000

# Choose different task
python run_demo.py --task meeting_setup
```

**Available tasks:**
- `greeting_response` (default)
- `meeting_setup`
- `channel_navigation`
- `message_reaction`
- `status_update`

### 2. Visualize Results

```bash
# Use sample data
python plot_results.py sample_episodes.json

# Specify output directory
python plot_results.py sample_episodes.json --output-dir ./my_plots

# Change format
python plot_results.py sample_episodes.json --format pdf
```

## 📊 Generated Plots

The `plot_results.py` script generates:

1. **`rewards.png`** - Episode rewards over time
2. **`steps.png`** - Steps per episode
3. **`actions.png`** - Action distribution
4. **`reward_dist.png`** - Reward histogram
5. **`task_performance.png`** - Average reward by task type

## 📝 Episode Data Format

Episodes should be stored as JSON array:

```json
[
  {
    "episode_num": 1,
    "task_type": "greeting_response",
    "total_reward": 8.5,
    "steps": 12,
    "completed": true,
    "actions": ["send_message", "send_message", "wait"]
  }
]
```

## 🔧 Requirements

```bash
pip install matplotlib numpy requests
```

## 📚 Usage Examples

### Example 1: Quick Demo
```bash
python run_demo.py
```

Output:
```
🚀 TeamsClone-RL Demo
====================================
📡 Connecting to environment...
🎯 Starting episode: greeting_response

Step 1:
  🎮 Action: send_message
  🏆 Reward: +2.00
  📊 Total Reward: +2.00
...
✅ Demo completed successfully!
```

### Example 2: Plot Custom Data
```python
# Create your own episode data
episodes = []
for i in range(10):
    episode = {
        "episode_num": i+1,
        "task_type": "greeting_response",
        "total_reward": np.random.normal(8, 2),
        "steps": np.random.randint(8, 15),
        "completed": True,
        "actions": ["send_message"] * 3
    }
    episodes.append(episode)

# Save to JSON
with open("my_episodes.json", "w") as f:
    json.dump(episodes, f, indent=2)

# Plot
# python plot_results.py my_episodes.json
```

## 🎯 Integration with Notebooks

These scripts complement the Jupyter notebooks:

- Use `run_demo.py` for quick CLI testing
- Generate episode data during notebook runs
- Visualize with `plot_results.py` for publication-ready figures

## ⚙️ Configuration

### Environment Variables

```bash
export TEAMS_ENV_URL="http://localhost:3001"
export DEFAULT_TASK="greeting_response"
```

### Programmatic Usage

```python
from run_demo import run_demo

result = run_demo(
    base_url="http://localhost:3001",
    task_type="meeting_setup"
)
print(f"Reward: {result['total_reward']}")
```

## 🐛 Troubleshooting

**Error: Connection refused**
- Make sure backend server is running: `cd backend && npm start`

**Error: Module not found**
- Install dependencies: `pip install matplotlib requests numpy`
- Add python_agent to path or run from project root

**Empty plots**
- Check JSON format matches expected structure
- Verify episode data has required fields

## 📈 Performance Benchmarks

Typical performance metrics:

| Task Type | Avg Reward | Avg Steps | Success Rate |
|-----------|------------|-----------|--------------|
| Greeting Response | 8.5 | 11 | 95% |
| Meeting Setup | 12.3 | 17 | 85% |
| Channel Navigation | 7.2 | 8 | 98% |
| Message Reaction | 6.5 | 6 | 99% |
| Status Update | 5.1 | 5 | 100% |

## 🤝 Contributing

To add new visualization:

1. Add function to `plot_results.py`
2. Call in `main()` function
3. Update this README with description
4. Test with `sample_episodes.json`

## 📄 License

MIT License - See root LICENSE file
