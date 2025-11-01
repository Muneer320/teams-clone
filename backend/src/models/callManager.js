import { v4 as uuidv4 } from "uuid";

/**
 * Call Management System
 * Handles audio and video calls with WebRTC signaling
 */
class CallManager {
  constructor() {
    this.activeCalls = new Map(); // callId -> call object
    this.userCalls = new Map(); // userId -> callId
    this.channelCalls = new Map(); // channelId -> callId
  }

  /**
   * Create a new call
   */
  createCall(callData) {
    const {
      type, // 'audio' or 'video'
      channelId,
      initiatorId,
      initiatorName,
      participants = [],
    } = callData;

    const call = {
      id: uuidv4(),
      type,
      channelId,
      initiator: {
        id: initiatorId,
        name: initiatorName,
        status: "connected",
      },
      participants: participants.map((p) => ({
        id: p.id,
        name: p.name,
        status: "invited", // invited, connecting, connected, disconnected
        joinedAt: null,
        audio: true,
        video: type === "video",
      })),
      status: "active", // active, ended
      startTime: Date.now(),
      endTime: null,
      recording: false,
      screenSharing: null, // { userId, startTime }
    };

    this.activeCalls.set(call.id, call);
    this.channelCalls.set(channelId, call.id);
    this.userCalls.set(initiatorId, call.id);

    return call;
  }

  /**
   * Get call by ID
   */
  getCall(callId) {
    return this.activeCalls.get(callId);
  }

  /**
   * Get call by channel ID
   */
  getCallByChannel(channelId) {
    const callId = this.channelCalls.get(channelId);
    return callId ? this.activeCalls.get(callId) : null;
  }

  /**
   * Get call by user ID
   */
  getCallByUser(userId) {
    const callId = this.userCalls.get(userId);
    return callId ? this.activeCalls.get(callId) : null;
  }

  /**
   * Join a call
   */
  joinCall(callId, userId, userName) {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error("Call not found");
    }

    // Check if user is already in call
    let participant = call.participants.find((p) => p.id === userId);

    if (!participant) {
      // Add new participant
      participant = {
        id: userId,
        name: userName,
        status: "connected",
        joinedAt: Date.now(),
        audio: true,
        video: call.type === "video",
      };
      call.participants.push(participant);
    } else {
      // Update existing participant
      participant.status = "connected";
      participant.joinedAt = Date.now();
    }

    this.userCalls.set(userId, callId);

    return call;
  }

  /**
   * Leave a call
   */
  leaveCall(callId, userId) {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error("Call not found");
    }

    // Remove participant
    call.participants = call.participants.filter((p) => p.id !== userId);
    this.userCalls.delete(userId);

    // End call if no participants left (except initiator left)
    if (call.participants.length === 0 || call.initiator.id === userId) {
      this.endCall(callId);
    }

    return call;
  }

  /**
   * Toggle audio/video
   */
  toggleMedia(callId, userId, mediaType, enabled) {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error("Call not found");
    }

    const participant = call.participants.find((p) => p.id === userId);
    if (participant) {
      participant[mediaType] = enabled;
    }

    // Update initiator if needed
    if (call.initiator.id === userId) {
      call.initiator[mediaType] = enabled;
    }

    return call;
  }

  /**
   * Start screen sharing
   */
  startScreenShare(callId, userId) {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error("Call not found");
    }

    call.screenSharing = {
      userId,
      startTime: Date.now(),
    };

    return call;
  }

  /**
   * Stop screen sharing
   */
  stopScreenShare(callId) {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error("Call not found");
    }

    call.screenSharing = null;

    return call;
  }

  /**
   * Toggle recording
   */
  toggleRecording(callId, enabled) {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error("Call not found");
    }

    call.recording = enabled;

    return call;
  }

  /**
   * End a call
   */
  endCall(callId) {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error("Call not found");
    }

    call.status = "ended";
    call.endTime = Date.now();

    // Clean up references
    this.channelCalls.delete(call.channelId);
    this.userCalls.delete(call.initiator.id);
    call.participants.forEach((p) => {
      this.userCalls.delete(p.id);
    });

    // Keep in memory for a bit for history
    setTimeout(() => {
      this.activeCalls.delete(callId);
    }, 60000); // Remove after 1 minute

    return call;
  }

  /**
   * Get all active calls
   */
  getActiveCalls() {
    return Array.from(this.activeCalls.values()).filter(
      (call) => call.status === "active"
    );
  }

  /**
   * Get call statistics
   */
  getCallStats(callId) {
    const call = this.activeCalls.get(callId);
    if (!call) {
      throw new Error("Call not found");
    }

    const duration = call.endTime
      ? call.endTime - call.startTime
      : Date.now() - call.startTime;

    return {
      callId: call.id,
      type: call.type,
      duration: Math.floor(duration / 1000), // seconds
      participantCount: call.participants.length + 1, // +1 for initiator
      status: call.status,
      recording: call.recording,
      screenSharing: call.screenSharing !== null,
    };
  }
}

// Singleton instance
export const callManager = new CallManager();
