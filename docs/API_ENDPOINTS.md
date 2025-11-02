# Complete API Endpoint List

**Total: 42 Endpoints**

## RL Environment API (9 endpoints) - All ✅

1. **GET /env/tasks** - Get all task definitions
2. **POST /env/reset** - Start new episode
3. **GET /env/state** - Get current state
4. **GET /env/actions** - Get available actions
5. **POST /env/step** - Execute action
6. **GET /env/stats** - Get episode stats
7. **GET /env/info/:episodeId** - Get episode details
8. **GET /env/history** - Get episode history

## Calendar API (20 endpoints)

1. **POST /calendar/meetings/create** - Create meeting
2. **GET /calendar/meetings/:meetingId** - Get meeting by ID
3. **PUT /calendar/meetings/:meetingId** - Update meeting
4. **DELETE /calendar/meetings/:meetingId** - Delete meeting
5. **POST /calendar/meetings/:meetingId/cancel** - Cancel meeting
6. **POST /calendar/meetings/:meetingId/respond** - RSVP to meeting
7. **GET /calendar/meetings/user/:userId** - Get user's meetings
8. **GET /calendar/meetings/channel/:channelId** - Get channel meetings
9. **GET /calendar/meetings/upcoming/:userId** - Get upcoming meetings
10. **GET /calendar/meetings** - Get all meetings
11. **POST /calendar/availability/check** - Check availability
12. **POST /calendar/availability/find-slots** - Find available slots
13. **POST /calendar/availability/set** - Set availability
14. **GET /calendar/availability/:userId** - Get user availability
15. **POST /calendar/reminders/create** - Create reminder
16. **GET /calendar/reminders/due** - Get due reminders
17. **POST /calendar/reminders/:reminderId/mark-sent** - Mark reminder sent
18. **POST /calendar/meetings/:meetingId/notes** - Add meeting notes
19. **POST /calendar/meetings/:meetingId/attachments** - Add attachments
20. **GET /calendar/stats/:userId** - Get user calendar stats

## Calls API (13 endpoints)

1. **POST /calls/create** - Create/start a new call
2. **POST /calls/:callId/join** - Join a call
3. **POST /calls/:callId/leave** - Leave a call
4. **POST /calls/:callId/end** - End a call
5. **POST /calls/:callId/toggle-audio** - Toggle audio on/off
6. **POST /calls/:callId/toggle-video** - Toggle video on/off
7. **POST /calls/:callId/screen-share** - Start/stop screen sharing
8. **POST /calls/:callId/toggle-recording** - Toggle call recording
9. **GET /calls/:callId** - Get call details
10. **GET /calls/channel/:channelId** - Get calls for channel
11. **GET /calls/user/:userId** - Get calls for user
12. **GET /calls** - Get all active calls
13. **GET /calls/:callId/stats** - Get call statistics

---

## Testing Summary

| API            | Total  | Tested | Status                 |
| -------------- | ------ | ------ | ---------------------- |
| RL Environment | 8      | 8      | ✅ Functional          |
| Calendar       | 20     | 0      | ⚠️ Manual testing only |
| Calls          | 13     | 0      | ⚠️ Manual testing only |
| **Total**      | **41** | **8**  | **🔄 In Progress**     |

## Related Documentation

- **[API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md)** - Request/response examples
- **[docs/API.md](./docs/API.md)** - Complete technical specifications
- **[RL_OVERVIEW.md](./RL_OVERVIEW.md)** - RL environment architecture
- **[docs/CALENDAR_API.md](./docs/CALENDAR_API.md)** - Calendar system guide
- **[docs/CALLS_API.md](./docs/CALLS_API.md)** - Video calls system guide
