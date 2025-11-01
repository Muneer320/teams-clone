# Calendar API Documentation

Complete guide for managing meetings, scheduling, and calendar operations in TeamsClone-RL.

## Table of Contents

- [Overview](#overview)
- [Meeting Endpoints](#meeting-endpoints)
- [Availability Endpoints](#availability-endpoints)
- [Reminder Endpoints](#reminder-endpoints)
- [Statistics](#statistics)
- [Data Models](#data-models)
- [Examples](#examples)

## Overview

The Calendar API provides comprehensive meeting and scheduling functionality:

- ✅ **Meeting Management** - Create, update, cancel, delete meetings
- ✅ **RSVP System** - Accept, decline, tentative responses
- ✅ **Availability Checking** - Check conflicts and find free slots
- ✅ **Recurring Meetings** - Daily, weekly, monthly patterns
- ✅ **Reminders** - Automated notifications before meetings
- ✅ **Meeting Notes** - Add notes and attachments
- ✅ **Statistics** - Track meeting metrics and time spent

Base URL: `http://localhost:3001/calendar`

---

## Meeting Endpoints

### Create Meeting

Create a new meeting or appointment.

**Endpoint:** `POST /calendar/meetings/create`

**Request Body:**

```json
{
  "title": "Team Standup",
  "description": "Daily team sync meeting",
  "startTime": "2025-11-01T09:00:00Z",
  "endTime": "2025-11-01T09:30:00Z",
  "organizerId": "user-1",
  "organizerName": "Alice Johnson",
  "attendees": [
    {
      "id": "user-2",
      "name": "Bob Smith",
      "email": "bob@example.com"
    },
    {
      "id": "user-3",
      "name": "Carol White",
      "email": "carol@example.com"
    }
  ],
  "channelId": "channel-1",
  "location": "Conference Room A",
  "isRecurring": true,
  "recurrencePattern": {
    "frequency": "daily",
    "interval": 1,
    "endDate": "2025-12-31T23:59:59Z"
  },
  "reminders": [
    {
      "minutesBefore": 15,
      "type": "notification"
    },
    {
      "minutesBefore": 60,
      "type": "email"
    }
  ],
  "isOnline": true,
  "meetingLink": "https://meet.example.com/abc123",
  "allowGuests": false
}
```

**Response:**

```json
{
  "success": true,
  "meeting": {
    "id": "meeting-uuid",
    "title": "Team Standup",
    "description": "Daily team sync meeting",
    "startTime": 1730451600000,
    "endTime": 1730453400000,
    "organizer": {
      "id": "user-1",
      "name": "Alice Johnson"
    },
    "attendees": [
      {
        "id": "user-2",
        "name": "Bob Smith",
        "email": "bob@example.com",
        "response": "pending",
        "responseTime": null
      }
    ],
    "channelId": "channel-1",
    "location": "Conference Room A",
    "isRecurring": true,
    "recurrencePattern": { ... },
    "reminders": [ ... ],
    "isOnline": true,
    "meetingLink": "meet://...",
    "allowGuests": false,
    "status": "scheduled",
    "createdAt": 1730000000000,
    "updatedAt": 1730000000000,
    "notes": "",
    "attachments": []
  },
  "message": "Meeting created successfully"
}
```

**Status Codes:**

- `200` - Meeting created
- `400` - Validation error
- `500` - Server error

---

### Get Meeting Details

Get detailed information about a specific meeting.

**Endpoint:** `GET /calendar/meetings/:meetingId`

**Response:**

```json
{
  "success": true,
  "meeting": { ... }
}
```

**Status Codes:**

- `200` - Success
- `404` - Meeting not found

---

### Update Meeting

Update meeting details.

**Endpoint:** `PUT /calendar/meetings/:meetingId`

**Request Body:**

```json
{
  "title": "Updated Meeting Title",
  "description": "New description",
  "startTime": "2025-11-01T10:00:00Z",
  "endTime": "2025-11-01T11:00:00Z",
  "location": "Virtual"
}
```

**Response:**

```json
{
  "success": true,
  "meeting": { ... },
  "message": "Meeting updated successfully"
}
```

---

### Delete Meeting

Permanently delete a meeting.

**Endpoint:** `DELETE /calendar/meetings/:meetingId`

**Response:**

```json
{
  "success": true,
  "message": "Meeting deleted successfully"
}
```

---

### Cancel Meeting

Cancel a meeting (keeps record but marks as cancelled).

**Endpoint:** `POST /calendar/meetings/:meetingId/cancel`

**Response:**

```json
{
  "success": true,
  "meeting": {
    "id": "meeting-uuid",
    "status": "cancelled",
    ...
  },
  "message": "Meeting cancelled successfully"
}
```

---

### Respond to Meeting

Accept, decline, or tentatively accept a meeting invitation.

**Endpoint:** `POST /calendar/meetings/:meetingId/respond`

**Request Body:**

```json
{
  "userId": "user-2",
  "response": "accepted"
}
```

**Valid Responses:**

- `"accepted"` - Accept the meeting
- `"declined"` - Decline the meeting
- `"tentative"` - Maybe attending

**Response:**

```json
{
  "success": true,
  "meeting": { ... },
  "message": "Meeting accepted successfully"
}
```

---

### Get User's Meetings

Get all meetings for a specific user with optional filters.

**Endpoint:** `GET /calendar/meetings/user/:userId`

**Query Parameters:**

- `status` - Filter by status: `scheduled`, `ongoing`, `completed`, `cancelled`
- `startDate` - ISO date string (meetings starting after this date)
- `endDate` - ISO date string (meetings ending before this date)
- `channelId` - Filter by channel

**Examples:**

```
GET /calendar/meetings/user/user-1
GET /calendar/meetings/user/user-1?status=scheduled
GET /calendar/meetings/user/user-1?startDate=2025-11-01&endDate=2025-11-30
GET /calendar/meetings/user/user-1?channelId=channel-1
```

**Response:**

```json
{
  "success": true,
  "meetings": [ ... ],
  "count": 5
}
```

---

### Get Channel's Meetings

Get all meetings for a specific channel.

**Endpoint:** `GET /calendar/meetings/channel/:channelId`

**Query Parameters:**

- `status` - Filter by status
- `startDate` - ISO date string
- `endDate` - ISO date string

**Response:**

```json
{
  "success": true,
  "meetings": [ ... ],
  "count": 3
}
```

---

### Get Upcoming Meetings

Get upcoming meetings for a user within a specified timeframe.

**Endpoint:** `GET /calendar/meetings/upcoming/:userId`

**Query Parameters:**

- `hours` - Number of hours to look ahead (default: 24)

**Examples:**

```
GET /calendar/meetings/upcoming/user-1
GET /calendar/meetings/upcoming/user-1?hours=48
```

**Response:**

```json
{
  "success": true,
  "meetings": [
    {
      "id": "meeting-1",
      "title": "Team Standup",
      "startTime": 1730451600000,
      "endTime": 1730453400000,
      ...
    }
  ],
  "count": 1
}
```

---

### Get All Meetings

Get all meetings across the system (admin endpoint).

**Endpoint:** `GET /calendar/meetings`

**Query Parameters:**

- `status` - Filter by status
- `startDate` - ISO date string
- `endDate` - ISO date string

**Response:**

```json
{
  "success": true,
  "meetings": [ ... ],
  "count": 42
}
```

---

## Availability Endpoints

### Check Availability

Check if a user is available during a specific time period.

**Endpoint:** `POST /calendar/availability/check`

**Request Body:**

```json
{
  "userId": "user-1",
  "startTime": "2025-11-01T09:00:00Z",
  "endTime": "2025-11-01T10:00:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "available": true,
  "userId": "user-1",
  "startTime": "2025-11-01T09:00:00Z",
  "endTime": "2025-11-01T10:00:00Z"
}
```

---

### Find Available Slots

Find common available time slots for multiple users.

**Endpoint:** `POST /calendar/availability/find-slots`

**Request Body:**

```json
{
  "userIds": ["user-1", "user-2", "user-3"],
  "date": "2025-11-01",
  "duration": 30,
  "workingHours": {
    "start": 9,
    "end": 17
  }
}
```

**Response:**

```json
{
  "success": true,
  "slots": [
    {
      "startTime": 1730451600000,
      "endTime": 1730453400000,
      "available": true
    },
    {
      "startTime": 1730453400000,
      "endTime": 1730455200000,
      "available": true
    }
  ],
  "count": 2
}
```

---

### Set User Availability

Set or update a user's availability preferences.

**Endpoint:** `POST /calendar/availability/set`

**Request Body:**

```json
{
  "userId": "user-1",
  "workingHours": {
    "monday": { "start": 9, "end": 17 },
    "tuesday": { "start": 9, "end": 17 },
    "wednesday": { "start": 9, "end": 17 },
    "thursday": { "start": 9, "end": 17 },
    "friday": { "start": 9, "end": 17 },
    "saturday": null,
    "sunday": null
  },
  "timezone": "America/New_York",
  "blockedSlots": [
    {
      "start": "2025-11-01T12:00:00Z",
      "end": "2025-11-01T13:00:00Z"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "availability": {
    "userId": "user-1",
    "workingHours": { ... },
    "timezone": "America/New_York",
    "blockedSlots": [ ... ],
    "updatedAt": 1730000000000
  },
  "message": "Availability updated successfully"
}
```

---

### Get User Availability

Get a user's availability settings.

**Endpoint:** `GET /calendar/availability/:userId`

**Response:**

```json
{
  "success": true,
  "availability": {
    "userId": "user-1",
    "workingHours": { ... },
    "timezone": "America/New_York",
    "blockedSlots": [ ... ],
    "updatedAt": 1730000000000
  }
}
```

**Status Codes:**

- `200` - Success
- `404` - Availability settings not found

---

## Reminder Endpoints

### Create Reminder

Create a custom reminder for a meeting.

**Endpoint:** `POST /calendar/reminders/create`

**Request Body:**

```json
{
  "meetingId": "meeting-uuid",
  "userId": "user-1",
  "minutesBefore": 30,
  "type": "notification"
}
```

**Response:**

```json
{
  "success": true,
  "reminder": {
    "id": "reminder-uuid",
    "meetingId": "meeting-uuid",
    "userId": "user-1",
    "reminderTime": 1730449800000,
    "type": "notification",
    "sent": false,
    "createdAt": 1730000000000
  },
  "message": "Reminder created successfully"
}
```

---

### Get Due Reminders

Get all reminders that are due to be sent.

**Endpoint:** `GET /calendar/reminders/due`

**Response:**

```json
{
  "success": true,
  "reminders": [
    {
      "id": "reminder-uuid",
      "meetingId": "meeting-uuid",
      "userId": "user-1",
      "reminderTime": 1730449800000,
      "type": "notification",
      "sent": false,
      "createdAt": 1730000000000,
      "meeting": {
        "id": "meeting-uuid",
        "title": "Team Standup",
        ...
      }
    }
  ],
  "count": 1
}
```

---

### Mark Reminder as Sent

Mark a reminder as sent after notification delivery.

**Endpoint:** `POST /calendar/reminders/:reminderId/mark-sent`

**Response:**

```json
{
  "success": true,
  "message": "Reminder marked as sent"
}
```

---

## Additional Endpoints

### Add Meeting Notes

Add or update notes for a meeting.

**Endpoint:** `POST /calendar/meetings/:meetingId/notes`

**Request Body:**

```json
{
  "notes": "Discussion points:\n- Project timeline\n- Budget allocation\n- Team assignments"
}
```

**Response:**

```json
{
  "success": true,
  "meeting": { ... },
  "message": "Notes updated successfully"
}
```

---

### Add Meeting Attachment

Add an attachment to a meeting.

**Endpoint:** `POST /calendar/meetings/:meetingId/attachments`

**Request Body:**

```json
{
  "name": "presentation.pdf",
  "url": "https://storage.example.com/files/presentation.pdf",
  "type": "application/pdf",
  "size": 2048576
}
```

**Response:**

```json
{
  "success": true,
  "meeting": {
    ...
    "attachments": [
      {
        "id": "attachment-uuid",
        "name": "presentation.pdf",
        "url": "https://storage.example.com/files/presentation.pdf",
        "type": "application/pdf",
        "size": 2048576,
        "uploadedAt": 1730000000000
      }
    ]
  },
  "message": "Attachment added successfully"
}
```

---

## Statistics

### Get Calendar Statistics

Get statistics about a user's meetings.

**Endpoint:** `GET /calendar/stats/:userId`

**Query Parameters:**

- `startDate` - ISO date string
- `endDate` - ISO date string

**Example:**

```
GET /calendar/stats/user-1?startDate=2025-11-01&endDate=2025-11-30
```

**Response:**

```json
{
  "success": true,
  "stats": {
    "totalMeetings": 42,
    "scheduled": 15,
    "completed": 25,
    "cancelled": 2,
    "totalDuration": 90000000,
    "totalDurationHours": 25.0,
    "organizedMeetings": 10,
    "attendingMeetings": 32
  }
}
```

---

## Data Models

### Meeting Object

```typescript
{
  id: string;
  title: string;
  description: string;
  startTime: number;           // Unix timestamp
  endTime: number;             // Unix timestamp
  organizer: {
    id: string;
    name: string;
  };
  attendees: Array<{
    id: string;
    name: string;
    email: string;
    response: 'pending' | 'accepted' | 'declined' | 'tentative';
    responseTime: number | null;
  }>;
  channelId: string | null;
  location: string;
  isRecurring: boolean;
  recurrencePattern: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate: string;
  } | null;
  reminders: Array<{
    minutesBefore: number;
    type: 'notification' | 'email' | 'sms';
  }>;
  isOnline: boolean;
  meetingLink: string | null;
  allowGuests: boolean;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: number;
  updatedAt: number;
  notes: string;
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: number;
  }>;
}
```

### Availability Object

```typescript
{
  userId: string;
  workingHours: {
    monday: { start: number, end: number } | null;
    tuesday: { start: number, end: number } | null;
    wednesday: { start: number, end: number } | null;
    thursday: { start: number, end: number } | null;
    friday: { start: number, end: number } | null;
    saturday: { start: number, end: number } | null;
    sunday: { start: number, end: number } | null;
  };
  timezone: string;
  blockedSlots: Array<{
    start: string;
    end: string;
  }>;
  updatedAt: number;
}
```

### Reminder Object

```typescript
{
  id: string;
  meetingId: string;
  userId: string;
  reminderTime: number; // Unix timestamp
  type: "notification" | "email" | "sms";
  sent: boolean;
  createdAt: number;
}
```

---

## Examples

### Complete Meeting Creation Workflow

```javascript
// 1. Create meeting
const createResponse = await fetch(
  "http://localhost:3001/calendar/meetings/create",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Project Kickoff",
      description: "Initial meeting for Q4 project",
      startTime: "2025-11-05T14:00:00Z",
      endTime: "2025-11-05T15:00:00Z",
      organizerId: "user-1",
      organizerName: "Alice Johnson",
      attendees: [
        { id: "user-2", name: "Bob Smith", email: "bob@example.com" },
        { id: "user-3", name: "Carol White", email: "carol@example.com" },
      ],
      isOnline: true,
      reminders: [{ minutesBefore: 15, type: "notification" }],
    }),
  }
);

const { meeting } = await createResponse.json();
console.log("Meeting created:", meeting.id);

// 2. User responds to meeting
await fetch(`http://localhost:3001/calendar/meetings/${meeting.id}/respond`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: "user-2",
    response: "accepted",
  }),
});

// 3. Add notes after meeting
await fetch(`http://localhost:3001/calendar/meetings/${meeting.id}/notes`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    notes: "Key decisions:\n- Budget approved\n- Timeline set for 3 months",
  }),
});
```

### Find Common Available Time

```javascript
// Check when multiple users are available
const response = await fetch(
  "http://localhost:3001/calendar/availability/find-slots",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userIds: ["user-1", "user-2", "user-3"],
      date: "2025-11-05",
      duration: 60,
      workingHours: { start: 9, end: 17 },
    }),
  }
);

