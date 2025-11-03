# Teams Clone - API Endpoints Reference# Complete API Endpoint List

## 🎯 Base URL**Total: 42 Endpoints**

```

http://localhost:3001## RL Environment API (9 endpoints) - All ✅

```

1. **GET /env/tasks** - Get all task definitions

## ✅ Working Endpoints (Verified)2. **POST /env/reset** - Start new episode

3. **GET /env/state** - Get current state

### 1. Health & Info4. **GET /env/actions** - Get available actions

```bash5. **POST /env/step** - Execute action

# Health Check6. **GET /env/stats** - Get episode stats

curl http://localhost:3001/health7. **GET /env/info/:episodeId** - Get episode details

8. **GET /env/history** - Get episode history

# API Info

curl http://localhost:3001/## Calendar API (20 endpoints)

```

1. **POST /calendar/meetings/create** - Create meeting

### 2. Authentication (No token required)2. **GET /calendar/meetings/:meetingId** - Get meeting by ID

3. **PUT /calendar/meetings/:meetingId** - Update meeting

#### Register User4. **DELETE /calendar/meetings/:meetingId** - Delete meeting

````bash5. **POST /calendar/meetings/:meetingId/cancel** - Cancel meeting

# PowerShell6. **POST /calendar/meetings/:meetingId/respond** - RSVP to meeting

$body = @{ name='Test User'; email='test@example.com'; password='password123' } | ConvertTo-Json7. **GET /calendar/meetings/user/:userId** - Get user's meetings

Invoke-RestMethod -Uri 'http://localhost:3001/auth/register' -Method Post -Body $body -ContentType 'application/json'8. **GET /calendar/meetings/channel/:channelId** - Get channel meetings

9. **GET /calendar/meetings/upcoming/:userId** - Get upcoming meetings

# curl (Git Bash/WSL)10. **GET /calendar/meetings** - Get all meetings

curl -X POST http://localhost:3001/auth/register \11. **POST /calendar/availability/check** - Check availability

  -H "Content-Type: application/json" \12. **POST /calendar/availability/find-slots** - Find available slots

  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'13. **POST /calendar/availability/set** - Set availability

```14. **GET /calendar/availability/:userId** - Get user availability

15. **POST /calendar/reminders/create** - Create reminder

**Response:**16. **GET /calendar/reminders/due** - Get due reminders

```json17. **POST /calendar/reminders/:reminderId/mark-sent** - Mark reminder sent

{18. **POST /calendar/meetings/:meetingId/notes** - Add meeting notes

  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."19. **POST /calendar/meetings/:meetingId/attachments** - Add attachments

}20. **GET /calendar/stats/:userId** - Get user calendar stats

````

## Calls API (13 endpoints)

#### Login

````bash1. **POST /calls/create** - Create/start a new call

# PowerShell2. **POST /calls/:callId/join** - Join a call

$body = @{ email='test@example.com'; password='password123' } | ConvertTo-Json3. **POST /calls/:callId/leave** - Leave a call

Invoke-RestMethod -Uri 'http://localhost:3001/auth/login' -Method Post -Body $body -ContentType 'application/json'4. **POST /calls/:callId/end** - End a call

5. **POST /calls/:callId/toggle-audio** - Toggle audio on/off

# curl6. **POST /calls/:callId/toggle-video** - Toggle video on/off

curl -X POST http://localhost:3001/auth/login \7. **POST /calls/:callId/screen-share** - Start/stop screen sharing

  -H "Content-Type: application/json" \8. **POST /calls/:callId/toggle-recording** - Toggle call recording

  -d '{"email":"test@example.com","password":"password123"}'9. **GET /calls/:callId** - Get call details

```10. **GET /calls/channel/:channelId** - Get calls for channel

11. **GET /calls/user/:userId** - Get calls for user

### 3. Calls API (No token required)12. **GET /calls** - Get all active calls

13. **GET /calls/:callId/stats** - Get call statistics

#### Get All Active Calls

```bash---

