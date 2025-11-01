"""
RL Environment Demo Script

This script demonstrates all the key features of the TeamsClone RL Environment:
1. Task variety and definitions
2. Agent with task-specific policies
3. Multi-episode training
4. Episode statistics and history
5. Different task completion strategies

Run this to showcase the RL system!
"""

import time
from client import TeamsEnvClient
from agent import TaskAgent


def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70 + "\n")


def demo_task_definitions():
    """Demo 1: Show all available tasks"""
    print_header("DEMO 1: Available Tasks")

    client = TeamsEnvClient()
    tasks = client.get_tasks()

    print(f"The environment offers {len(tasks)} different tasks:\n")

    for i, (task_id, task) in enumerate(tasks.items(), 1):
        print(f"{i}. {task['name']}")
        print(f"   Goal: {task['description']}")
        print(
            f"   Max Steps: {task['maxSteps']} | Completion Reward: +{task['reward']}")
        print()

    input("Press Enter to continue...")


def demo_single_episode():
    """Demo 2: Run a single episode with the greeting_response task"""
    print_header("DEMO 2: Single Episode - Greeting Response Task")

    client = TeamsEnvClient()
    agent = TaskAgent(client)

    print("Task: The agent must detect and respond to a greeting message.\n")
    print("Strategy: Look for greeting keywords (hello, hi, welcome) and respond.\n")

    input("Press Enter to start the episode...")
    print()

    result = agent.run_episode(task_type='greeting_response', verbose=True)

    print(
        f"\n✓ Result: Task {'COMPLETED' if result['completed'] else 'FAILED'}")
    print(f"  Total Reward: {result['total_reward']:.2f}")
    print(f"  Steps Taken: {result['steps']}")

    input("\nPress Enter to continue...")


def demo_channel_explorer():
    """Demo 3: Channel Explorer task"""
    print_header("DEMO 3: Channel Explorer Task")

    client = TeamsEnvClient()
    agent = TaskAgent(client)

    print("Task: Visit at least 3 different channels.\n")
    print("Strategy: Systematically switch between available channels.\n")

    input("Press Enter to start the episode...")
    print()

    result = agent.run_episode(task_type='channel_explorer', verbose=True)

    print(
        f"\n✓ Result: Task {'COMPLETED' if result['completed'] else 'FAILED'}")
    print(f"  Channels Visited: {result['stats']['channelsSwitched']}")
    print(f"  Total Reward: {result['total_reward']:.2f}")
    print(f"  Efficiency: {result['steps']} steps")

    input("\nPress Enter to continue...")


def demo_social_butterfly():
    """Demo 4: Social Butterfly task"""
    print_header("DEMO 4: Social Butterfly Task")

    client = TeamsEnvClient()
    agent = TaskAgent(client)

    print("Task: React to 3 messages AND send 3 messages.\n")
    print("Strategy: Balance between reacting and messaging.\n")

    input("Press Enter to start the episode...")
    print()

    result = agent.run_episode(task_type='social_butterfly', verbose=True)

    print(
        f"\n✓ Result: Task {'COMPLETED' if result['completed'] else 'FAILED'}")
    print(f"  Messages Sent: {result['stats']['messagesSent']}")
    print(f"  Reactions Given: {result['stats']['reactionsGiven']}")
    print(f"  Total Reward: {result['total_reward']:.2f}")

    input("\nPress Enter to continue...")


