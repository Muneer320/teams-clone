# Calendar System Quick Reference

## 🎯 Overview

The Calendar System provides comprehensive meeting and scheduling functionality with **23 endpoints** covering:

- Meeting CRUD operations
- RSVP and attendance tracking
- Availability checking and slot finding
- Recurring meetings
- Reminders and notifications
- Meeting notes and attachments
- Statistics and analytics

---

## 📋 Endpoint Summary

### Meeting Management (11 endpoints)

| Method   | Endpoint                                    | Description              |
| -------- | ------------------------------------------- | ------------------------ |
| `POST`   | `/calendar/meetings/create`                 | Create new meeting       |
| `GET`    | `/calendar/meetings/:meetingId`             | Get meeting details      |
| `PUT`    | `/calendar/meetings/:meetingId`             | Update meeting           |
| `DELETE` | `/calendar/meetings/:meetingId`             | Delete meeting           |
| `POST`   | `/calendar/meetings/:meetingId/cancel`      | Cancel meeting           |
| `POST`   | `/calendar/meetings/:meetingId/respond`     | Accept/decline meeting   |
| `GET`    | `/calendar/meetings/user/:userId`           | Get user's meetings      |
| `GET`    | `/calendar/meetings/channel/:channelId`     | Get channel meetings     |
| `GET`    | `/calendar/meetings/upcoming/:userId`       | Get upcoming meetings    |
| `GET`    | `/calendar/meetings`                        | Get all meetings (admin) |
| `POST`   | `/calendar/meetings/:meetingId/notes`       | Add/update notes         |
| `POST`   | `/calendar/meetings/:meetingId/attachments` | Add attachment           |

### Availability (4 endpoints)

| Method | Endpoint                            | Description             |
| ------ | ----------------------------------- | ----------------------- |
| `POST` | `/calendar/availability/check`      | Check if user available |
| `POST` | `/calendar/availability/find-slots` | Find common free slots  |
| `POST` | `/calendar/availability/set`        | Set working hours       |
| `GET`  | `/calendar/availability/:userId`    | Get user availability   |

### Reminders (3 endpoints)

| Method | Endpoint                                    | Description       |
| ------ | ------------------------------------------- | ----------------- |
| `POST` | `/calendar/reminders/create`                | Create reminder   |
| `GET`  | `/calendar/reminders/due`                   | Get due reminders |
| `POST` | `/calendar/reminders/:reminderId/mark-sent` | Mark as sent      |

### Statistics (1 endpoint)

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| `GET`  | `/calendar/stats/:userId` | Get meeting statistics |

---

## 🚀 Quick Start Examples

### Create a Meeting

```bash
POST /calendar/meetings/create
{
  "title": "Team Standup",
  "startTime": "2025-11-05T09:00:00Z",
  "endTime": "2025-11-05T09:30:00Z",
  "organizerId": "user-1",
  "organizerName": "Alice",
  "attendees": [
    { "id": "user-2", "name": "Bob", "email": "bob@example.com" }
  ],
  "isOnline": true
}
```

### Get Upcoming Meetings

```bash
GET /calendar/meetings/upcoming/user-1?hours=24
```

### Respond to Meeting

```bash
POST /calendar/meetings/:meetingId/respond
{
  "userId": "user-2",
  "response": "accepted"
}
```

### Check Availability

```bash
POST /calendar/availability/check
{
  "userId": "user-1",
  "startTime": "2025-11-05T14:00:00Z",
  "endTime": "2025-11-05T15:00:00Z"
}
```

### Find Common Slots

```bash
POST /calendar/availability/find-slots
{
  "userIds": ["user-1", "user-2", "user-3"],
  "date": "2025-11-05",
  "duration": 30
}
```

---

## 🔑 Key Features

### ✅ Meeting Types

- **Regular meetings** - One-time scheduled meetings
- **Recurring meetings** - Daily, weekly, monthly patterns
- **Online meetings** - With auto-generated meeting links
- **Channel meetings** - Associated with specific channels

### ✅ RSVP Responses

- `pending` - No response yet
- `accepted` - Will attend
- `declined` - Won't attend
- `tentative` - Maybe attending

### ✅ Meeting Status

- `scheduled` - Upcoming meeting
- `ongoing` - Currently in progress
- `completed` - Finished meeting
- `cancelled` - Cancelled meeting

### ✅ Reminder Types

- `notification` - In-app notification
- `email` - Email reminder
- `sms` - SMS reminder

