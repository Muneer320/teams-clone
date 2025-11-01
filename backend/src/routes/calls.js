import express from "express";
import { callManager } from "../models/callManager.js";
import { environment } from "../models/environment.js";

const router = express.Router();

/**
 * POST /calls/create
 * Create a new audio or video call
 */
router.post("/create", (req, res) => {
  try {
    const { type, channelId, userId, userName, participants } = req.body;

    // Validation
    if (!type || !["audio", "video"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Invalid call type. Must be 'audio' or 'video'",
      });
    }

    if (!channelId) {
      return res.status(400).json({
        success: false,
        error: "channelId is required",
      });
    }

    if (!userId || !userName) {
      return res.status(400).json({
        success: false,
        error: "userId and userName are required",
      });
    }

    // Check if there's already an active call in this channel
    const existingCall = callManager.getCallByChannel(channelId);
    if (existingCall && existingCall.status === "active") {
      return res.status(409).json({
        success: false,
        error: "A call is already active in this channel",
        call: existingCall,
      });
    }

    // Create the call
    const call = callManager.createCall({
      type,
      channelId,
      initiatorId: userId,
      initiatorName: userName,
      participants: participants || [],
    });

    res.json({
      success: true,
      call,
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } call created successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calls/:callId/join
 * Join an existing call
 */
router.post("/:callId/join", (req, res) => {
  try {
    const { callId } = req.params;
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        success: false,
        error: "userId and userName are required",
      });
    }

    const call = callManager.joinCall(callId, userId, userName);

    res.json({
      success: true,
      call,
      message: "Joined call successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calls/:callId/leave
 * Leave a call
 */
router.post("/:callId/leave", (req, res) => {
  try {
    const { callId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    const call = callManager.leaveCall(callId, userId);

    res.json({
      success: true,
      call,
      message: "Left call successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calls/:callId/end
 * End a call
 */
router.post("/:callId/end", (req, res) => {
  try {
    const { callId } = req.params;

    const call = callManager.endCall(callId);

    res.json({
      success: true,
      call,
      message: "Call ended successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calls/:callId/toggle-audio
 * Toggle audio on/off
 */
router.post("/:callId/toggle-audio", (req, res) => {
  try {
    const { callId } = req.params;
    const { userId, enabled } = req.body;

    if (!userId || enabled === undefined) {
      return res.status(400).json({
        success: false,
        error: "userId and enabled are required",
      });
    }

    const call = callManager.toggleMedia(callId, userId, "audio", enabled);

    res.json({
      success: true,
      call,
      message: `Audio ${enabled ? "enabled" : "disabled"}`,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calls/:callId/toggle-video
 * Toggle video on/off
 */
router.post("/:callId/toggle-video", (req, res) => {
  try {
    const { callId } = req.params;
    const { userId, enabled } = req.body;

    if (!userId || enabled === undefined) {
      return res.status(400).json({
        success: false,
        error: "userId and enabled are required",
      });
    }

    const call = callManager.toggleMedia(callId, userId, "video", enabled);

    res.json({
      success: true,
      call,
      message: `Video ${enabled ? "enabled" : "disabled"}`,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calls/:callId/screen-share
 * Start/stop screen sharing
 */
router.post("/:callId/screen-share", (req, res) => {
  try {
    const { callId } = req.params;
    const { userId, enabled } = req.body;

    if (!userId || enabled === undefined) {
      return res.status(400).json({
        success: false,
        error: "userId and enabled are required",
      });
    }

    const call = enabled
      ? callManager.startScreenShare(callId, userId)
      : callManager.stopScreenShare(callId);

    res.json({
      success: true,
      call,
      message: `Screen sharing ${enabled ? "started" : "stopped"}`,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /calls/:callId/toggle-recording
 * Toggle call recording
 */
router.post("/:callId/toggle-recording", (req, res) => {
  try {
    const { callId } = req.params;
    const { enabled } = req.body;

    if (enabled === undefined) {
      return res.status(400).json({
        success: false,
        error: "enabled is required",
      });
    }

    const call = callManager.toggleRecording(callId, enabled);

    res.json({
      success: true,
      call,
      message: `Recording ${enabled ? "started" : "stopped"}`,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /calls/:callId
 * Get call details
 */
router.get("/:callId", (req, res) => {
  try {
    const { callId } = req.params;

    const call = callManager.getCall(callId);

    if (!call) {
      return res.status(404).json({
        success: false,
        error: "Call not found",
      });
    }

    res.json({
      success: true,
      call,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /calls/channel/:channelId
 * Get active call in a channel
 */
router.get("/channel/:channelId", (req, res) => {
  try {
    const { channelId } = req.params;

    const call = callManager.getCallByChannel(channelId);

    if (!call) {
      return res.json({
        success: true,
        call: null,
        message: "No active call in this channel",
      });
    }

    res.json({
      success: true,
      call,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /calls/user/:userId
 * Get user's current call
 */
router.get("/user/:userId", (req, res) => {
  try {
    const { userId } = req.params;

    const call = callManager.getCallByUser(userId);

    if (!call) {
      return res.json({
        success: true,
        call: null,
        message: "User is not in any call",
      });
    }

    res.json({
      success: true,
      call,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /calls/active
 * Get all active calls
 */
router.get("/", (req, res) => {
  try {
    const calls = callManager.getActiveCalls();

    res.json({
      success: true,
      calls,
      count: calls.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /calls/:callId/stats
 * Get call statistics
 */
router.get("/:callId/stats", (req, res) => {
  try {
    const { callId } = req.params;

    const stats = callManager.getCallStats(callId);

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