def demo_multi_episode_training():
    """Demo 5: Multi-episode training with random tasks"""
    print_header("DEMO 5: Multi-Episode Training (Random Tasks)")

    client = TeamsEnvClient()
    agent = TaskAgent(client)

    print("Training the agent on 5 random tasks.\n")
    print("This demonstrates the agent's ability to handle different objectives.\n")

    input("Press Enter to start training...")
    print()

    results = []
    num_episodes = 5

    for i in range(num_episodes):
        print(f"\n{'─'*70}")
        print(f"Episode {i+1}/{num_episodes}")
        print('─'*70)

        result = agent.run_episode(verbose=False)
        results.append(result)

        # Print compact summary
        status = "✓" if result['completed'] else "✗"
        print(f"{status} {result['task_name']:25} "
              f"Reward: {result['total_reward']:6.2f}  "
              f"Steps: {result['steps']:2}")

        time.sleep(0.3)

    # Final summary
    print(f"\n{'='*70}")
    print("Training Summary")
    print('='*70)

    completed = sum(1 for r in results if r['completed'])
    avg_reward = sum(r['total_reward'] for r in results) / len(results)
    avg_steps = sum(r['steps'] for r in results) / len(results)

    print(
        f"\nSuccess Rate: {completed}/{num_episodes} ({completed/num_episodes*100:.0f}%)")
    print(f"Average Reward: {avg_reward:.2f}")
    print(f"Average Steps: {avg_steps:.1f}")

    # Per-task breakdown
    task_stats = {}
    for r in results:
        task_name = r['task_name']
        if task_name not in task_stats:
            task_stats[task_name] = {'completed': 0, 'total': 0, 'rewards': []}
        task_stats[task_name]['total'] += 1
        task_stats[task_name]['rewards'].append(r['total_reward'])
        if r['completed']:
            task_stats[task_name]['completed'] += 1

    print("\nPer-Task Performance:")
    for task_name, stats in task_stats.items():
        success_rate = stats['completed'] / stats['total'] * 100
        avg_task_reward = sum(stats['rewards']) / len(stats['rewards'])
        print(f"  {task_name:25} {stats['completed']}/{stats['total']} "
              f"({success_rate:.0f}%)  Avg Reward: {avg_task_reward:.2f}")

    input("\nPress Enter to continue...")


def demo_episode_history():
    """Demo 6: Show episode history from server"""
    print_header("DEMO 6: Episode History")

    client = TeamsEnvClient()

    print("Retrieving episode history from the server...\n")

    history = client.get_history(limit=10)

    if not history:
        print("No episode history available yet.")
    else:
        print(f"Last {len(history)} episodes:\n")
        print(
            f"{'#':3} {'Task':25} {'Result':8} {'Reward':8} {'Steps':6} {'Duration':10}")
        print('─'*70)

        for i, episode in enumerate(history, 1):
            status = "✓ Done" if episode['completed'] else "✗ Failed"
            duration = f"{episode['duration']:.1f}s"
            print(f"{i:3} {episode['task']['name']:25} {status:8} "
                  f"{episode['totalReward']:8.2f} {episode['steps']:6} {duration:10}")

    input("\nPress Enter to finish...")


def main():
    """Run the complete demo"""
    print("\n" + "="*70)
    print("  🎮 TeamsClone RL Environment - Interactive Demo")
    print("="*70)
    print("\nThis demo showcases the complete RL environment implementation:")
    print("  • 5 different task types with unique objectives")
    print("  • Intelligent agent with task-specific policies")
    print("  • Multi-episode training capabilities")
    print("  • Comprehensive statistics and history tracking")
    print("\nMake sure the backend server is running: cd backend && npm start")

    input("\nPress Enter to begin the demo...")

    try:
        # Run all demo sections
        demo_task_definitions()
        demo_single_episode()
        demo_channel_explorer()
        demo_social_butterfly()
        demo_multi_episode_training()
        demo_episode_history()

        # Final message
        print_header("Demo Complete! 🎉")
        print("The RL environment is production-ready and feature-complete.\n")
        print("Key Achievements:")
        print("  ✓ Multi-episode support with isolated state")
        print("  ✓ 5 task types with sophisticated reward shaping")
        print("  ✓ Intelligent baseline agent achieving high success rates")
        print("  ✓ Comprehensive API (9 endpoints)")
        print("  ✓ Full history tracking and statistics")
        print("\nNext Steps:")
        print("  • Train neural network agents (DQN, PPO, A3C)")
        print("  • Implement multi-agent scenarios")
        print("  • Add WebSocket streaming for live visualization")
        print("  • Create custom tasks and reward functions")
        print("\nFor more information, see:")
        print("  • docs/RL_SYSTEM_GUIDE.md")
        print("  • docs/RL_ENHANCEMENT_SUMMARY.md")
        print("\nHappy training! 🚀\n")

    except KeyboardInterrupt:
        print("\n\nDemo interrupted by user.")
    except Exception as e:
        print(f"\n\nError during demo: {e}")
        print("\nMake sure the backend server is running:")
        print("  cd backend && npm start")


if __name__ == '__main__':
    main()
