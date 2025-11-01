import express from "express";
import { calendarManager } from "../models/calendarManager.js";

const router = express.Router();

/**
 * POST /calendar/meetings/create
 * Create a new meeting
 */
router.post("/meetings/create", (req, res) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      organizerId,
      organizerName,
      attendees,
      channelId,
      location,
      isRecurring,
      recurrencePattern,
      reminders,
      isOnline,
      meetingLink,
      allowGuests,
    } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Meeting title is required",
      });
    }

    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: "Start time and end time are required",
      });
    }

    if (!organizerId || !organizerName) {
      return res.status(400).json({
        success: false,
        error: "Organizer ID and name are required",
      });
    }

    const meeting = calendarManager.createMeeting({
      title,
      description,
      startTime,
      endTime,
      organizerId,
      organizerName,
      attendees,
      channelId,
      location,
      isRecurring,
      recurrencePattern,
      reminders,
      isOnline,
      meetingLink,
      allowGuests,
    });

    res.json({
      success: true,
      meeting,
      message: "Meeting created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /calendar/meetings/:meetingId
 * Get meeting details
 */
router.get("/meetings/:meetingId", (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = calendarManager.getMeeting(meetingId);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: "Meeting not found",
      });
    }

    res.json({
      success: true,
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /calendar/meetings/:meetingId
 * Update meeting
 */
router.put("/meetings/:meetingId", (req, res) => {
  try {
    const { meetingId } = req.params;
    const updates = req.body;

    const meeting = calendarManager.updateMeeting(meetingId, updates);

    res.json({
      success: true,
      meeting,
      message: "Meeting updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /calendar/meetings/:meetingId
 * Delete meeting
 */
router.delete("/meetings/:meetingId", (req, res) => {
  try {
    const { meetingId } = req.params;

    calendarManager.deleteMeeting(meetingId);

    res.json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calendar/meetings/:meetingId/cancel
 * Cancel meeting
 */
router.post("/meetings/:meetingId/cancel", (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = calendarManager.cancelMeeting(meetingId);

    res.json({
      success: true,
      meeting,
      message: "Meeting cancelled successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calendar/meetings/:meetingId/respond
 * Respond to meeting invitation
 */
router.post("/meetings/:meetingId/respond", (req, res) => {
  try {
    const { meetingId } = req.params;
    const { userId, response } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    if (!["accepted", "declined", "tentative"].includes(response)) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid response. Must be 'accepted', 'declined', or 'tentative'",
      });
    }

    const meeting = calendarManager.respondToMeeting(
      meetingId,
      userId,
      response
    );

    res.json({
      success: true,
      meeting,
      message: `Meeting ${response} successfully`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /calendar/meetings/user/:userId
 * Get user's meetings
 */
router.get("/meetings/user/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const { status, startDate, endDate, channelId } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (channelId) filters.channelId = channelId;

    const meetings = calendarManager.getUserMeetings(userId, filters);

    res.json({
      success: true,
      meetings,
      count: meetings.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /calendar/meetings/channel/:channelId
 * Get channel's meetings
 */
router.get("/meetings/channel/:channelId", (req, res) => {
  try {
    const { channelId } = req.params;
    const { status, startDate, endDate } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const meetings = calendarManager.getChannelMeetings(channelId, filters);

    res.json({
      success: true,
      meetings,
      count: meetings.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /calendar/meetings/upcoming/:userId
 * Get upcoming meetings
 */
router.get("/meetings/upcoming/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const { hours } = req.query;

    const hoursInt = hours ? parseInt(hours) : 24;
    const meetings = calendarManager.getUpcomingMeetings(userId, hoursInt);

    res.json({
      success: true,
      meetings,
      count: meetings.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /calendar/meetings
 * Get all meetings (admin)
 */
router.get("/meetings", (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const meetings = calendarManager.getAllMeetings(filters);

    res.json({
      success: true,
      meetings,
      count: meetings.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calendar/availability/check
 * Check if user is available
 */
router.post("/availability/check", (req, res) => {
  try {
    const { userId, startTime, endTime } = req.body;

    if (!userId || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: "userId, startTime, and endTime are required",
      });
    }

    const available = calendarManager.isUserAvailable(
      userId,
      startTime,
      endTime
    );

    res.json({
      success: true,
      available,
      userId,
      startTime,
      endTime,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calendar/availability/find-slots
 * Find available time slots for multiple users
 */
router.post("/availability/find-slots", (req, res) => {
  try {
    const { userIds, date, duration, workingHours } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "userIds array is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        error: "date is required",
      });
    }

    const slots = calendarManager.findAvailableSlots(
      userIds,
      date,
      duration,
      workingHours
    );

    res.json({
      success: true,
      slots,
      count: slots.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calendar/availability/set
 * Set user availability
 */
router.post("/availability/set", (req, res) => {
  try {
    const { userId, workingHours, timezone, blockedSlots } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    const availability = calendarManager.setUserAvailability(userId, {
      workingHours,
      timezone,
      blockedSlots,
    });

    res.json({
      success: true,
      availability,
      message: "Availability updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /calendar/availability/:userId
 * Get user availability
 */
router.get("/availability/:userId", (req, res) => {
  try {
    const { userId } = req.params;

    const availability = calendarManager.getUserAvailability(userId);

    if (!availability) {
      return res.status(404).json({
        success: false,
        error: "Availability settings not found for this user",
      });
    }

    res.json({
      success: true,
      availability,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calendar/reminders/create
 * Create a reminder
 */
router.post("/reminders/create", (req, res) => {
  try {
    const { meetingId, userId, minutesBefore, type } = req.body;

    if (!meetingId || !userId) {
      return res.status(400).json({
        success: false,
        error: "meetingId and userId are required",
      });
    }

    const reminder = calendarManager.createReminder({
      meetingId,
      userId,
      minutesBefore: minutesBefore || 15,
      type: type || "notification",
    });

    res.json({
      success: true,
      reminder,
      message: "Reminder created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /calendar/reminders/due
 * Get due reminders
 */
router.get("/reminders/due", (req, res) => {
  try {
    const reminders = calendarManager.getDueReminders();

    res.json({
      success: true,
      reminders,
      count: reminders.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calendar/reminders/:reminderId/mark-sent
 * Mark reminder as sent
 */
router.post("/reminders/:reminderId/mark-sent", (req, res) => {
  try {
    const { reminderId } = req.params;

    calendarManager.markReminderSent(reminderId);

    res.json({
      success: true,
      message: "Reminder marked as sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calendar/meetings/:meetingId/notes
 * Add or update meeting notes
 */
router.post("/meetings/:meetingId/notes", (req, res) => {
  try {
    const { meetingId } = req.params;
    const { notes } = req.body;

    if (notes === undefined) {
      return res.status(400).json({
        success: false,
        error: "notes field is required",
      });
    }

    const meeting = calendarManager.addMeetingNotes(meetingId, notes);

    res.json({
      success: true,
      meeting,
      message: "Notes updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calendar/meetings/:meetingId/attachments
 * Add attachment to meeting
 */
router.post("/meetings/:meetingId/attachments", (req, res) => {
  try {
    const { meetingId } = req.params;
    const { name, url, type, size } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        success: false,
        error: "name and url are required",
      });
    }

    const meeting = calendarManager.addAttachment(meetingId, {
      name,
      url,
      type,
      size,
    });

    res.json({
      success: true,
      meeting,
      message: "Attachment added successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /calendar/stats/:userId
 * Get calendar statistics
 */
router.get("/stats/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    const stats = calendarManager.getCalendarStats(userId, startDate, endDate);

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
