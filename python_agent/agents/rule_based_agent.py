"""
Rule-Based Agent for TeamsClone-RL

This agent uses simple rules to decide actions:
1. Respond to mentions with high priority
2. Switch to channels with unread messages
3. Send periodic check-in messages
4. Join calls when appropriate
"""

from client import TeamsEnvClient, ObservationWrapper
import time
import sys
import os

# Add parent directory to path to import client
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class RuleBasedAgent:
    """Simple rule-based agent for TeamsClone-RL."""

    def __init__(self):
        self.client = TeamsEnvClient()
        self.steps_since_message = 0
        self.message_interval = 5  # Send message every 5 steps

    def choose_action(self, obs: ObservationWrapper):
        """
        Choose action based on simple rules.

        Priority:
        1. Respond to mentions
        2. Switch to channel with unread
        3. Send periodic message
        4. Explore (switch channel)
        """

        # Rule 1: Respond to mentions
        if obs.has_unread_mentions():
            print("  🎯 Rule: Responding to mention")
            return {
                'type': 'send_message',
                'payload': {'content': 'Thanks for the mention! I\'m here to help.'}
            }

        # Rule 2: Check for unread channels
        for team in obs.teams:
            for channel in team.get('channels', []):
                if channel.get('unread', 0) > 0:
                    print(
                        f"  🎯 Rule: Switching to channel with {channel['unread']} unread")
                    return {
                        'type': 'switch_channel',
                        'payload': {'channelId': channel['id']}
                    }

        # Rule 3: Send periodic check-in message
        self.steps_since_message += 1
        if self.steps_since_message >= self.message_interval:
            self.steps_since_message = 0
            print("  🎯 Rule: Periodic check-in")
            messages = [
                "Checking in! How can I help?",
                "Anyone need assistance?",
                "Updates from the team?",
                "All good here! 👍"
            ]
            import random
            return {
                'type': 'send_message',
                'payload': {'content': random.choice(messages)}
            }

        # Rule 4: Explore - switch to different channel
        print("  🎯 Rule: Exploring channels")
        channel_ids = obs.get_all_channel_ids()
        current_id = obs.get_current_channel_id()
        other_channels = [c for c in channel_ids if c != current_id]

        if other_channels:
            import random
            return {
                'type': 'switch_channel',
                'payload': {'channelId': random.choice(other_channels)}
            }

        # Default: send message
        return {
            'type': 'send_message',
            'payload': {'content': 'Staying active in the channel!'}
        }

    def run(self, episodes: int = 5, max_steps: int = 30):
        """
        Run the rule-based agent.

        Args:
            episodes: Number of episodes to run
            max_steps: Maximum steps per episode
        """
        print("🤖 Starting Rule-Based Agent")
        print("=" * 50)

        for episode in range(episodes):
            print(f"\n📊 Episode {episode + 1}/{episodes}")

            # Reset environment
            state = self.client.reset()
            self.steps_since_message = 0

            total_reward = 0
            done = False
            step = 0

            while not done and step < max_steps:
                obs = ObservationWrapper(state)

                # Choose action based on rules
                action = self.choose_action(obs)

                # Execute action
                result = self.client.step(action)

                state = result.get('state', {})
                reward = result.get('reward', 0)
                done = result.get('done', False)
                info = result.get('info', {})

                total_reward += reward
                step += 1

                print(
                    f"  Step {step}: {action['type']} | Reward: {reward:.2f} | Total: {total_reward:.2f}")

                time.sleep(0.5)

            # Get final stats
            stats = self.client.get_stats()
            print(f"\n✅ Episode {episode + 1} Complete!")
            print(f"   Total Steps: {stats.get('stepCount', 0)}")
            print(f"   Total Reward: {stats.get('totalReward', 0):.2f}")
            print(f"   Messages Sent: {stats.get('messagesSent', 0)}")
            print(f"   Channels Switched: {stats.get('channelsSwitched', 0)}")


if __name__ == '__main__':
    try:
        agent = RuleBasedAgent()
        agent.run(episodes=3, max_steps=20)
    except KeyboardInterrupt:
        print("\n\n⚠️  Agent stopped by user")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
