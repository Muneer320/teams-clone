"""
RL Environment Test Suite

Run this to verify the RL environment is working properly.
"""

import requests
import json
import time


def test_rl_environment():
    """Test the RL environment"""
    base_url = 'http://localhost:3001/env'

    print("="*60)
    print("Testing Enhanced RL Environment")
    print("="*60)

    # Test 1: Get available tasks
    print("\n1. Getting available tasks...")
    response = requests.get(f'{base_url}/tasks')
    if response.status_code == 200:
        tasks = response.json()['tasks']
        print(f"✓ Found {len(tasks)} tasks:")
        # tasks is now a dict, not a list
        for task_id, task in tasks.items():
            print(f"  - {task['name']}: {task['description']}")
            print(
                f"    Max steps: {task['maxSteps']}, Reward: +{task['reward']}")
    else:
        print(f"✗ Failed: {response.status_code}")
        return False

    # Test 2: Reset with specific task
    print("\n2. Resetting environment with 'greeting_response' task...")
    response = requests.post(
        f'{base_url}/reset', json={'taskType': 'greeting_response'})
    if response.status_code == 200:
        data = response.json()
        episode_id = data['episodeId']
        task = data['task']
        state = data['state']
        print(f"✓ Episode started: {episode_id}")
        print(f"  Task: {task['name']}")
        print(f"  Current channel: {state['currentChannel']['name']}")
        print(f"  Recent messages: {len(state['recentMessages'])}")
    else:
        print(f"✗ Failed: {response.status_code}")
        return False

    # Test 3: Get available actions
    print("\n3. Getting available actions...")
    response = requests.get(f'{base_url}/actions')
    if response.status_code == 200:
        actions = response.json()['actions']
        print(f"✓ Found {len(actions)} action types:")
        for action in actions:
            print(f"  - {action['type']}: {action['description']}")
    else:
        print(f"✗ Failed: {response.status_code}")
        return False

    # Test 4: Execute actions
    print("\n4. Executing actions...")

    # Action 1: Send greeting response
    action1 = {
        'type': 'send_message',
        'payload': {'content': 'Hello! Thanks for the welcome! 👋'}
    }
    print(f"\n  Step 1: Sending greeting message...")
    response = requests.post(f'{base_url}/step', json={'action': action1})
    if response.status_code == 200:
        result = response.json()
        print(f"    ✓ Reward: {result['reward']:+.2f}")
        print(f"    Done: {result['done']}")
        if 'taskCompleted' in result['info']:
            print(
                f"    🎉 Task completed! Bonus: +{result['info']['taskReward']:.1f}")

    time.sleep(0.3)

    # Action 2: React to a message
    state_response = requests.get(f'{base_url}/state')
    state = state_response.json()['state']
    if state['recentMessages']:
        msg_id = state['recentMessages'][0]['id']
        action2 = {
            'type': 'react_to_message',
            'payload': {'messageId': msg_id, 'reaction': '👍'}
        }
        print(f"\n  Step 2: Reacting to message...")
        response = requests.post(f'{base_url}/step', json={'action': action2})
        if response.status_code == 200:
            result = response.json()
            print(f"    ✓ Reward: {result['reward']:+.2f}")
            print(f"    Done: {result['done']}")

    time.sleep(0.3)

    # Action 3: Switch channel
    action3 = {
        'type': 'switch_channel',
        'payload': {'channelId': 'channel-2'}
    }
    print(f"\n  Step 3: Switching to Random channel...")
    response = requests.post(f'{base_url}/step', json={'action': action3})
    if response.status_code == 200:
        result = response.json()
        print(f"    ✓ Reward: {result['reward']:+.2f}")
        print(
            f"    Current channel: {result['state']['currentChannel']['name']}")

    # Test 5: Get episode stats
    print("\n5. Getting episode statistics...")
    response = requests.get(f'{base_url}/stats')
    if response.status_code == 200:
        stats = response.json()['stats']
        print(f"✓ Episode stats:")
        print(f"  Steps: {stats['stepCount']}")
        print(f"  Total reward: {stats['totalReward']:.2f}")
        print(f"  Messages sent: {stats['messagesSent']}")
        print(f"  Channels switched: {stats['channelsSwitched']}")
        print(f"  Task completed: {stats['taskCompleted']}")

    # Test 6: Get episode info
    print("\n6. Getting episode information...")
    response = requests.get(f'{base_url}/info/{episode_id}')
    if response.status_code == 200:
        episode = response.json()['episode']
        print(f"✓ Episode info:")
        print(f"  ID: {episode['id']}")
        print(f"  Task: {episode['taskName']}")
        print(f"  Duration: {episode['duration']/1000:.1f}s")
        print(f"  Completed: {episode['done']}")

    print("\n" + "="*60)
    print("All tests passed! ✓")
    print("="*60)

    return True


if __name__ == "__main__":
    try:
        print("\nMake sure the backend server is running on http://localhost:3001")
        print("Waiting 2 seconds before starting tests...\n")
        time.sleep(2)

        success = test_rl_environment()

        if success:
            print("\n✓ RL Environment is working correctly!")
            print("\nNext steps:")
            print("  - Run python enhanced_agent.py to see intelligent agent in action")
            print("  - Modify task policies in enhanced_agent.py")
            print("  - Train your own RL agent using the environment")
        else:
            print("\n✗ Some tests failed. Check the backend server.")

    except requests.exceptions.ConnectionError:
        print("\n✗ Could not connect to backend server.")
        print("Make sure the server is running:")
        print("  cd backend")
        print("  npm start")
    except Exception as e:
        print(f"\n✗ Error: {e}")