const { slots } = await response.json();
console.log("Available slots:", slots);

// Book a meeting in the first available slot
if (slots.length > 0) {
  const slot = slots[0];
  await fetch("http://localhost:3001/calendar/meetings/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Strategy Discussion",
      startTime: new Date(slot.startTime).toISOString(),
      endTime: new Date(slot.endTime).toISOString(),
      organizerId: "user-1",
      organizerName: "Alice",
      attendees: [
        { id: "user-2", name: "Bob" },
        { id: "user-3", name: "Carol" },
      ],
    }),
  });
}
```

### Recurring Meeting Setup

```javascript
// Create a daily standup meeting
const response = await fetch("http://localhost:3001/calendar/meetings/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Daily Standup",
    description: "Daily team sync",
    startTime: "2025-11-01T09:00:00Z",
    endTime: "2025-11-01T09:15:00Z",
    organizerId: "user-1",
    organizerName: "Alice",
    attendees: [
      { id: "user-2", name: "Bob" },
      { id: "user-3", name: "Carol" },
    ],
    isRecurring: true,
    recurrencePattern: {
      frequency: "daily",
      interval: 1,
      endDate: "2025-12-31T23:59:59Z",
    },
    reminders: [{ minutesBefore: 5, type: "notification" }],
    isOnline: true,
  }),
});
```

---

## Testing with cURL

```bash
# Create meeting
curl -X POST http://localhost:3001/calendar/meetings/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Meeting",
    "startTime": "2025-11-01T10:00:00Z",
    "endTime": "2025-11-01T11:00:00Z",
    "organizerId": "user-1",
    "organizerName": "Alice"
  }'

