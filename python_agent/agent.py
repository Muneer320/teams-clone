"""
RL Training Agent for TeamsClone-RL

Demonstrates how to train an agent with task-based learning and episode management.
"""

import time
from client import TeamsEnvClient


class TaskAgent:
    """
    Agent that can handle different task types with task-specific policies.
    """

    def __init__(self, client):
        self.client = client
        self.episode_id = None
        self.task_type = None

    def select_action(self, state):
        """
        Select an action based on the current state and task.

        This is a simple rule-based policy. In practice, you would use
        a trained neural network or other RL algorithm.
        """
        task = state.get('task', {})
        task_type = task.get('type')
        recent_messages = state.get('recentMessages', [])
        stats = state.get('stats', {})
        agent_state = state.get('agentState', {})
        current_channel = agent_state.get('currentChannelId')

        # Task-specific policies
        if task_type == 'greeting_response':
            return self._greeting_response_policy(recent_messages, stats)
        elif task_type == 'channel_explorer':
            return self._channel_explorer_policy(stats, current_channel)
        elif task_type == 'active_participant':
            return self._active_participant_policy(stats, recent_messages)
        elif task_type == 'meeting_joiner':
            return self._meeting_joiner_policy(recent_messages, stats)
        elif task_type == 'social_butterfly':
            return self._social_butterfly_policy(recent_messages, stats)
        else:
            return self._default_policy(recent_messages)

    def _greeting_response_policy(self, recent_messages, stats):
        """Policy for greeting response task"""
        # Look for greetings from others
        for msg in reversed(recent_messages):
            if msg['userId'] != 'agent':
                content = msg['content'].lower()
                if any(word in content for word in ['hello', 'hi', 'welcome', 'hey']):
                    # Respond with a greeting
                    return {
                        'type': 'send_message',
                        'payload': {'content': 'Hello! Thanks for the warm welcome! 👋'}
                    }

        # If no greeting found yet, wait (do a low-impact action)
        return {
            'type': 'send_message',
            'payload': {'content': 'Hi there!'}
        }

    def _channel_explorer_policy(self, stats, current_channel):
        """Policy for channel explorer task"""
        channels_switched = stats.get('channelsSwitched', 0)

        # Switch to different channels
        channel_sequence = ['channel-2', 'channel-3',
                            'channel-4', 'channel-5', 'channel-1']

        if channels_switched < len(channel_sequence):
            next_channel = channel_sequence[channels_switched]
            if next_channel != current_channel:
                return {
                    'type': 'switch_channel',
                    'payload': {'channelId': next_channel}
                }

        # Default message
        return {
            'type': 'send_message',
            'payload': {'content': 'Exploring the channels!'}
        }

    def _active_participant_policy(self, stats, recent_messages):
        """Policy for active participant task"""
        messages_sent = stats.get('messagesSent', 0)

        messages = [
            "I'm working on the RL environment today!",
            "Great progress everyone! 🎉",
            "Let me know if anyone needs help with their tasks",
            "Just finished implementing the task system",
            "Looking forward to our next team meeting"
        ]

        if messages_sent < len(messages):
            return {
                'type': 'send_message',
                'payload': {'content': messages[messages_sent]}
            }

        # If we've sent all messages, engage with recent ones
        if recent_messages:
            last_msg = recent_messages[-1]
            if last_msg['userId'] != 'agent':
                return {
                    'type': 'react_to_message',
                    'payload': {
                        'messageId': last_msg['id'],
                        'reaction': '👍'
                    }
                }

        return {
            'type': 'send_message',
            'payload': {'content': 'Keep up the good work team!'}
        }

    def _meeting_joiner_policy(self, recent_messages, stats):
        """Policy for meeting joiner task"""
        # Check for call invitations
        for msg in reversed(recent_messages):
            content = msg['content'].lower()
            if '@agent' in content and any(word in content for word in ['call', 'meeting', 'standup']):
                # Join the call
                return {
                    'type': 'join_call',
                    'payload': {}
                }

        # Send a message expressing interest
        if stats.get('messagesSent', 0) == 0:
            return {
                'type': 'send_message',
                'payload': {'content': 'I\'m available for meetings!'}
            }

        # Wait a bit
        return {
            'type': 'send_message',
            'payload': {'content': 'Ready to join when needed'}
        }

    def _social_butterfly_policy(self, recent_messages, stats):
        """Policy for social butterfly task"""
        reactions_given = stats.get('reactionsGiven', 0)
        messages_sent = stats.get('messagesSent', 0)

        # Alternate between reacting and messaging
        if reactions_given < 3 and len(recent_messages) > 0:
            # React to a message we haven't reacted to
            for msg in reversed(recent_messages):
                if msg['userId'] != 'agent':
                    return {
                        'type': 'react_to_message',
                        'payload': {
                            'messageId': msg['id'],
                            'reaction': ['👍', '❤️', '🎉'][reactions_given % 3]
                        }
                    }

        if messages_sent < 3:
            social_messages = [
                "Great team effort! 💪",
                "Love the collaborative atmosphere here!",
                "Thanks everyone for making this fun! 😊"
            ]
            return {
                'type': 'send_message',
                'payload': {'content': social_messages[messages_sent % 3]}
            }

        # Keep engaging
        if len(recent_messages) > 0:
            last_msg = recent_messages[-1]
            if last_msg['userId'] != 'agent':
                return {
                    'type': 'react_to_message',
                    'payload': {
                        'messageId': last_msg['id'],
                        'reaction': '🌟'
                    }
                }

        return {
            'type': 'send_message',
            'payload': {'content': 'Keep being awesome team!'}
        }

    def _default_policy(self, recent_messages):
        """Default policy when no specific task"""
        if len(recent_messages) > 0:
            last_msg = recent_messages[-1]
            if last_msg['userId'] != 'agent':
                return {
                    'type': 'send_message',
                    'payload': {'content': f"Responding to {last_msg['content'][:20]}..."}
                }

        return {
            'type': 'send_message',
            'payload': {'content': 'Hello team!'}
        }

    def run_episode(self, task_type=None, max_steps=None, verbose=True):
        """
        Run a complete episode.

        Args:
            task_type: Specific task to attempt (None for random)
            max_steps: Maximum steps (None uses task default)
            verbose: Whether to print progress

        Returns:
            Episode summary dictionary
        """
        # Reset environment
        if verbose:
            print(f"\n{'='*60}")
            print("Starting new episode...")
            print(f"{'='*60}\n")

        reset_result = self.client.reset(task_type=task_type)
        self.episode_id = reset_result['episodeId']
        task = reset_result['task']
        state = reset_result['state']

        if verbose:
            print(f"Episode ID: {self.episode_id}")
            print(f"Task: {task['name']}")
            print(f"Description: {task['description']}")
            print(f"Max Steps: {task['maxSteps']}")
            print()

        step = 0
        total_reward = 0
        done = False

        while not done:
            step += 1

            # Select and execute action
            action = self.select_action(state)

            if verbose:
                print(f"Step {step}: {action['type']}", end="")
                if action['type'] == 'send_message':
                    content = action['payload'].get('content', '')[:30]
                    print(f" - '{content}...'")
                else:
                    print()

            # Execute action
            result = self.client.step(action, self.episode_id)
            state = result['state']
            reward = result['reward']
            done = result['done']
            info = result['info']

            total_reward += reward

            if verbose and reward != 0:
                print(f"  → Reward: {reward:+.2f}")

            if 'taskCompleted' in info and info['taskCompleted']:
                if verbose:
                    print(
                        f"\n🎉 Task completed! Bonus reward: +{info['taskReward']:.1f}")

            if done:
                if verbose:
                    print(f"\nEpisode finished!")
                    print(f"Reason: {info.get('reason', 'unknown')}")
                    print(f"Total reward: {total_reward:.2f}")
                    print(f"Steps: {step}")

                    stats = state['stats']
                    print(f"\nEpisode Statistics:")
                    print(f"  Messages sent: {stats['messagesSent']}")
                    print(f"  Channels switched: {stats['channelsSwitched']}")
                    print(f"  Reactions given: {stats['reactionsGiven']}")
                    print(f"  Calls joined: {stats['callsJoined']}")
                    print(
                        f"  Task completed: {'✓' if stats['taskCompleted'] else '✗'}")

            # Safety limit
            if max_steps and step >= max_steps:
                break

            # Small delay for readability
            if verbose:
                time.sleep(0.1)

        return {
            'episode_id': self.episode_id,
            'task_type': task['type'],
            'total_reward': total_reward,
            'steps': step,
            'completed': state['stats']['taskCompleted']
        }


