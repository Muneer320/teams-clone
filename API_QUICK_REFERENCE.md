# API Quick Reference Guide

Complete list of all 42 endpoints with correct request formats.

---

## RL Environment API (9 endpoints)

### 1. Get All Tasks

```http
GET /env/tasks
```

**Response:** Array of 5 task definitions (greeting_response, channel_explorer, etc.)

### 2. Reset Environment (Start New Episode)

```http
POST /env/reset
Content-Type: application/json

{}
```

**Response:** `{ episodeId, state, taskId, ... }`

### 3. Get Current State

```http
GET /env/state
```

**Response:** Current environment state with channels, messages, users

### 4. Get Available Actions

```http
GET /env/actions
```

**Response:** Array of available action types

### 5. Execute Action

```http
POST /env/step
Content-Type: application/json

{
  "action": {
    "type": "send_message",
    "payload": {
      "channelId": "general",
      "content": "Hello world"
    }
  }
}
```

**Response:** `{ state, reward, done, taskCompleted, info }`

### 6. Get Episode Stats

```http
GET /env/stats
```

**Response:** Current episode statistics

### 7. Get Episode Info

```http
GET /env/info/:episodeId
```

**Response:** Detailed episode information

### 8. Get Episode History

```http
GET /env/history
```

**Response:** Array of all past episodes

---

## Calendar API (20 endpoints)

### 1. Create Meeting

```http
POST /calendar/meetings/create
Content-Type: application/json

{
  "title": "Team Meeting",
  "description": "Weekly sync",
  "organizerId": "user1",
  "organizerName": "John Doe",
  "channelId": "general",
  "startTime": "2024-03-15T10:00:00Z",
  "endTime": "2024-03-15T11:00:00Z",
  "attendees": ["user2", "user3"],
  "isOnline": true,
  "location": "Conference Room A"
}
```

### 2. Get Meeting by ID

```http
GET /calendar/meetings/:meetingId
```

### 3. Update Meeting

```http
PUT /calendar/meetings/:meetingId
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

### 4. Delete Meeting

```http
DELETE /calendar/meetings/:meetingId
```

### 5. Cancel Meeting

```http
POST /calendar/meetings/:meetingId/cancel
Content-Type: application/json

{
  "reason": "No longer needed"
}
```

### 6. Respond to Meeting (RSVP)

```http
POST /calendar/meetings/:meetingId/respond
Content-Type: application/json

{
  "userId": "user2",
  "response": "accepted"
}
```

**Valid responses:** `"accepted"`, `"declined"`, `"tentative"`  
**Note:** userId must be in meeting's attendees list

### 7. Get User's Meetings

```http
GET /calendar/meetings/user/:userId
```

### 8. Get Channel Meetings

```http
GET /calendar/meetings/channel/:channelId
```

### 9. Get Upcoming Meetings

```http
GET /calendar/meetings/upcoming/:userId
```

### 10. Get All Meetings

```http
GET /calendar/meetings
```

### 11. Check Availability

```http
POST /calendar/availability/check
Content-Type: application/json

{
  "userId": "user1",
  "startTime": "2024-03-15T10:00:00Z",
  "endTime": "2024-03-15T11:00:00Z"
}
```

### 12. Find Available Slots

```http
POST /calendar/availability/find-slots
Content-Type: application/json

{
  "userIds": ["user1", "user2"],
  "date": "2024-03-15",
  "duration": 60
}
```

### 13. Set Availability

```http
POST /calendar/availability/set
Content-Type: application/json

{
  "userId": "user1",
  "date": "2024-03-15",
  "slots": [
    { "start": "09:00", "end": "12:00" },
    { "start": "13:00", "end": "17:00" }
  ]
}
```

### 14. Get User Availability

```http
GET /calendar/availability/:userId
```

### 15. Create Reminder

```http
POST /calendar/reminders/create
Content-Type: application/json

{
  "meetingId": "meeting-id",
  "userId": "user1",
  "reminderTime": "2024-03-15T09:45:00Z",
  "type": "email"
}
```

### 16. Get Due Reminders

```http
GET /calendar/reminders/due
```

### 17. Mark Reminder Sent

```http
POST /calendar/reminders/:reminderId/mark-sent
Content-Type: application/json

{}
```

### 18. Add Meeting Notes

```http
POST /calendar/meetings/:meetingId/notes
Content-Type: application/json

{
  "notes": "Discussion points:\n- Project status\n- Next steps"
}
```

### 19. Add Meeting Attachments

```http
POST /calendar/meetings/:meetingId/attachments
Content-Type: application/json

{
  "name": "agenda.pdf",
  "url": "https://storage.example.com/agenda.pdf",
  "type": "application/pdf",
  "size": 102400
}
```

### 20. Get Calendar Stats

```http
GET /calendar/stats/:userId
```

---

## Calls API (13 endpoints)

### 1. Create/Start Call

```http
POST /calls/create
Content-Type: application/json

{
  "type": "video",
  "channelId": "general",
  "userId": "user1",
  "userName": "John Doe"
}
```

**Valid types:** `"audio"`, `"video"`

### 2. Join Call

```http
POST /calls/:callId/join
Content-Type: application/json

{
  "userId": "user2",
  "userName": "Jane Smith"
}
```

### 3. Leave Call

```http
POST /calls/:callId/leave
Content-Type: application/json

{
  "userId": "user2"
}
```

### 4. End Call

```http
POST /calls/:callId/end
Content-Type: application/json

{
  "userId": "user1"
}
```

### 5. Toggle Audio

```http
POST /calls/:callId/toggle-audio
Content-Type: application/json

{
  "userId": "user1",
  "enabled": true
}
```

### 6. Toggle Video

```http
POST /calls/:callId/toggle-video
Content-Type: application/json

{
  "userId": "user1",
  "enabled": true
}
```

### 7. Screen Share

```http
POST /calls/:callId/screen-share
Content-Type: application/json

{
  "userId": "user1",
  "enabled": true
}
```

### 8. Toggle Recording

```http
POST /calls/:callId/toggle-recording
Content-Type: application/json

{
  "userId": "user1"
}
```

### 9. Get Call Details

```http
GET /calls/:callId
```

### 10. Get Calls by Channel

```http
GET /calls/channel/:channelId
```

### 11. Get Calls by User

```http
GET /calls/user/:userId
```

### 12. Get All Active Calls

```http
GET /calls
```

### 13. Get Call Stats

```http
GET /calls/:callId/stats
```

---

## Common Patterns

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

### Timestamps

All timestamps use ISO 8601 format: `"2024-03-15T10:00:00Z"`

### IDs

All IDs are UUIDs: `"12629a72-97d7-45ed-9c04-049dd8594b6b"`

---