# Get user meetings
curl http://localhost:3001/calendar/meetings/user/user-1

# Get upcoming meetings
curl http://localhost:3001/calendar/meetings/upcoming/user-1?hours=48

# Check availability
curl -X POST http://localhost:3001/calendar/availability/check \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-1",
    "startTime": "2025-11-01T09:00:00Z",
    "endTime": "2025-11-01T10:00:00Z"
  }'

# Respond to meeting
curl -X POST http://localhost:3001/calendar/meetings/MEETING_ID/respond \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-2",
    "response": "accepted"
  }'

# Get calendar stats
curl "http://localhost:3001/calendar/stats/user-1?startDate=2025-11-01&endDate=2025-11-30"
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

- `400` - Bad Request (validation errors, invalid dates)
- `404` - Not Found (meeting/user doesn't exist)
- `500` - Internal Server Error

---

## Best Practices

1. **Time Zones** - Always use ISO 8601 format with timezone (UTC recommended)
2. **Validation** - Validate dates on client side before sending
3. **Conflicts** - Check availability before creating meetings
4. **Reminders** - Set appropriate reminders (15 min before is common)
5. **Response Required** - Prompt users to respond to meeting invitations
6. **Recurring Meetings** - Set reasonable end dates for recurring patterns
7. **Notes & Attachments** - Add after meeting completion for records

---

For complete integration examples, see the frontend calendar components.
