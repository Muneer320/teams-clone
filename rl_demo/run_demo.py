"""
Quick Demo Script for TeamsClone-RL Environment
Runs a single episode with a rule-based agent and displays actions/rewards.
"""

import sys
import os
import time

# Add python_agent to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'python_agent'))

from client import TeamsEnvClient
from agent import TaskAgent


def run_demo(base_url="http://localhost:3001", task_type="greeting_response"):
    """Run a single demonstration episode"""
    
    print("=" * 60)
    print("🚀 TeamsClone-RL Demo")
    print("=" * 60)
    
    # Initialize client and agent
    print(f"\n📡 Connecting to environment: {base_url}")
    client = TeamsEnvClient(base_url)
    agent = TaskAgent()
    
    # Start episode
    print(f"\n🎯 Starting episode with task: {task_type}")
    episode_info = client.reset(task_type=task_type)
    print(f"   Episode ID: {episode_info.get('episode_id', 'N/A')}")
    print(f"   Task Description: {episode_info.get('task_description', 'N/A')}")
    
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
        state_response = client.get_state()
        state = state_response.get("state", {})
        
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
        if action.get('content'):
            print(f"     Content: \"{action.get('content')[:50]}...\"")
        print(f"  🏆 Reward: {reward:+.2f}")
        print(f"  📊 Total Reward: {total_reward:+.2f}")
        
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
    print(f"  Completed: {'✅ Yes' if done else '❌ No (timeout)'}")
    print("=" * 60)
    
    # Get episode stats
    try:
        stats = client.get_stats()
        print("\n📊 Environment Statistics:")
        print(f"  Total Episodes: {stats.get('total_episodes', 0)}")
        print(f"  Average Reward: {stats.get('avg_reward', 0):.2f}")
        print("=" * 60)
    except:
        pass
    
    return {
        "total_reward": total_reward,
        "steps": step_count,
        "completed": done
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
        choices=["greeting_response", "meeting_setup", "channel_navigation", 
                 "message_reaction", "status_update"],
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
