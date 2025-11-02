"""
Random Agent for TeamsClone-RL

This agent takes random actions in the environment.
Useful for baseline testing and environment validation.
"""

import random
import time
import sys
import os

# Add parent directory to path to import client
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from client import TeamsEnvClient, ObservationWrapper


def random_agent(episodes: int = 5, max_steps: int = 50):
    """
    Run a random agent that takes random actions.

    Args:
        episodes: Number of episodes to run
        max_steps: Maximum steps per episode
    """
    client = TeamsEnvClient()

    print("🤖 Starting Random Agent")
    print("=" * 50)

    for episode in range(episodes):
        print(f"\n📊 Episode {episode + 1}/{episodes}")

        # Reset environment
        state = client.reset()
        obs = ObservationWrapper(state)

        total_reward = 0
        done = False
        step = 0

        while not done and step < max_steps:
            # Get available actions
            actions_info = client.get_actions()
            action_types = [a['type'] for a in actions_info['actions']]
            channels = [c['id'] for c in actions_info['channels']]

            # Choose random action
            action_type = random.choice(action_types)

            # Build action payload
            if action_type == 'send_message':
                messages = [
                    "Hello team!",
                    "How's everyone doing?",
                    "Great work today!",
                    "Anyone available for a quick sync?",
                    "Thanks for the update!",
                    "LGTM 👍"
                ]
                action = {
                    'type': 'send_message',
                    'payload': {'content': random.choice(messages)}
                }
            elif action_type == 'switch_channel':
                action = {
                    'type': 'switch_channel',
                    'payload': {'channelId': random.choice(channels)}
                }
            elif action_type == 'join_call':
                action = {
                    'type': 'join_call',
                    'payload': {}
                }
            elif action_type == 'react_to_message':
                if obs.recent_messages:
                    message = random.choice(obs.recent_messages)
                    action = {
                        'type': 'react_to_message',
                        'payload': {
                            'messageId': message['id'],
                            'reaction': random.choice(['👍', '❤️', '😊', '🎉'])
                        }
                    }
                else:
                    continue
            else:
                continue

            # Execute action
            result = client.step(action)

            reward = result.get('reward', 0)
            done = result.get('done', False)
            info = result.get('info', {})

            total_reward += reward
            step += 1

            print(
                f"  Step {step}: {action['type']} | Reward: {reward:.2f} | Total: {total_reward:.2f}")

            # Small delay to simulate realistic interaction
            time.sleep(0.5)

        # Get final stats
        stats = client.get_stats()
        print(f"\n✅ Episode {episode + 1} Complete!")
        print(f"   Total Steps: {stats.get('stepCount', 0)}")
        print(f"   Total Reward: {stats.get('totalReward', 0):.2f}")
        print(f"   Messages Sent: {stats.get('messagesSent', 0)}")
        print(f"   Channels Switched: {stats.get('channelsSwitched', 0)}")


if __name__ == '__main__':
    try:
        random_agent(episodes=3, max_steps=20)
    except KeyboardInterrupt:
        print("\n\n⚠️  Agent stopped by user")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
