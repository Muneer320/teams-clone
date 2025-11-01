"""
Plot Results from TeamsClone-RL Episode Logs
Generates visualizations from JSON episode data.
"""

import json
import os
import matplotlib.pyplot as plt
import numpy as np
from collections import Counter
from datetime import datetime


def load_episode_data(file_path):
    """Load episode data from JSON file"""
    with open(file_path, 'r') as f:
        return json.load(f)


def plot_episode_rewards(episodes, save_path=None):
    """Plot rewards across episodes"""
    episode_nums = [ep['episode_num'] for ep in episodes]
    rewards = [ep['total_reward'] for ep in episodes]
    
    plt.figure(figsize=(12, 6))
    plt.plot(episode_nums, rewards, marker='o', linewidth=2, markersize=6)
    plt.xlabel('Episode Number', fontsize=12)
    plt.ylabel('Total Reward', fontsize=12)
    plt.title('Agent Performance: Episode Rewards', fontsize=14, fontweight='bold')
    plt.grid(True, alpha=0.3)
    plt.axhline(y=0, color='r', linestyle='--', alpha=0.5, label='Zero Reward')
    
    # Add trend line
    z = np.polyfit(episode_nums, rewards, 1)
    p = np.poly1d(z)
    plt.plot(episode_nums, p(episode_nums), "r--", alpha=0.5, label='Trend')
    
    plt.legend()
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"✅ Saved reward plot to: {save_path}")
    else:
        plt.show()
    
    plt.close()


def plot_steps_per_episode(episodes, save_path=None):
    """Plot number of steps per episode"""
    episode_nums = [ep['episode_num'] for ep in episodes]
    steps = [ep['steps'] for ep in episodes]
    
    plt.figure(figsize=(12, 6))
    plt.bar(episode_nums, steps, color='steelblue', alpha=0.7)
    plt.xlabel('Episode Number', fontsize=12)
    plt.ylabel('Steps', fontsize=12)
    plt.title('Episode Length (Steps)', fontsize=14, fontweight='bold')
    plt.grid(True, axis='y', alpha=0.3)
    
    # Add average line
    avg_steps = np.mean(steps)
    plt.axhline(y=avg_steps, color='r', linestyle='--', label=f'Average: {avg_steps:.1f}')
    plt.legend()
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"✅ Saved steps plot to: {save_path}")
    else:
        plt.show()
    
    plt.close()


def plot_action_distribution(episodes, save_path=None):
    """Plot distribution of actions taken"""
    all_actions = []
    for ep in episodes:
        all_actions.extend(ep.get('actions', []))
    
    action_counts = Counter(all_actions)
    actions = list(action_counts.keys())
    counts = list(action_counts.values())
    
    plt.figure(figsize=(12, 6))
    plt.bar(actions, counts, color='coral', alpha=0.7)
    plt.xlabel('Action Type', fontsize=12)
    plt.ylabel('Frequency', fontsize=12)
    plt.title('Action Distribution Across All Episodes', fontsize=14, fontweight='bold')
    plt.xticks(rotation=45, ha='right')
    plt.grid(True, axis='y', alpha=0.3)
    
    # Add percentage labels
    total = sum(counts)
    for i, (action, count) in enumerate(zip(actions, counts)):
        percentage = (count / total) * 100
        plt.text(i, count, f'{percentage:.1f}%', ha='center', va='bottom')
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"✅ Saved action distribution plot to: {save_path}")
    else:
        plt.show()
    
    plt.close()


def plot_reward_distribution(episodes, save_path=None):
    """Plot histogram of episode rewards"""
    rewards = [ep['total_reward'] for ep in episodes]
    
    plt.figure(figsize=(10, 6))
    plt.hist(rewards, bins=15, color='green', alpha=0.7, edgecolor='black')
    plt.xlabel('Total Reward', fontsize=12)
    plt.ylabel('Frequency', fontsize=12)
    plt.title('Distribution of Episode Rewards', fontsize=14, fontweight='bold')
    plt.grid(True, axis='y', alpha=0.3)
    
    # Add statistics
    mean_reward = np.mean(rewards)
    median_reward = np.median(rewards)
    plt.axvline(mean_reward, color='r', linestyle='--', label=f'Mean: {mean_reward:.2f}')
    plt.axvline(median_reward, color='b', linestyle='--', label=f'Median: {median_reward:.2f}')
    plt.legend()
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"✅ Saved reward distribution plot to: {save_path}")
    else:
        plt.show()
    
    plt.close()