curl http://localhost:3001/calls

```## Testing Summary



**Response:**| API            | Total  | Tested | Status                 |

```json| -------------- | ------ | ------ | ---------------------- |

{| RL Environment | 8      | 8      | ✅ Functional          |

  "success": true,| Calendar       | 20     | 0      | ⚠️ Manual testing only |

  "calls": [],| Calls          | 13     | 0      | ⚠️ Manual testing only |

  "count": 0| **Total**      | **41** | **8**  | **🔄 In Progress**     |

}

```## Related Documentation



#### Create a Call- **[API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md)** - Request/response examples

```bash- **[docs/API.md](./docs/API.md)** - Complete technical specifications

# PowerShell- **[RL_OVERVIEW.md](./RL_OVERVIEW.md)** - RL environment architecture

$body = @{ - **[docs/CALENDAR_API.md](./docs/CALENDAR_API.md)** - Calendar system guide

  type='video'- **[docs/CALLS_API.md](./docs/CALLS_API.md)** - Video calls system guide

  channelId='meeting-123'
  userId='user-001'
  userName='John Doe'
} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/calls/create' -Method Post -Body $body -ContentType 'application/json'

# curl
curl -X POST http://localhost:3001/calls/create \
  -H "Content-Type: application/json" \
  -d '{"type":"video","channelId":"meeting-123","userId":"user-001","userName":"John Doe"}'
````

**Response:**

```json
{
  "success": true,
  "call": {
    "id": "997657b3-755f-46bf-8624-96fa43c947b3",
    "type": "video",
    "channelId": "meeting-123",
    "initiator": {...},
    "participants": [],
    "status": "active",
    "startTime": 1762131477032
  }
}
```

#### Get Specific Call

```bash
curl http://localhost:3001/calls/{callId}
```

#### Join a Call

```bash
# PowerShell
$body = @{ userId='user-002'; userName='Jane Smith' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/calls/{callId}/join' -Method Post -Body $body -ContentType 'application/json'
```

#### Leave a Call

```bash
# PowerShell
$body = @{ userId='user-002' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/calls/{callId}/leave' -Method Post -Body $body -ContentType 'application/json'
```

### 4. RL Environment API (No token required)

#### Get Available Actions

```bash
curl http://localhost:3001/env/actions
```

**Response:**

```json
{
  "success": true,
  "actions": [
    {
      "type": "send_message",
      "description": "Send a message to a channel",
      "payload": {...}
    },
    ...
  ],
  "channels": []
}
```

#### Get Current State

```bash
curl http://localhost:3001/env/state
```

#### Reset Environment

```bash
# PowerShell
$body = @{} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/env/reset' -Method Post -Body $body -ContentType 'application/json'

# Optional: specify task type
$body = @{ taskType='greeting_response' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/env/reset' -Method Post -Body $body -ContentType 'application/json'
```

**Response:**

```json
{
  "success": true,
  "episodeId": "5e9e2793-9894-4f20-9a15-a7d1dd69ccef",
  "state": {...},
  "task": {
    "type": "greeting_response",
    "name": "Greeting Response",
    "description": "Respond to a greeting message within 5 steps",
    "maxSteps": 10
  },
  "message": "Environment reset successfully"
}
```

#### Take an Action

```bash
# PowerShell
$body = @{
  action = @{
    type = 'send_message'
    payload = @{
      content = 'Hello from API!'
    }
  }
} | ConvertTo-Json -Depth 3
Invoke-RestMethod -Uri 'http://localhost:3001/env/step' -Method Post -Body $body -ContentType 'application/json'
```

**Response:**

```json
{
  "success": true,
  "state": {...},
  "reward": 0.5,
  "done": false,
  "info": {...}
}
```

#### Get Statistics

```bash
curl http://localhost:3001/env/stats
```

#### Get Episode History

```bash
# Get last 10 episodes
curl http://localhost:3001/env/history?limit=10

# Get last 50 episodes
curl http://localhost:3001/env/history?limit=50
```