def train_multiple_episodes(num_episodes=5, task_type=None):
    """
    Train agent over multiple episodes.

    Args:
        num_episodes: Number of episodes to run
        task_type: Specific task to practice (None for random)
    """
    client = TeamsEnvClient()
    agent = TaskAgent(client)

    print(f"\n{'='*60}")
    print(f"Training agent for {num_episodes} episodes")
    if task_type:
        print(f"Task type: {task_type}")
    print(f"{'='*60}")

    results = []

    for i in range(num_episodes):
        print(f"\n\nEpisode {i+1}/{num_episodes}")
        result = agent.run_episode(task_type=task_type, verbose=True)
        results.append(result)

        time.sleep(0.5)

    # Print summary
    print(f"\n\n{'='*60}")
    print("Training Summary")
    print(f"{'='*60}")
    print(f"\nTotal episodes: {num_episodes}")
    print(
        f"Completed tasks: {sum(1 for r in results if r['completed'])}/{num_episodes}")
    print(
        f"Average reward: {sum(r['total_reward'] for r in results) / num_episodes:.2f}")
    print(
        f"Average steps: {sum(r['steps'] for r in results) / num_episodes:.1f}")

    print(f"\nPer-episode results:")
    for i, result in enumerate(results, 1):
        status = "✓" if result['completed'] else "✗"
        print(f"  {i}. {status} {result['task_type']:20s} "
              f"Reward: {result['total_reward']:6.2f}  Steps: {result['steps']}")

    # Get episode history from server
    print(f"\n{'='*60}")
    print("Episode History (from server)")
    print(f"{'='*60}")
    history = client.get_history(limit=num_episodes)
    for h in history:
        status = "✓" if h['completed'] else "✗"
        print(f"{status} {h['taskType']:20s} Reward: {h['totalReward']:6.2f}  "
              f"Steps: {h['steps']}  Duration: {h['duration']/1000:.1f}s")


if __name__ == "__main__":
    # Example 1: Single episode with specific task
    print("Example 1: Single episode with greeting_response task")
    client = TeamsEnvClient()
    agent = TaskAgent(client)
    agent.run_episode(task_type='greeting_response', verbose=True)

    # Example 2: Multiple episodes with random tasks
    time.sleep(2)
    print("\n\n" + "="*60)
    print("Example 2: Multiple episodes with random tasks")
    print("="*60)
    train_multiple_episodes(num_episodes=3)

    # Example 3: Practice specific task multiple times
    time.sleep(2)
    print("\n\n" + "="*60)
    print("Example 3: Practice 'active_participant' task")
    print("="*60)
    train_multiple_episodes(num_episodes=2, task_type='active_participant')
