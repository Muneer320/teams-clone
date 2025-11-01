# Call Management API Documentation

Complete guide for implementing audio and video calls in TeamsClone-RL.

## Table of Contents

- [Overview](#overview)
- [REST API Endpoints](#rest-api-endpoints)
- [Socket.IO Events](#socketio-events)
- [WebRTC Signaling](#webrtc-signaling)
- [Client Implementation](#client-implementation)

## Overview

The call system supports:

- ✅ **Audio calls** - Voice-only communication
- ✅ **Video calls** - Video + audio communication
- ✅ **Screen sharing** - Share your screen with participants
- ✅ **Call recording** - Record calls (simulated)
- ✅ **Media controls** - Toggle audio/video on/off
- ✅ **Multi-party calls** - Multiple participants in one call
- ✅ **WebRTC signaling** - Peer-to-peer connection setup

## REST API Endpoints

Base URL: `http://localhost:3001/calls`

### Create Call

Create a new audio or video call in a channel.

**Endpoint:** `POST /calls/create`

**Request Body:**

```json
{
  "type": "audio", // "audio" or "video"
  "channelId": "channel-1", // Channel ID
  "userId": "user-1", // Initiator user ID
  "userName": "Alice", // Initiator name
  "participants": [
    // Optional: pre-invite users
    {
      "id": "user-2",
      "name": "Bob"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "call": {
    "id": "call-uuid",
    "type": "audio",
    "channelId": "channel-1",
    "initiator": {
      "id": "user-1",
      "name": "Alice",
      "status": "connected"
    },
    "participants": [],
    "status": "active",
    "startTime": 1698765432000,
    "endTime": null,
    "recording": false,
    "screenSharing": null
  },
  "message": "Audio call created successfully"
}
```

**Status Codes:**

- `200` - Call created
- `400` - Invalid parameters
- `409` - Call already active in channel
- `500` - Server error

---

### Join Call

Join an existing call.

**Endpoint:** `POST /calls/:callId/join`

**Request Body:**

```json
{
  "userId": "user-2",
  "userName": "Bob"
}
```

**Response:**

```json
{
  "success": true,
  "call": { ... },
  "message": "Joined call successfully"
}
```

---

### Leave Call

Leave a call.

**Endpoint:** `POST /calls/:callId/leave`

**Request Body:**

```json
{
  "userId": "user-2"
}
```

**Response:**

```json
{
  "success": true,
  "call": { ... },
  "message": "Left call successfully"
}
```

---

### End Call

End a call (initiator only).

**Endpoint:** `POST /calls/:callId/end`

**Response:**

```json
{
  "success": true,
  "call": { ... },
  "message": "Call ended successfully"
}
```

---

### Toggle Audio

Mute/unmute audio.

**Endpoint:** `POST /calls/:callId/toggle-audio`

**Request Body:**

```json
{
  "userId": "user-1",
  "enabled": false // true = unmute, false = mute
}
```

**Response:**

```json
{
  "success": true,
  "call": { ... },
  "message": "Audio disabled"
}
```

---

### Toggle Video

Turn video on/off.

**Endpoint:** `POST /calls/:callId/toggle-video`

**Request Body:**

```json
{
  "userId": "user-1",
  "enabled": true // true = video on, false = video off
}
```

---

### Screen Share

Start/stop screen sharing.

**Endpoint:** `POST /calls/:callId/screen-share`

**Request Body:**

```json
{
  "userId": "user-1",
  "enabled": true // true = start, false = stop
}
```

---

### Toggle Recording

Start/stop call recording.

**Endpoint:** `POST /calls/:callId/toggle-recording`

**Request Body:**

```json
{
  "enabled": true // true = start recording, false = stop
}
```

---

### Get Call Details

Get information about a specific call.

**Endpoint:** `GET /calls/:callId`

**Response:**

```json
{
  "success": true,
  "call": {
    "id": "call-uuid",
    "type": "video",
    "channelId": "channel-1",
    "initiator": { ... },
    "participants": [
      {
        "id": "user-2",
        "name": "Bob",
        "status": "connected",
        "joinedAt": 1698765432000,
        "audio": true,
        "video": true
      }
    ],
    "status": "active",
    "recording": false,
    "screenSharing": null
  }
}
```

---

### Get Call by Channel

Get active call in a specific channel.

**Endpoint:** `GET /calls/channel/:channelId`

**Response:**

```json
{
  "success": true,
  "call": { ... } // or null if no active call
}
```

---

### Get User's Call

Get the call a user is currently in.

**Endpoint:** `GET /calls/user/:userId`

**Response:**

```json
{
  "success": true,
  "call": { ... } // or null if not in any call
}
```

---

### Get Active Calls

Get all active calls.

**Endpoint:** `GET /calls/`

**Response:**

```json
{
  "success": true,
  "calls": [ ... ],
  "count": 2
}
```

---

### Get Call Statistics

Get statistics for a call.

**Endpoint:** `GET /calls/:callId/stats`

**Response:**

```json
{
  "success": true,
  "stats": {
    "callId": "call-uuid",
    "type": "video",
    "duration": 120, // seconds
    "participantCount": 3,
    "status": "active",
    "recording": false,
    "screenSharing": false
  }
}
```

---

## Socket.IO Events

Real-time events for call management and WebRTC signaling.

### Client → Server Events

#### Join Call Room

```javascript
socket.emit("call:join-room", {
  callId: "call-uuid",
  userId: "user-1",
  userName: "Alice",
});
```

#### Leave Call Room

```javascript
socket.emit("call:leave-room", {
  callId: "call-uuid",
  userId: "user-1",
});
```

#### Send WebRTC Offer

```javascript
socket.emit("call:offer", {
  callId: "call-uuid",
  targetUserId: "user-2",
  offer: rtcOffer, // WebRTC offer object
});
```

#### Send WebRTC Answer

```javascript
socket.emit("call:answer", {
  callId: "call-uuid",
  targetUserId: "user-1",
  answer: rtcAnswer, // WebRTC answer object
});
```

#### Send ICE Candidate

```javascript
socket.emit("call:ice-candidate", {
  callId: "call-uuid",
  targetUserId: "user-2",
  candidate: iceCandidate,
});
```

#### Toggle Audio

```javascript
socket.emit("call:toggle-audio", {
  callId: "call-uuid",
  userId: "user-1",
  enabled: false,
});
```

#### Toggle Video

```javascript
socket.emit("call:toggle-video", {
  callId: "call-uuid",
  userId: "user-1",
  enabled: true,
});
```

#### Start Screen Share

```javascript
socket.emit("call:start-screen-share", {
  callId: "call-uuid",
  userId: "user-1",
});
```

#### Stop Screen Share

```javascript
socket.emit("call:stop-screen-share", {
  callId: "call-uuid",
});
```

#### End Call

```javascript
socket.emit("call:end", {
  callId: "call-uuid",
});
```

---

### Server → Client Events

#### User Joined

```javascript
socket.on("call:user-joined", ({ userId, userName, socketId }) => {
  console.log(`${userName} joined the call`);
  // Initiate WebRTC connection with this user
});
```

#### User Left

```javascript
socket.on("call:user-left", ({ userId, socketId }) => {
  console.log(`${userId} left the call`);
  // Close WebRTC connection with this user
});
```

#### Current Participants

```javascript
socket.on("call:current-participants", ({ initiator, participants }) => {
  console.log("Current participants:", participants);
  // Initiate connections with existing participants
});
```

#### Offer Received

```javascript
socket.on("call:offer-received", ({ fromUserId, offer }) => {
  // Handle incoming WebRTC offer
  // Create answer and send back
});
```

#### Answer Received

```javascript
socket.on("call:answer-received", ({ fromUserId, answer }) => {
  // Handle incoming WebRTC answer
  // Complete connection setup
});
```

#### ICE Candidate Received

```javascript
socket.on("call:ice-candidate-received", ({ fromUserId, candidate }) => {
  // Add ICE candidate to peer connection
});
```

#### Audio Toggled

```javascript
socket.on("call:audio-toggled", ({ userId, enabled }) => {
  console.log(`${userId} ${enabled ? "unmuted" : "muted"}`);
});
```

#### Video Toggled

```javascript
socket.on("call:video-toggled", ({ userId, enabled }) => {
  console.log(`${userId} turned video ${enabled ? "on" : "off"}`);
});
```

#### Screen Share Started

```javascript
socket.on("call:screen-share-started", ({ userId }) => {
  console.log(`${userId} started sharing screen`);
});
```

#### Screen Share Stopped

```javascript
socket.on("call:screen-share-stopped", () => {
  console.log("Screen sharing stopped");
});
```

#### Call Ended

```javascript
socket.on("call:ended", () => {
  console.log("Call has ended");
  // Clean up WebRTC connections
});
```

#### Error

```javascript
socket.on("call:error", ({ message }) => {
  console.error("Call error:", message);
});
```

---

## WebRTC Signaling

The call system uses WebRTC for peer-to-peer audio/video transmission. The backend provides signaling to help clients establish connections.

### Connection Flow

```
User A                    Server                    User B
  |                         |                         |
  |--- create call -------->|                         |
  |<-- call created --------|                         |
  |                         |                         |
  |--- join room ---------->|                         |
  |                         |--- user-joined -------->|
  |                         |                         |
  |--- offer -------------->|                         |
  |                         |--- offer-received ----->|
  |                         |                         |
  |                         |<-- answer --------------|
  |<-- answer-received -----|                         |
  |                         |                         |
  |--- ice-candidate ------>|                         |
  |                         |--- ice-candidate ------>|
  |                         |                         |
  [WebRTC Direct Connection Established]
  |<==========Audio/Video Data==========>|
```

### Basic WebRTC Setup (Client-Side)

```javascript
// 1. Create peer connection
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

// 2. Add local media stream
const localStream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
});
localStream.getTracks().forEach((track) => {
  peerConnection.addTrack(track, localStream);
});

// 3. Handle ICE candidates
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit("call:ice-candidate", {
      callId,
      targetUserId,
      candidate: event.candidate,
    });
  }
};

// 4. Handle remote stream
peerConnection.ontrack = (event) => {
  remoteVideo.srcObject = event.streams[0];
};

// 5. Create and send offer (initiator)
const offer = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);
socket.emit("call:offer", { callId, targetUserId, offer });

// 6. Handle offer (receiver)
socket.on("call:offer-received", async ({ fromUserId, offer }) => {
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit("call:answer", { callId, targetUserId: fromUserId, answer });
});

// 7. Handle answer (initiator)
socket.on("call:answer-received", async ({ answer }) => {
  await peerConnection.setRemoteDescription(answer);
});

// 8. Handle ICE candidates
socket.on("call:ice-candidate-received", async ({ candidate }) => {
  await peerConnection.addIceCandidate(candidate);
});
```

---

## Client Implementation

### Example: Creating and Joining a Call

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");
const callId = "call-uuid";

// Create call
async function createCall() {
  const response = await fetch("http://localhost:3001/calls/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "video",
      channelId: "channel-1",
      userId: "user-1",
      userName: "Alice",
    }),
  });

  const data = await response.json();
  const callId = data.call.id;

  // Join call room
  socket.emit("call:join-room", {
    callId,
    userId: "user-1",
    userName: "Alice",
  });

  return callId;
}

// Join existing call
async function joinCall(callId) {
  const response = await fetch(`http://localhost:3001/calls/${callId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: "user-2",
      userName: "Bob",
    }),
  });

  socket.emit("call:join-room", {
    callId,
    userId: "user-2",
    userName: "Bob",
  });
}

// Toggle audio
async function toggleAudio(enabled) {
  const response = await fetch(
    `http://localhost:3001/calls/${callId}/toggle-audio`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "user-1",
        enabled,
      }),
    }
  );

  // Also toggle local audio track
  localStream.getAudioTracks()[0].enabled = enabled;
}

