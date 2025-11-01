import { v4 as uuidv4 } from "uuid";

/**
 * Calendar Management System
 * Handles meetings, scheduling, reminders, and availability
 */
class CalendarManager {
  constructor() {
    this.meetings = new Map(); // meetingId -> meeting object
    this.userMeetings = new Map(); // userId -> Set of meetingIds
    this.channelMeetings = new Map(); // channelId -> Set of meetingIds
    this.reminders = new Map(); // reminderId -> reminder object
    this.availability = new Map(); // userId -> availability settings
  }

  /**
   * Create a new meeting
   */
  createMeeting(meetingData) {
    const {
      title,
      description,
      startTime,
      endTime,
      organizerId,
      organizerName,
      attendees = [],
      channelId = null,
      location = "",
      isRecurring = false,
      recurrencePattern = null, // { frequency: 'daily'|'weekly'|'monthly', interval: 1, endDate }
      reminders = [], // [{ minutesBefore: 15, type: 'notification' }]
      isOnline = true,
      meetingLink = null,
      allowGuests = false,
    } = meetingData;

    // Validate times
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }

    if (end <= start) {
      throw new Error("End time must be after start time");
    }

    const meeting = {
      id: uuidv4(),
      title,
      description: description || "",
      startTime: start.getTime(),
      endTime: end.getTime(),
      organizer: {
        id: organizerId,
        name: organizerName,
      },
      attendees: attendees.map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email || "",
        response: "pending", // pending, accepted, declined, tentative
        responseTime: null,
      })),
      channelId,
      location,
      isRecurring,
      recurrencePattern,
      reminders,
      isOnline,
      meetingLink: meetingLink || (isOnline ? `meet://${uuidv4()}` : null),
      allowGuests,
      status: "scheduled", // scheduled, ongoing, completed, cancelled
      createdAt: Date.now(),
      updatedAt: Date.now(),
      notes: "",
      attachments: [],
    };

    this.meetings.set(meeting.id, meeting);

    // Index by organizer
    if (!this.userMeetings.has(organizerId)) {
      this.userMeetings.set(organizerId, new Set());
    }
    this.userMeetings.get(organizerId).add(meeting.id);

    // Index by attendees
    attendees.forEach((attendee) => {
      if (!this.userMeetings.has(attendee.id)) {
        this.userMeetings.set(attendee.id, new Set());
      }
      this.userMeetings.get(attendee.id).add(meeting.id);
    });

    // Index by channel
    if (channelId) {
      if (!this.channelMeetings.has(channelId)) {
        this.channelMeetings.set(channelId, new Set());
      }
      this.channelMeetings.get(channelId).add(meeting.id);
    }

    // Create reminder entries
    reminders.forEach((reminder) => {
      this.createReminder({
        meetingId: meeting.id,
        userId: organizerId,
        minutesBefore: reminder.minutesBefore,
        type: reminder.type,
      });

      attendees.forEach((attendee) => {
        this.createReminder({
          meetingId: meeting.id,
          userId: attendee.id,
          minutesBefore: reminder.minutesBefore,
          type: reminder.type,
        });
      });
    });

    return meeting;
  }

  /**
   * Get meeting by ID
   */
  getMeeting(meetingId) {
    return this.meetings.get(meetingId) || null;
  }

  /**
   * Update meeting
   */
  updateMeeting(meetingId, updates) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    // Validate time updates
    if (updates.startTime || updates.endTime) {
      const start = new Date(updates.startTime || meeting.startTime);
      const end = new Date(updates.endTime || meeting.endTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format");
      }

      if (end <= start) {
        throw new Error("End time must be after start time");
      }

      updates.startTime = start.getTime();
      updates.endTime = end.getTime();
    }

    // Update meeting
    Object.assign(meeting, updates);
    meeting.updatedAt = Date.now();

    return meeting;
  }

  /**
   * Cancel meeting
   */
  cancelMeeting(meetingId) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    meeting.status = "cancelled";
    meeting.updatedAt = Date.now();

    return meeting;
  }

  /**
   * Delete meeting
   */
  deleteMeeting(meetingId) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    // Remove from indexes
    this.userMeetings.get(meeting.organizer.id)?.delete(meetingId);
    meeting.attendees.forEach((attendee) => {
      this.userMeetings.get(attendee.id)?.delete(meetingId);
    });

    if (meeting.channelId) {
      this.channelMeetings.get(meeting.channelId)?.delete(meetingId);
    }

    // Delete associated reminders
    const remindersToDelete = [];
    this.reminders.forEach((reminder, id) => {
      if (reminder.meetingId === meetingId) {
        remindersToDelete.push(id);
      }
    });
    remindersToDelete.forEach((id) => this.reminders.delete(id));

    this.meetings.delete(meetingId);
    return true;
  }

  /**
   * Respond to meeting invitation
   */
  respondToMeeting(meetingId, userId, response) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    const attendee = meeting.attendees.find((a) => a.id === userId);
    if (!attendee) {
      throw new Error("User is not an attendee of this meeting");
    }

    attendee.response = response;
    attendee.responseTime = Date.now();
    meeting.updatedAt = Date.now();

    return meeting;
  }

  /**
   * Get meetings for a user
   */
  getUserMeetings(userId, filters = {}) {
    const meetingIds = this.userMeetings.get(userId);
    if (!meetingIds) {
      return [];
    }

    let meetings = Array.from(meetingIds)
      .map((id) => this.meetings.get(id))
      .filter((m) => m);

    // Apply filters
    if (filters.status) {
      meetings = meetings.filter((m) => m.status === filters.status);
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate).getTime();
      meetings = meetings.filter((m) => m.startTime >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate).getTime();
      meetings = meetings.filter((m) => m.endTime <= endDate);
    }

    if (filters.channelId) {
      meetings = meetings.filter((m) => m.channelId === filters.channelId);
    }

    // Sort by start time
    meetings.sort((a, b) => a.startTime - b.startTime);

    return meetings;
  }

  /**
   * Get meetings for a channel
   */
  getChannelMeetings(channelId, filters = {}) {
    const meetingIds = this.channelMeetings.get(channelId);
    if (!meetingIds) {
      return [];
    }

    let meetings = Array.from(meetingIds)
      .map((id) => this.meetings.get(id))
      .filter((m) => m);

    // Apply filters
    if (filters.status) {
      meetings = meetings.filter((m) => m.status === filters.status);
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate).getTime();
      meetings = meetings.filter((m) => m.startTime >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate).getTime();
      meetings = meetings.filter((m) => m.endTime <= endDate);
    }

    meetings.sort((a, b) => a.startTime - b.startTime);

    return meetings;
  }

  /**
   * Get upcoming meetings for a user
   */
  getUpcomingMeetings(userId, hours = 24) {
    const now = Date.now();
    const until = now + hours * 60 * 60 * 1000;

    const meetings = this.getUserMeetings(userId, {
      status: "scheduled",
    });

    return meetings.filter((m) => m.startTime >= now && m.startTime <= until);
  }

  /**
   * Check if user is available
   */
  isUserAvailable(userId, startTime, endTime) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    const meetings = this.getUserMeetings(userId, { status: "scheduled" });

    // Check for conflicts
    const hasConflict = meetings.some((meeting) => {
      return (
        (start >= meeting.startTime && start < meeting.endTime) ||
        (end > meeting.startTime && end <= meeting.endTime) ||
        (start <= meeting.startTime && end >= meeting.endTime)
      );
    });

    return !hasConflict;
  }

  /**
   * Find available time slots
   */
  findAvailableSlots(
    userIds,
    date,
    duration = 30,
    workingHours = { start: 9, end: 17 }
  ) {
    const dateObj = new Date(date);
    dateObj.setHours(workingHours.start, 0, 0, 0);
    const dayStart = dateObj.getTime();

    dateObj.setHours(workingHours.end, 0, 0, 0);
    const dayEnd = dateObj.getTime();

    const slotDuration = duration * 60 * 1000; // Convert to ms
    const slots = [];

    // Generate potential slots
    for (let time = dayStart; time < dayEnd; time += slotDuration) {
      const slotEnd = time + slotDuration;

      // Check if all users are available
      const allAvailable = userIds.every((userId) =>
        this.isUserAvailable(userId, time, slotEnd)
      );

      if (allAvailable) {
        slots.push({
          startTime: time,
          endTime: slotEnd,
          available: true,
        });
      }
    }

    return slots;
  }

  /**
   * Set user availability
   */
  setUserAvailability(userId, availabilityData) {
    this.availability.set(userId, {
      userId,
      workingHours: availabilityData.workingHours || {
        monday: { start: 9, end: 17 },
        tuesday: { start: 9, end: 17 },
        wednesday: { start: 9, end: 17 },
        thursday: { start: 9, end: 17 },
        friday: { start: 9, end: 17 },
        saturday: null,
        sunday: null,
      },
      timezone: availabilityData.timezone || "UTC",
      blockedSlots: availabilityData.blockedSlots || [], // [{ start, end }]
      updatedAt: Date.now(),
    });

    return this.availability.get(userId);
  }

  /**
   * Get user availability
   */
  getUserAvailability(userId) {
    return this.availability.get(userId) || null;
  }

  /**
   * Create reminder
   */
  createReminder(reminderData) {
    const { meetingId, userId, minutesBefore, type } = reminderData;

    const meeting = this.meetings.get(meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    const reminder = {
      id: uuidv4(),
      meetingId,
      userId,
      reminderTime: meeting.startTime - minutesBefore * 60 * 1000,
      type: type || "notification", // notification, email, sms
      sent: false,
      createdAt: Date.now(),
    };

    this.reminders.set(reminder.id, reminder);
    return reminder;
  }

  /**
   * Get due reminders
   */
  getDueReminders() {
    const now = Date.now();
    const dueReminders = [];

    this.reminders.forEach((reminder) => {
      if (!reminder.sent && reminder.reminderTime <= now) {
        const meeting = this.meetings.get(reminder.meetingId);
        if (meeting && meeting.status === "scheduled") {
          dueReminders.push({
            ...reminder,
            meeting,
          });
        }
      }
    });

    return dueReminders;
  }

  /**
   * Mark reminder as sent
   */
  markReminderSent(reminderId) {
    const reminder = this.reminders.get(reminderId);
    if (reminder) {
      reminder.sent = true;
    }
  }

  /**
   * Add notes to meeting
   */
  addMeetingNotes(meetingId, notes) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    meeting.notes = notes;
    meeting.updatedAt = Date.now();
    return meeting;
  }

  /**
   * Add attachment to meeting
   */
  addAttachment(meetingId, attachment) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    const newAttachment = {
      id: uuidv4(),
      name: attachment.name,
      url: attachment.url,
      type: attachment.type,
      size: attachment.size,
      uploadedAt: Date.now(),
    };

    meeting.attachments.push(newAttachment);
    meeting.updatedAt = Date.now();

    return meeting;
  }

  /**
   * Get calendar statistics
   */
  getCalendarStats(userId, startDate, endDate) {
    const meetings = this.getUserMeetings(userId, {
      startDate,
      endDate,
    });

    const stats = {
      totalMeetings: meetings.length,
      scheduled: meetings.filter((m) => m.status === "scheduled").length,
      completed: meetings.filter((m) => m.status === "completed").length,
      cancelled: meetings.filter((m) => m.status === "cancelled").length,
      totalDuration: meetings.reduce((sum, m) => {
        if (m.status === "completed" || m.status === "scheduled") {
          return sum + (m.endTime - m.startTime);
        }
        return sum;
      }, 0),
      organizedMeetings: meetings.filter((m) => m.organizer.id === userId)
        .length,
      attendingMeetings: meetings.filter((m) => m.organizer.id !== userId)
        .length,
    };

    // Convert duration to hours
    stats.totalDurationHours =
      Math.round((stats.totalDuration / (1000 * 60 * 60)) * 10) / 10;

    return stats;
  }

  /**
   * Get all meetings (admin)
   */
  getAllMeetings(filters = {}) {
    let meetings = Array.from(this.meetings.values());

    if (filters.status) {
      meetings = meetings.filter((m) => m.status === filters.status);
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate).getTime();
      meetings = meetings.filter((m) => m.startTime >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate).getTime();
      meetings = meetings.filter((m) => m.endTime <= endDate);
    }

    meetings.sort((a, b) => a.startTime - b.startTime);

    return meetings;
  }
}

// Singleton instance
export const calendarManager = new CalendarManager();
export default CalendarManager;
