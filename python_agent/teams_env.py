"""Gymnasium adapter for the HTTP task simulator, with observable state."""

import gymnasium as gym
from gymnasium import spaces
import numpy as np

from client import TeamsEnvClient


TASKS = ("greeting_response", "channel_explorer", "active_participant",
         "meeting_joiner", "social_butterfly")
CHANNELS = tuple(f"channel-{i}" for i in range(1, 6))
MESSAGES = (
    "Hello team, thanks for welcoming me!",
    "Our team is working on API docs today.",
    "The project design looks much clearer now.",
    "I can help the team review the work.",
    "Let's discuss the project at our next meeting.",
)


class TeamsEnv(gym.Env):
    """One HTTP episode. The service must be running before constructing this wrapper."""

    metadata = {"render_modes": []}

    def __init__(self, base_url="http://localhost:3001", task_type="greeting_response"):
        super().__init__()
        if task_type not in TASKS:
            raise ValueError(f"Unknown task type: {task_type}")
        self.client = TeamsEnvClient(base_url)
        self.task_type = task_type
        self.state = None
        # greet, four channel switches, join, react, five distinct messages, status
        self.action_space = spaces.Discrete(12)
        self.observation_space = spaces.Box(0.0, 1.0, shape=(16,), dtype=np.float32)

    def _observation(self):
        state = self.state
        stats = state["stats"]
        current = state["agentState"]["currentChannelId"]
        one_hot_channel = [float(current == channel) for channel in CHANNELS]
        values = [min(1.0, stats["stepCount"] / max(1, state["task"]["maxSteps"])),
                  min(1.0, stats["messagesSent"] / 5),
                  min(1.0, stats["channelsSwitched"] / 5),
                  min(1.0, stats["reactionsGiven"] / 3),
                  min(1.0, stats["callsJoined"]),
                  min(1.0, sum(m["userId"] != "agent" for m in state["recentMessages"]) / 10)]
        one_hot_task = [float(state["task"]["type"] == task) for task in TASKS]
        return np.asarray(one_hot_channel + values + one_hot_task, dtype=np.float32)

    def reset(self, *, seed=None, options=None):
        super().reset(seed=seed)
        task = (options or {}).get("task_type", self.task_type)
        result = self.client.reset(task_type=task, seed=seed)
        self.state = result["state"]
        return self._observation(), {"task": task}

    def step(self, action):
        if self.state is None:
            raise RuntimeError("Call reset before step")
        if not self.action_space.contains(action):
            raise ValueError("Action is outside the discrete action space")
        if action == 0:
            command = {"type": "send_message", "payload": {"content": MESSAGES[0]}}
        elif 1 <= action <= 4:
            command = {"type": "switch_channel", "payload": {"channelId": CHANNELS[action]}}
        elif action == 5:
            command = {"type": "join_call", "payload": {}}
        elif action == 6:
            candidates = [msg for msg in self.state["recentMessages"] if msg["userId"] != "agent"
                          and not any(r["userId"] == "agent" for r in msg.get("reactions", []))]
            command = {"type": "react_to_message", "payload": {
                "messageId": candidates[-1]["id"] if candidates else "none", "reaction": "👍"}}
        elif 7 <= action <= 10:
            command = {"type": "send_message", "payload": {"content": MESSAGES[action - 6]}}
        else:
            command = {"type": "set_status", "payload": {"status": "available"}}
        result = self.client.step(command)
        self.state = result["state"]
        completed = self.state["stats"]["taskCompleted"]
        return (self._observation(), float(result["reward"]),
                bool(result["done"] and completed), bool(result["done"] and not completed),
                result["info"])