def plot_task_performance(episodes, save_path=None):
    """Plot performance by task type"""
    task_rewards = {}
    for ep in episodes:
        task = ep.get('task_type', 'unknown')
        if task not in task_rewards:
            task_rewards[task] = []
        task_rewards[task].append(ep['total_reward'])
    
    tasks = list(task_rewards.keys())
    avg_rewards = [np.mean(task_rewards[task]) for task in tasks]
    
    plt.figure(figsize=(10, 6))
    bars = plt.bar(tasks, avg_rewards, color='purple', alpha=0.7)
    plt.xlabel('Task Type', fontsize=12)
    plt.ylabel('Average Reward', fontsize=12)
    plt.title('Average Reward by Task Type', fontsize=14, fontweight='bold')
    plt.xticks(rotation=45, ha='right')
    plt.grid(True, axis='y', alpha=0.3)
    
    # Add value labels on bars
    for bar, reward in zip(bars, avg_rewards):
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height,
                f'{reward:.2f}', ha='center', va='bottom')
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"✅ Saved task performance plot to: {save_path}")
    else:
        plt.show()
    
    plt.close()


def generate_summary_stats(episodes):
    """Generate and print summary statistics"""
    print("\n" + "=" * 60)
    print("📊 EPISODE SUMMARY STATISTICS")
    print("=" * 60)
    
    rewards = [ep['total_reward'] for ep in episodes]
    steps = [ep['steps'] for ep in episodes]
    completed = [ep.get('completed', False) for ep in episodes]
    
    print(f"\n📈 Reward Statistics:")
    print(f"  Total Episodes: {len(episodes)}")
    print(f"  Mean Reward: {np.mean(rewards):.2f}")
    print(f"  Median Reward: {np.median(rewards):.2f}")
    print(f"  Std Dev: {np.std(rewards):.2f}")
    print(f"  Min Reward: {np.min(rewards):.2f}")
    print(f"  Max Reward: {np.max(rewards):.2f}")
    
    print(f"\n⏱️  Step Statistics:")
    print(f"  Mean Steps: {np.mean(steps):.1f}")
    print(f"  Median Steps: {np.median(steps):.1f}")
    print(f"  Min Steps: {np.min(steps)}")
    print(f"  Max Steps: {np.max(steps)}")
    
    print(f"\n✅ Completion Rate:")
    completion_rate = sum(completed) / len(completed) * 100
    print(f"  {completion_rate:.1f}% ({sum(completed)}/{len(completed)})")
    
    # Task breakdown
    task_counts = Counter([ep.get('task_type', 'unknown') for ep in episodes])
    print(f"\n🎯 Task Distribution:")
    for task, count in task_counts.most_common():
        print(f"  {task}: {count} episodes")
    
    print("=" * 60 + "\n")


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Plot TeamsClone-RL results")
    parser.add_argument(
        "data_file",
        help="Path to JSON file containing episode data"
    )
    parser.add_argument(
        "--output-dir",
        default="./plots",
        help="Directory to save plots (default: ./plots)"
    )
    parser.add_argument(
        "--format",
        default="png",
        choices=["png", "pdf", "svg"],
        help="Output format for plots (default: png)"
    )
    
    args = parser.parse_args()
    
    # Load data
    print(f"📂 Loading episode data from: {args.data_file}")
    try:
        episodes = load_episode_data(args.data_file)
    except FileNotFoundError:
        print(f"❌ Error: File not found: {args.data_file}")
        return 1
    except json.JSONDecodeError:
        print(f"❌ Error: Invalid JSON format in {args.data_file}")
        return 1
    
    print(f"✅ Loaded {len(episodes)} episodes")
    
    # Create output directory
    os.makedirs(args.output_dir, exist_ok=True)
    
    # Generate plots
    print(f"\n📊 Generating visualizations...")
    plot_episode_rewards(episodes, f"{args.output_dir}/rewards.{args.format}")
    plot_steps_per_episode(episodes, f"{args.output_dir}/steps.{args.format}")
    plot_action_distribution(episodes, f"{args.output_dir}/actions.{args.format}")
    plot_reward_distribution(episodes, f"{args.output_dir}/reward_dist.{args.format}")
    plot_task_performance(episodes, f"{args.output_dir}/task_performance.{args.format}")
    
    # Generate summary
    generate_summary_stats(episodes)
    
    print(f"✅ All plots saved to: {args.output_dir}")
    return 0


if __name__ == "__main__":
    exit(main())
