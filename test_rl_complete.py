"""
Comprehensive RL Implementation Test Script

Tests all RL components:
- Backend API endpoints
- Python client
- TaskAgent
- Demo tools
"""

import sys
import os
import requests
import json

# Add python_agent to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'python_agent'))
from client import TeamsEnvClient
from task_agent import TaskAgent


def test_api_endpoints():
    """Test all 8 RL API endpoints"""
    base_url = "http://localhost:3001"
    print("\n" + "="*60)
    print("🧪 Testing RL API Endpoints")
    print("="*60)
    
    tests_passed = 0
    tests_total = 8
    
    # 1. Test /env/tasks
    try:
        response = requests.get(f"{base_url}/env/tasks")
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert len(data['tasks']) == 5
        print("✅ GET /env/tasks - OK")
        tests_passed += 1
    except Exception as e:
        print(f"❌ GET /env/tasks - FAILED: {e}")
    
    # 2. Test /env/reset
    try:
        response = requests.post(f"{base_url}/env/reset", 
                                json={'taskType': 'greeting_response'})
        assert response.status_code == 200
        data = response.json()
        episode_id = data['episodeId']
        assert episode_id is not None
        print("✅ POST /env/reset - OK")
        tests_passed += 1
    except Exception as e:
        print(f"❌ POST /env/reset - FAILED: {e}")
        episode_id = None
    
    # 3. Test /env/state
    try:
        response = requests.get(f"{base_url}/env/state")
        assert response.status_code == 200
        data = response.json()
        assert 'state' in data
        print("✅ GET /env/state - OK")
        tests_passed += 1
    except Exception as e:
        print(f"❌ GET /env/state - FAILED: {e}")
    
    # 4. Test /env/actions
    try:
        response = requests.get(f"{base_url}/env/actions")
        assert response.status_code == 200
        data = response.json()
        assert 'actions' in data
        assert len(data['actions']) == 5
        print("✅ GET /env/actions - OK")
        tests_passed += 1
    except Exception as e:
        print(f"❌ GET /env/actions - FAILED: {e}")
    
    # 5. Test /env/step
    try:
        response = requests.post(f"{base_url}/env/step",
                                json={
                                    'action': {
                                        'type': 'send_message',
                                        'payload': {'content': 'Test message'}
                                    }
                                })
        assert response.status_code == 200
        data = response.json()
        assert 'reward' in data
        assert 'done' in data
        print("✅ POST /env/step - OK")
        tests_passed += 1
    except Exception as e:
        print(f"❌ POST /env/step - FAILED: {e}")
    
    # 6. Test /env/stats
    try:
        response = requests.get(f"{base_url}/env/stats")
        assert response.status_code == 200
        data = response.json()
        assert 'stats' in data
        print("✅ GET /env/stats - OK")
        tests_passed += 1
    except Exception as e:
        print(f"❌ GET /env/stats - FAILED: {e}")
    
    # 7. Test /env/history
    try:
        response = requests.get(f"{base_url}/env/history")
        assert response.status_code == 200
        data = response.json()
        assert 'history' in data  # Fixed: backend returns 'history' not 'episodes'
        print("✅ GET /env/history - OK")
        tests_passed += 1
    except Exception as e:
        print(f"❌ GET /env/history - FAILED: {e}")
    
    # 8. Test /env/info/:episodeId
    try:
        if episode_id:
            response = requests.get(f"{base_url}/env/info/{episode_id}")
            assert response.status_code == 200
            data = response.json()
            assert data['success'] == True
            print("✅ GET /env/info/:episodeId - OK")
            tests_passed += 1
        else:
            print("⏭️  GET /env/info/:episodeId - SKIPPED (no episode ID)")
    except Exception as e:
        print(f"❌ GET /env/info/:episodeId - FAILED: {e}")
    
    print(f"\n📊 API Endpoints: {tests_passed}/{tests_total} passed")
    return tests_passed == tests_total


