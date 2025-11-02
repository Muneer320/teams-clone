"""
RL Agent Template for TeamsClone-RL

Template for implementing reinforcement learning agents (DQN, PPO, A3C, etc.)

This is a starting point - team members can implement their own RL algorithms here.
"""

import numpy as np
import sys
import os

# Add parent directory to path to import client
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from client import TeamsEnvClient, ObservationWrapper


class RLAgent:
    """
    Template for RL Agent implementation.

    Team members should implement:
    - State representation/encoding
    - Neural network architecture
    - Training loop
    - Action selection policy
    """

    def __init__(self):
        self.client = TeamsEnvClient()

        # TODO: Initialize your RL model here
        # Example: self.model = DQN(...) or self.model = PPO(...)
        pass

    def encode_state(self, state: dict) -> np.ndarray:
        """
        Convert environment state to neural network input.

        Args:
            state: Raw state dictionary from environment

        Returns:
            Encoded state as numpy array

        TODO: Implement state encoding
        - Extract relevant features (channel info, message history, etc.)
        - Normalize values
        - Return fixed-size vector
        """
        obs = ObservationWrapper(state)

        # Example encoding (team should improve this):
        features = []

        # 1. One-hot encode current channel
        all_channels = obs.get_all_channel_ids()
        current_channel = obs.get_current_channel_id()
        channel_encoding = [1 if ch ==
                            current_channel else 0 for ch in all_channels]
        features.extend(channel_encoding)

        # 2. Number of recent messages
        features.append(len(obs.recent_messages) / 10.0)  # Normalize

        # 3. Has unread mentions
        features.append(1.0 if obs.has_unread_mentions() else 0.0)

        # 4. Episode statistics
        features.append(obs.episode_stats.get('stepCount', 0) / 100.0)

        return np.array(features, dtype=np.float32)

    def select_action(self, state: dict, epsilon: float = 0.1):
        """
        Select action using epsilon-greedy policy.

        Args:
            state: Current state
            epsilon: Exploration rate

        Returns:
            Action dictionary

        TODO: Implement action selection
        - Use neural network to predict Q-values or policy
        - Apply exploration strategy
        - Map network output to valid action
        """
        # TODO: Replace with actual RL policy

        # Placeholder: Random action with epsilon-greedy
        import random

        if random.random() < epsilon:
            # Explore: random action
            action_types = ['send_message', 'switch_channel', 'join_call']
            action_type = random.choice(action_types)
        else:
            # Exploit: use learned policy
            # TODO: Get action from neural network
            action_type = 'send_message'

        # Build action
        if action_type == 'send_message':
            return {
                'type': 'send_message',
                'payload': {'content': 'RL Agent message'}
            }
        elif action_type == 'switch_channel':
            obs = ObservationWrapper(state)
            channels = obs.get_all_channel_ids()
            return {
                'type': 'switch_channel',
                'payload': {'channelId': random.choice(channels)}
            }
        else:
            return {'type': 'join_call', 'payload': {}}

    def train(self, num_episodes: int = 100):
        """
        Training loop for RL agent.

        Args:
            num_episodes: Number of training episodes

        TODO: Implement training logic
        - Collect experience
        - Update neural network
        - Log metrics
        - Save checkpoints
        """
        print("🤖 Starting RL Agent Training")
        print("=" * 50)

        for episode in range(num_episodes):
            state = self.client.reset()
            episode_reward = 0
            done = False
            step = 0

            # TODO: Initialize episode-specific variables
            # episode_buffer = []

            while not done and step < 50:
                # Select action
                action = self.select_action(state, epsilon=0.1)

                # Execute action
                result = self.client.step(action)

                next_state = result.get('state', {})
                reward = result.get('reward', 0)
                done = result.get('done', False)

                episode_reward += reward

                # TODO: Store transition in replay buffer
                # episode_buffer.append((state, action, reward, next_state, done))

                # TODO: Update model
                # if len(replay_buffer) > batch_size:
                #     batch = sample_batch(replay_buffer)
                #     loss = update_model(batch)

                state = next_state
                step += 1

            # TODO: Log metrics
            print(
                f"Episode {episode + 1}/{num_episodes} | Reward: {episode_reward:.2f}")

            # TODO: Save checkpoint periodically
            # if (episode + 1) % 10 == 0:
            #     save_model(f'checkpoint_{episode + 1}.pth')

        print("\n✅ Training Complete!")

    def evaluate(self, num_episodes: int = 10):
        """
        Evaluate trained agent.

        Args:
            num_episodes: Number of evaluation episodes
        """
        print("📊 Evaluating Agent")

        total_rewards = []

        for episode in range(num_episodes):
            state = self.client.reset()
            episode_reward = 0
            done = False

            while not done:
                action = self.select_action(
                    state, epsilon=0.0)  # No exploration
                result = self.client.step(action)

                state = result.get('state', {})
                reward = result.get('reward', 0)
                done = result.get('done', False)

                episode_reward += reward

            total_rewards.append(episode_reward)
            print(f"Episode {episode + 1}: Reward = {episode_reward:.2f}")

        print(
            f"\n📈 Average Reward: {np.mean(total_rewards):.2f} ± {np.std(total_rewards):.2f}")


if __name__ == '__main__':
    # Example usage
    agent = RLAgent()

    # TODO: Implement training
    # agent.train(num_episodes=100)

    # TODO: Implement evaluation
    # agent.evaluate(num_episodes=10)

    print("\n⚠️  This is a template. Implement the RL algorithm!")
    print("Suggested libraries: PyTorch, Stable-Baselines3, RLlib")
