"""
Quick Demo Script for TeamsClone-RL Environment
Runs a single episode with a rule-based agent and displays actions/rewards.
"""

import sys
import os
import time
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Add python_agent to path BEFORE importing from it
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'python_agent'))
from task_agent import TaskAgent
from client import TeamsEnvClient

# Now import from python_agent


def run_demo(base_url="http://localhost:3001", task_type="greeting_response"):
    """Run a single demonstration episode"""

    print("=" * 60)
    print("🚀 TeamsClone-RL Demo")
    print("=" * 60)

    # Initialize client and agent
    print(f"\n📡 Connecting to environment: {base_url}")
    client = TeamsEnvClient(base_url)
    agent = TaskAgent(client)

    # Start episode
    print(f"\n🎯 Starting episode with task: {task_type}")
    episode_info = client.reset(task_type=task_type)

    # Extract task info
    task_info = episode_info.get('task', {})
    print(f"   Episode ID: {episode_info.get('episodeId', 'N/A')}")
    print(f"   Task Name: {task_info.get('name', 'N/A')}")
    print(f"   Task Description: {task_info.get('description', 'N/A')}")
    print(f"   Max Steps: {task_info.get('maxSteps', 'N/A')}")
    print(f"   Completion Reward: +{task_info.get('reward', 0)}")

    # Run episode
    done = False
    total_reward = 0
    step_count = 0
    max_steps = 50

    print("\n" + "=" * 60)
    print("📋 Episode Steps")
    print("=" * 60 + "\n")

    while not done and step_count < max_steps:
        # Get current state
        state = client.get_state()

        # Show state summary on first step
        if step_count == 0:
            current_channel = state.get('currentChannel', {})
            recent_msgs = state.get('recentMessages', [])
            print(f"📍 Initial State:")
            print(f"   Channel: {current_channel.get('name', 'Unknown')}")
            print(f"   Recent Messages: {len(recent_msgs)}")
            print()

        # Agent selects action
        action = agent.select_action(state)

        # Execute action
        result = client.step(action)
        reward = result.get("reward", 0.0)
        done = result.get("done", False)
        info = result.get("info", {})

        # Update counters
        total_reward += reward
        step_count += 1

        # Display step info
        print(f"Step {step_count}:")
        print(f"  🎮 Action: {action.get('type', 'unknown')}")

        # Show action payload details
        payload = action.get('payload', {})
        if action.get('type') == 'send_message' and payload.get('content'):
            content = payload['content']
            print(
                f"     💬 Message: \"{content[:60]}{'...' if len(content) > 60 else ''}\"")
        elif action.get('type') == 'react_to_message' and payload.get('reaction'):
            print(f"     👍 Reaction: {payload['reaction']}")
        elif action.get('type') == 'switch_channel' and payload.get('channelId'):
            print(f"     📺 Channel: {payload['channelId']}")

        print(f"  🏆 Reward: {reward:+.2f}")
        print(f"  📊 Total Reward: {total_reward:+.2f}")

        # Show completion status
        if done:
            if info.get('taskCompleted'):
                print(
                    f"  🎉 Task Completed! Bonus: +{info.get('taskReward', 0):.1f}")
            else:
                print(f"  ⏱️  Episode ended")

        if info.get("message"):
            print(f"  💬 Info: {info['message']}")

        print()

        # Small delay for readability
        time.sleep(0.3)

    # Episode summary
    print("=" * 60)
    print("📈 Episode Summary")
    print("=" * 60)
    print(f"  Total Steps: {step_count}")
    print(f"  Total Reward: {total_reward:.2f}")
    print(f"  Average Reward: {total_reward/step_count:.2f}")
    completed = bool(info.get('taskCompleted'))
    print(f"  Completed: {'✅ Yes' if completed else '❌ No'}")
    print("=" * 60)

    # Get episode stats
    try:
        stats = client.get_stats()
        print("\n📊 Environment Statistics:")
        print(f"  Task Completed: {stats.get('taskCompleted', False)}")
        print(f"  Recorded Reward: {stats.get('totalReward', 0):.2f}")
        print("=" * 60)
    except:
        pass

    return {
        "total_reward": total_reward,
        "steps": step_count,
        "completed": completed
    }


def main():
    """Main entry point"""
    import argparse

    parser = argparse.ArgumentParser(description="Run TeamsClone-RL demo")
    parser.add_argument(
        "--url",
        default="http://localhost:3001",
        help="Backend server URL (default: http://localhost:3001)"
    )
    parser.add_argument(
        "--task",
        default="greeting_response",
        choices=["greeting_response", "channel_explorer", "active_participant",
                 "meeting_joiner", "social_butterfly"],
        help="Task type to run (default: greeting_response)"
    )

    args = parser.parse_args()

    try:
        result = run_demo(base_url=args.url, task_type=args.task)
        print("\n✅ Demo completed successfully!")
        return 0
    except KeyboardInterrupt:
        print("\n\n⚠️  Demo interrupted by user")
        return 1
    except Exception as e:
        print(f"\n\n❌ Error: {str(e)}")
        print("\nMake sure the backend server is running on", args.url)
        return 1


if __name__ == "__main__":
    exit(main())
