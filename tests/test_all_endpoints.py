"""
Comprehensive Endpoint Testing Script
Tests all available endpoints and validates their responses
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:3001"


def print_header(title):
    print(f"\n{'='*80}")
    print(f"  {title}")
    print('='*80)


def test_endpoint(method, endpoint, data=None, expected_status=200, description=""):
    """Test a single endpoint"""
    url = f"{BASE_URL}{endpoint}"

    print(f"\n[{method}] {endpoint}")
    if description:
        print(f"Description: {description}")

    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        elif method == "PUT":
            response = requests.put(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)

        print(f"Status: {response.status_code} (Expected: {expected_status})")

        if response.status_code == expected_status:
            print("✓ Status OK")
        else:
            print(f"✗ Status MISMATCH")

        # Parse and display response
        try:
            resp_json = response.json()
            print(f"Response:")
            print(json.dumps(resp_json, indent=2)[:500])  # First 500 chars
            return resp_json
        except:
            print(f"Response (text): {response.text[:200]}")
            return None

    except Exception as e:
        print(f"✗ ERROR: {e}")
        return None

# ============================================================================
# RL ENVIRONMENT ENDPOINTS
# ============================================================================


def test_rl_endpoints():
    print_header("RL ENVIRONMENT ENDPOINTS")

    # 1. GET /env/tasks
    print("\n" + "-"*80)
    tasks = test_endpoint(
        "GET", "/env/tasks",
        description="Get all available task definitions"
    )

    # 2. POST /env/reset
    print("\n" + "-"*80)
    reset_data = test_endpoint(
        "POST", "/env/reset",
        data={"taskType": "greeting_response"},
        description="Reset environment and start new episode"
    )

    episode_id = None
    if reset_data and 'episodeId' in reset_data:
        episode_id = reset_data['episodeId']
        print(f"✓ Episode ID captured: {episode_id}")

    # 3. GET /env/state
    print("\n" + "-"*80)
    state = test_endpoint(
        "GET", "/env/state",
        description="Get current environment state"
    )

    # 4. GET /env/actions
    print("\n" + "-"*80)
    actions = test_endpoint(
        "GET", "/env/actions",
        description="Get available actions"
    )

    # 5. POST /env/step
    print("\n" + "-"*80)
    step_result = test_endpoint(
        "POST", "/env/step",
        data={
            "action": {
                "type": "send_message",
                "payload": {"content": "Hello team!"}
            },
            "episodeId": episode_id
        },
        description="Execute an action in the environment"
    )

    # 6. GET /env/stats
    print("\n" + "-"*80)
    stats = test_endpoint(
        "GET", f"/env/stats?episodeId={episode_id}",
        description="Get episode statistics"
    )

    # 7. GET /env/info/:episodeId
    if episode_id:
        print("\n" + "-"*80)
        info = test_endpoint(
            "GET", f"/env/info/{episode_id}",
            description="Get detailed episode information"
        )

    # 8. GET /env/history
    print("\n" + "-"*80)
    history = test_endpoint(
        "GET", "/env/history?limit=5",
        description="Get episode history"
    )

# ============================================================================
# CALENDAR ENDPOINTS
# ============================================================================


def test_calendar_endpoints():
    print_header("CALENDAR ENDPOINTS")

    # 1. GET /calendar/meetings
    print("\n" + "-"*80)
    meetings = test_endpoint(
        "GET", "/calendar/meetings",
        description="Get all meetings"
    )
    print(f"Expected: Array of meetings")
    print(f"Actual: {type(meetings.get('meetings') if meetings else None)}")
    if meetings and 'meetings' in meetings:
        print(f"Number of meetings: {len(meetings['meetings'])}")

    # 2. POST /calendar/meetings/create
    print("\n" + "-"*80)
    tomorrow = (datetime.now() + timedelta(days=1)).isoformat()
    new_meeting = test_endpoint(
        "POST", "/calendar/meetings/create",
        data={
            "title": "Test Meeting",
            "startTime": tomorrow,
            "endTime": (datetime.now() + timedelta(days=1, hours=1)).isoformat(),
            "organizerId": "user1",
            "organizerName": "Test User",
            "attendees": [
                {"id": "user1", "name": "Test User", "email": "user1@test.com"},
                {"id": "user2", "name": "Test User 2", "email": "user2@test.com"}
            ],
            "description": "Test meeting description",
            "channelId": "channel-1"
        },
        description="Create a new meeting"
    )

    meeting_id = None
    if new_meeting and 'meeting' in new_meeting:
        meeting_id = new_meeting['meeting'].get('id')
        print(f"✓ Meeting ID captured: {meeting_id}")

    # 3. GET /calendar/meetings/:id
    if meeting_id:
        print("\n" + "-"*80)
        single_meeting = test_endpoint(
            "GET", f"/calendar/meetings/{meeting_id}",
            description="Get single meeting by ID"
        )

    # 4. PUT /calendar/meetings/:id
    if meeting_id:
        print("\n" + "-"*80)
        updated_meeting = test_endpoint(
            "PUT", f"/calendar/meetings/{meeting_id}",
            data={
                "title": "Updated Test Meeting",
                "description": "Updated description"
            },
            description="Update a meeting"
        )

    # 5. GET /calendar/meetings/user/:userId
    print("\n" + "-"*80)
    user_meetings = test_endpoint(
        "GET", "/calendar/meetings/user/user1",
        description="Get meetings for a specific user"
    )

    # 6. GET /calendar/meetings/channel/:channelId
    print("\n" + "-"*80)
    channel_meetings = test_endpoint(
        "GET", "/calendar/meetings/channel/channel-1",
        description="Get meetings for a specific channel"
    )

    # 7. GET /calendar/meetings (with date range filters)
    print("\n" + "-"*80)
    range_meetings = test_endpoint(
        "GET", f"/calendar/meetings?startDate={datetime.now().isoformat()}&endDate={(datetime.now() + timedelta(days=7)).isoformat()}",
        description="Get meetings in date range"
    )

    # 8. POST /calendar/meetings/:id/respond
    if meeting_id:
        print("\n" + "-"*80)
        rsvp = test_endpoint(
            "POST", f"/calendar/meetings/{meeting_id}/respond",
            data={
                "userId": "user1",
                "response": "accepted"
            },
            description="RSVP to a meeting"
        )

    # 9. DELETE /calendar/meetings/:id
    if meeting_id:
        print("\n" + "-"*80)
        deleted = test_endpoint(
            "DELETE", f"/calendar/meetings/{meeting_id}",
            description="Delete a meeting"
        )

# ============================================================================
# CALLS ENDPOINTS
# ============================================================================


def test_calls_endpoints():
    print_header("CALLS ENDPOINTS")

    # 1. GET /calls
    print("\n" + "-"*80)
    all_calls = test_endpoint(
        "GET", "/calls",
        description="Get all active calls"
    )

    # 2. POST /calls/create
    print("\n" + "-"*80)
    new_call = test_endpoint(
        "POST", "/calls/create",
        data={
            "type": "video",
            "channelId": "channel-1",
            "userId": "user1",
            "userName": "Test User",
            "participants": []
        },
        description="Start a new call"
    )

    call_id = None
    if new_call and 'call' in new_call:
        call_id = new_call['call'].get('id')
        print(f"✓ Call ID captured: {call_id}")

    # 3. GET /calls/:callId
    if call_id:
        print("\n" + "-"*80)
        single_call = test_endpoint(
            "GET", f"/calls/{call_id}",
            description="Get single call by ID"
        )

    # 4. POST /calls/:callId/join
    if call_id:
        print("\n" + "-"*80)
        join_call = test_endpoint(
            "POST", f"/calls/{call_id}/join",
            data={
                "userId": "user2",
                "userName": "Test User 2"
            },
            description="Join a call"
        )

    # 5. POST /calls/:callId/leave
    if call_id:
        print("\n" + "-"*80)
        leave_call = test_endpoint(
            "POST", f"/calls/{call_id}/leave",
            data={"userId": "user2"},
            description="Leave a call"
        )

    # 6. GET /calls/channel/:channelId
    print("\n" + "-"*80)
    channel_calls = test_endpoint(
        "GET", "/calls/channel/channel-1",
        description="Get calls for a specific channel"
    )

    # 7. GET /calls/user/:userId
    print("\n" + "-"*80)
    user_calls = test_endpoint(
        "GET", "/calls/user/user1",
        description="Get calls for a specific user"
    )

    # 8. POST /calls/:callId/end
    if call_id:
        print("\n" + "-"*80)
        end_call = test_endpoint(
            "POST", f"/calls/{call_id}/end",
            data={"userId": "user1"},
            description="End a call"
        )

# ============================================================================
# MAIN TEST RUNNER
# ============================================================================


def main():
    print("\n" + "="*80)
    print("  COMPREHENSIVE ENDPOINT TESTING")
    print(f"  Base URL: {BASE_URL}")
    print(f"  Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80)

    try:
        # Test RL endpoints
        test_rl_endpoints()

        # Test Calendar endpoints
        test_calendar_endpoints()

        # Test Calls endpoints
        test_calls_endpoints()

        print_header("TESTING COMPLETE")
        print("\n✓ All endpoint tests executed")
        print("\nReview the output above to identify any issues:")
        print("  - Status mismatches")
        print("  - Missing data in responses")
        print("  - Errors or exceptions")

    except KeyboardInterrupt:
        print("\n\nTesting interrupted by user.")
    except Exception as e:
        print(f"\n\nUnexpected error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