// Leave call
async function leaveCall() {
  await fetch(`http://localhost:3001/calls/${callId}/leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: "user-1" }),
  });

  socket.emit("call:leave-room", { callId, userId: "user-1" });

  // Close peer connections
  peerConnections.forEach((pc) => pc.close());
}
```

---

## Testing Endpoints

### cURL Examples

```bash
# Create audio call
curl -X POST http://localhost:3001/calls/create \
  -H "Content-Type: application/json" \
  -d '{
    "type": "audio",
    "channelId": "channel-1",
    "userId": "user-1",
    "userName": "Alice"
  }'

# Join call
curl -X POST http://localhost:3001/calls/CALL_ID/join \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-2",
    "userName": "Bob"
  }'

# Get call details
curl http://localhost:3001/calls/CALL_ID

# Get active calls
curl http://localhost:3001/calls/

# Toggle audio
curl -X POST http://localhost:3001/calls/CALL_ID/toggle-audio \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-1",
    "enabled": false
  }'

# End call
curl -X POST http://localhost:3001/calls/CALL_ID/end
```

---

## Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common errors:

- `400` - Bad Request (missing/invalid parameters)
- `404` - Not Found (call doesn't exist)
- `409` - Conflict (call already active)
- `500` - Internal Server Error

---

## Best Practices

1. **Always join call room** - Join Socket.IO room before initiating WebRTC
2. **Handle cleanup** - Close peer connections on leave/disconnect
3. **Error handling** - Listen for `call:error` events
4. **ICE candidates** - Buffer candidates received before remote description
5. **Media permissions** - Request camera/mic access before joining
6. **Network resilience** - Implement reconnection logic
7. **UI feedback** - Show connection states to users

---

For complete examples and frontend integration, see the `frontend/src/components/CallModal.jsx` component.