### 5. Messages API (🔐 Requires Authentication Token)

#### Send Message

```bash
# PowerShell (with token)
$headers = @{ Authorization = "Bearer YOUR_TOKEN_HERE" }
$body = @{
  sender_email = 'test@example.com'
  receiver_email = 'admin@example.com'
  message = 'Hello!'
} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/api/messages' -Method Post -Body $body -Headers $headers -ContentType 'application/json'
```

#### Get Conversation

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3001/api/messages/sender@example.com/receiver@example.com
```

### 6. User API (🔐 Requires Authentication Token)

#### Get User Contacts

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3001/user/contacts/test@example.com
```

#### Get User Channels

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3001/user/channels/test@example.com
```

### 7. Calendar API

#### Create Event

```bash
# PowerShell
$body = @{
  title = 'Team Meeting'
  description = 'Discuss project progress'
  startTime = '2025-11-04T10:00:00Z'
  endTime = '2025-11-04T11:00:00Z'
  participants = @('user1', 'user2')
} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/calendar/events' -Method Post -Body $body -ContentType 'application/json'
```

#### Get All Events

```bash
curl http://localhost:3001/calendar/events
```

## 📝 Testing Workflow

### 1. Register and Login

```powershell
# Register
$register = @{ name='Test User'; email='test@example.com'; password='pass123' } | ConvertTo-Json
$result = Invoke-RestMethod -Uri 'http://localhost:3001/auth/register' -Method Post -Body $register -ContentType 'application/json'
$token = $result.token

# Save token for future requests
$headers = @{ Authorization = "Bearer $token" }
```

### 2. Test RL Environment

```powershell
# Reset
$reset = Invoke-RestMethod -Uri 'http://localhost:3001/env/reset' -Method Post -Body '{}' -ContentType 'application/json'
$episodeId = $reset.episodeId

# Get actions
Invoke-RestMethod -Uri 'http://localhost:3001/env/actions'

# Take action
$action = @{ action = @{ type='send_message'; payload=@{content='Hello!'} } } | ConvertTo-Json -Depth 3
Invoke-RestMethod -Uri 'http://localhost:3001/env/step' -Method Post -Body $action -ContentType 'application/json'
```

### 3. Test Calls

```powershell
# Create call
$call = @{ type='video'; channelId='test-123'; userId='user-001'; userName='Test' } | ConvertTo-Json
$callResult = Invoke-RestMethod -Uri 'http://localhost:3001/calls/create' -Method Post -Body $call -ContentType 'application/json'
$callId = $callResult.call.id

# Get all calls
Invoke-RestMethod -Uri 'http://localhost:3001/calls'

# Join call
$join = @{ userId='user-002'; userName='User 2' } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/calls/$callId/join" -Method Post -Body $join -ContentType 'application/json'
```

## 🐛 Common Issues

### Issue: "Cannot GET /api/messages/general"

**Solution:** The messages endpoint requires email parameters:

- Use `/api/messages/:senderEmail/:receiverEmail` instead

### Issue: 401 Unauthorized

**Solution:** Some endpoints require authentication token:

1. Register or login first
2. Include `Authorization: Bearer TOKEN` header

### Issue: 404 Not Found

**Solution:** Check the endpoint path:

- ✅ Correct: `/auth/register`, `/auth/login`
- ❌ Wrong: `/user/register`, `/user/login` (requires token)

### Issue: JSON Parse Error in PowerShell curl

**Solution:** Use `Invoke-RestMethod` instead of `curl` in PowerShell, or use Git Bash/WSL for curl commands.

## 📚 Jupyter Notebook Testing

All endpoints can be tested interactively using the provided Jupyter notebooks:

- `notebooks/API_Testing.ipynb` - Complete API testing suite
- `notebooks/System_Testing.ipynb` - Automated testing with reports
- `notebooks/RL_Visualization.ipynb` - RL agent analysis

## 🔗 Related Files

- Backend routes: `backend/src/routes/`
- Server config: `backend/src/server.js`
- API documentation: This file