### ✅ Recurrence Patterns

```json
{
  "frequency": "daily|weekly|monthly",
  "interval": 1,
  "endDate": "2025-12-31T23:59:59Z"
}
```

---

## 📊 Meeting Object Structure

```javascript
{
  id: "meeting-uuid",
  title: "Team Standup",
  description: "Daily sync",
  startTime: 1730451600000,        // Unix timestamp
  endTime: 1730453400000,
  organizer: {
    id: "user-1",
    name: "Alice"
  },
  attendees: [{
    id: "user-2",
    name: "Bob",
    email: "bob@example.com",
    response: "accepted",
    responseTime: 1730000000000
  }],
  channelId: "channel-1",
  location: "Conference Room A",
  isRecurring: false,
  recurrencePattern: null,
  reminders: [
    { minutesBefore: 15, type: "notification" }
  ],
  isOnline: true,
  meetingLink: "meet://abc123",
  allowGuests: false,
  status: "scheduled",
  createdAt: 1730000000000,
  updatedAt: 1730000000000,
  notes: "",
  attachments: []
}
```

---

## 🔍 Query Filters

### User Meetings

```
GET /calendar/meetings/user/:userId?status=scheduled&startDate=2025-11-01&endDate=2025-11-30&channelId=channel-1
```

### Channel Meetings

```
GET /calendar/meetings/channel/:channelId?status=scheduled&startDate=2025-11-01&endDate=2025-11-30
```

### All Meetings (Admin)

```
GET /calendar/meetings?status=scheduled&startDate=2025-11-01&endDate=2025-11-30
```

---

## 📈 Statistics Response

```json
{
  "totalMeetings": 42,
  "scheduled": 15,
  "completed": 25,
  "cancelled": 2,
  "totalDuration": 90000000,
  "totalDurationHours": 25.0,
  "organizedMeetings": 10,
  "attendingMeetings": 32
}
```

---

## ⚠️ Common Errors

| Status | Error                               | Cause                         |
| ------ | ----------------------------------- | ----------------------------- |
| `400`  | "Invalid date format"               | Date not in ISO 8601 format   |
| `400`  | "End time must be after start time" | Invalid time range            |
| `400`  | "Meeting title is required"         | Missing required field        |
| `404`  | "Meeting not found"                 | Invalid meeting ID            |
| `400`  | "User is not an attendee"           | User can't respond to meeting |

---

## 💡 Best Practices

1. **Always use ISO 8601 format** for dates: `"2025-11-05T09:00:00Z"`
2. **Check availability** before creating meetings
3. **Set appropriate reminders** (15 minutes is standard)
4. **Handle time zones** properly (store in UTC, display in local)
5. **Add meeting notes** after completion for records
6. **Use recurring meetings** for regular events
7. **Validate dates** on client side before API calls

---

## 🧪 Testing

```bash
# Health check
curl http://localhost:3001/health

# Get all meetings
curl http://localhost:3001/calendar/meetings

# Get user's meetings
curl http://localhost:3001/calendar/meetings/user/user-1

# Get upcoming meetings (next 48 hours)
curl http://localhost:3001/calendar/meetings/upcoming/user-1?hours=48

# Get calendar stats for November
curl "http://localhost:3001/calendar/stats/user-1?startDate=2025-11-01&endDate=2025-11-30"
```

---

## 🔗 Integration

### Backend Classes

- `CalendarManager` - Main calendar logic (`models/calendarManager.js`)
- Calendar routes - API endpoints (`routes/calendar.js`)

### Frontend Components (To Implement)

- `<CalendarView />` - Month/week/day views
- `<MeetingModal />` - Create/edit meetings
- `<MeetingCard />` - Display meeting details
- `<RSVPButtons />` - Accept/decline controls
- `<AvailabilityPicker />` - Set working hours

---

## 📚 Documentation

- Full API Reference: `docs/CALENDAR_API.md`
- Usage Examples: See documentation examples section
- Data Models: TypeScript interfaces in documentation

---

## 🎯 Next Steps

1. ✅ Backend complete (CalendarManager + 23 endpoints)
2. 🔄 Restart server to load calendar routes
3. 📱 Implement frontend calendar components
4. 🧪 Integration testing
5. 🔔 Add real-time Socket.IO events for meeting updates

---

**Base URL:** `http://localhost:3001/calendar`

**Total Endpoints:** 23

**Server Status:** Restart required to activate calendar routes
