"""Exercise the running backend's account, chat, activity and episode routes."""

from uuid import uuid4
import requests

BASE = "http://127.0.0.1:3001"


def call(method, path, **kwargs):
    return requests.request(method, BASE + path, timeout=10, **kwargs)


def main():
    suffix = uuid4().hex[:12]
    first, second = f"first-{suffix}@example.test", f"second-{suffix}@example.test"
    tokens = []
    for email in (first, second):
        result = call("POST", "/auth/register", json={
            "email": email, "password": "demo-pass-123", "name": "Demo User"})
        result.raise_for_status()
        tokens.append(result.json()["token"])
    one = {"Authorization": f"Bearer {tokens[0]}"}
    two = {"Authorization": f"Bearer {tokens[1]}"}
    payload = {"sender_email": first, "receiver_email": second,
               "message": "Hello from the automated local demo"}
    assert call("POST", "/api/messages/", json=payload).status_code == 401
    assert call("POST", "/api/messages/", headers=two, json=payload).status_code == 403
    assert call("POST", "/api/messages/", headers=one, json=payload).status_code == 200
    inbox = call("GET", f"/api/messages/{first}/{second}", headers=two)
    inbox.raise_for_status()
    assert any(item["message"] == payload["message"] for item in inbox.json()["messages"])
    activity = call("GET", "/activity/", headers=two)
    activity.raise_for_status()
    assert any(item["title"] == "New message" for item in activity.json()["activities"])
    assert call("POST", "/env/reset", json={"taskType": "missing"}).status_code == 400
    first_episode = call("POST", "/env/reset", json={"taskType": "channel_explorer"}).json()["episodeId"]
    second_episode = call("POST", "/env/reset", json={"taskType": "meeting_joiner"}).json()["episodeId"]
    state = call("GET", "/env/state", params={"episodeId": first_episode}).json()["state"]
    assert state["episodeId"] == first_episode != second_episode
    print("Account, private chat, activity and scoped episode API passed")


if __name__ == "__main__":
    main()