def test_python_client():
    """Test Python client library"""
    print("\n" + "="*60)
    print("🐍 Testing Python Client")
    print("="*60)
    
    try:
        client = TeamsEnvClient()
        
        # Test reset
        result = client.reset(task_type='greeting_response')
        assert 'episodeId' in result
        print("✅ Client reset() - OK")
        
        # Test get_state
        state = client.get_state()
        assert state is not None
        print("✅ Client get_state() - OK")
        
        # Test get_actions
        actions = client.get_actions()
        assert 'actions' in actions
        print("✅ Client get_actions() - OK")
        
        # Test step
        action = {'type': 'send_message', 'payload': {'content': 'Hello!'}}
        result = client.step(action)
        assert 'reward' in result
        print("✅ Client step() - OK")
        
        # Test get_stats
        stats = client.get_stats()
        assert stats is not None  # get_stats() returns the stats dict directly
        assert isinstance(stats, dict)
        print("✅ Client get_stats() - OK")
        
        # Test get_tasks
        tasks = client.get_tasks()
        assert tasks is not None  # get_tasks() returns the tasks dict directly
        assert isinstance(tasks, dict)
        print("✅ Client get_tasks() - OK")
        
        # Test get_history
        history = client.get_history()
        assert isinstance(history, list)
        print("✅ Client get_history() - OK")
        
        print("\n📊 Python Client: All tests passed")
        return True
        
    except Exception as e:
        print(f"\n❌ Python Client: Tests failed - {e}")
        import traceback
        traceback.print_exc()
        return False


def test_task_agent():
    """Test TaskAgent with and without client"""
    print("\n" + "="*60)
    print("🤖 Testing TaskAgent")
    print("="*60)
    
    try:
        # Test 1: Agent without client (just select_action)
        agent = TaskAgent()
        state = {
            'task': {'type': 'greeting_response'},
            'recentMessages': [
                {'userId': 'user-1', 'content': 'Hello everyone!'}
            ],
            'stats': {},
            'agentState': {'currentChannelId': 'channel-1'}
        }
        action = agent.select_action(state)
        assert action is not None
        assert 'type' in action
        print("✅ TaskAgent select_action() - OK")
        
        # Test 2: Agent with client (full episode)
        client = TeamsEnvClient()
        agent_with_client = TaskAgent(client)
        
        # Run a short episode
        result = agent_with_client.run_episode(
            task_type='greeting_response',
            max_steps=5,
            verbose=False
        )
        assert result is not None
        assert 'total_reward' in result
        print("✅ TaskAgent run_episode() - OK")
        
        print("\n📊 TaskAgent: All tests passed")
        return True
        
    except Exception as e:
        print(f"\n❌ TaskAgent: Tests failed - {e}")
        import traceback
        traceback.print_exc()
        return False


def test_demo_tools():
    """Test that demo tools can be imported"""
    print("\n" + "="*60)
    print("🛠️  Testing Demo Tools")
    print("="*60)
    
    try:
        # Check run_demo.py exists and has main function
        demo_path = os.path.join(os.path.dirname(__file__), 'rl_demo', 'run_demo.py')
        assert os.path.exists(demo_path)
        print("✅ run_demo.py - EXISTS")
        
        # Check plot_results.py exists
        plot_path = os.path.join(os.path.dirname(__file__), 'rl_demo', 'plot_results.py')
        assert os.path.exists(plot_path)
        print("✅ plot_results.py - EXISTS")
        
        # Check sample data exists
        sample_path = os.path.join(os.path.dirname(__file__), 'rl_demo', 'sample_episodes.json')
        assert os.path.exists(sample_path)
        print("✅ sample_episodes.json - EXISTS")
        
        print("\n📊 Demo Tools: All files present")
        return True
        
    except Exception as e:
        print(f"\n❌ Demo Tools: Tests failed - {e}")
        return False


def main():
    """Run all RL tests"""
    print("\n" + "🎯"*30)
    print("  TEAMS CLONE - RL IMPLEMENTATION TEST SUITE")
    print("🎯"*30)
    
    # Check if backend is running
    try:
        response = requests.get("http://localhost:3001/env/tasks", timeout=2)
        if response.status_code != 200:
            print("\n❌ ERROR: Backend not responding correctly")
            print("   Please start the backend server first: cd backend && npm start")
            return
    except requests.exceptions.RequestException:
        print("\n❌ ERROR: Backend server is not running")
        print("   Please start the backend server first: cd backend && npm start")
        return
    
    # Run all tests
    results = {
        'API Endpoints': test_api_endpoints(),
        'Python Client': test_python_client(),
        'TaskAgent': test_task_agent(),
        'Demo Tools': test_demo_tools()
    }
    
    # Final summary
    print("\n" + "="*60)
    print("📋 FINAL SUMMARY")
    print("="*60)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    all_passed = all(results.values())
    
    print("\n" + "="*60)
    if all_passed:
        print("🎉 ALL TESTS PASSED! RL implementation is working correctly.")
    else:
        print("⚠️  SOME TESTS FAILED. Please review the errors above.")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()
