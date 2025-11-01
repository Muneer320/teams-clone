import { callManager } from "../models/callManager.js";

/**
 * WebRTC Signaling Handlers
 * Handles peer-to-peer connection setup for audio/video calls
 */
export function initCallSignaling(io) {
  io.on("connection", (socket) => {
    // Join call room
    socket.on("call:join-room", ({ callId, userId, userName }) => {
      try {
        socket.join(`call:${callId}`);
        console.log(`📞 User ${userName} joined call room: ${callId}`);

        // Notify others in the call
        socket.to(`call:${callId}`).emit("call:user-joined", {
          userId,
          userName,
          socketId: socket.id,
        });

        // Send current participants to the new user
        const call = callManager.getCall(callId);
        if (call) {
          socket.emit("call:current-participants", {
            initiator: call.initiator,
            participants: call.participants,
          });
        }
      } catch (error) {
        socket.emit("call:error", { message: error.message });
      }
    });

    // Leave call room
    socket.on("call:leave-room", ({ callId, userId }) => {
      socket.leave(`call:${callId}`);
      console.log(`📞 User ${userId} left call room: ${callId}`);

      // Notify others
      socket.to(`call:${callId}`).emit("call:user-left", {
        userId,
        socketId: socket.id,
      });
    });

    // WebRTC Offer (initiating connection)
    socket.on("call:offer", ({ callId, targetUserId, offer }) => {
      console.log(`📞 WebRTC offer from ${socket.id} to ${targetUserId}`);

      // Forward offer to target user
      io.to(`call:${callId}`).emit("call:offer-received", {
        fromUserId: socket.id,
        offer,
      });
    });

    // WebRTC Answer (accepting connection)
    socket.on("call:answer", ({ callId, targetUserId, answer }) => {
      console.log(`📞 WebRTC answer from ${socket.id} to ${targetUserId}`);

      // Forward answer to target user
      io.to(`call:${callId}`).emit("call:answer-received", {
        fromUserId: socket.id,
        answer,
      });
    });

    // ICE Candidate (connection path discovery)
    socket.on("call:ice-candidate", ({ callId, targetUserId, candidate }) => {
      // Forward ICE candidate to target user
      io.to(`call:${callId}`).emit("call:ice-candidate-received", {
        fromUserId: socket.id,
        candidate,
      });
    });

    // Audio toggle
    socket.on("call:toggle-audio", ({ callId, userId, enabled }) => {
      try {
        callManager.toggleMedia(callId, userId, "audio", enabled);

        // Notify all participants
        io.to(`call:${callId}`).emit("call:audio-toggled", {
          userId,
          enabled,
        });
      } catch (error) {
        socket.emit("call:error", { message: error.message });
      }
    });

    // Video toggle
    socket.on("call:toggle-video", ({ callId, userId, enabled }) => {
      try {
        callManager.toggleMedia(callId, userId, "video", enabled);

        // Notify all participants
        io.to(`call:${callId}`).emit("call:video-toggled", {
          userId,
          enabled,
        });
      } catch (error) {
        socket.emit("call:error", { message: error.message });
      }
    });

    // Screen share start
    socket.on("call:start-screen-share", ({ callId, userId }) => {
      try {
        callManager.startScreenShare(callId, userId);

        // Notify all participants
        io.to(`call:${callId}`).emit("call:screen-share-started", {
          userId,
        });
      } catch (error) {
        socket.emit("call:error", { message: error.message });
      }
    });

    // Screen share stop
    socket.on("call:stop-screen-share", ({ callId }) => {
      try {
        callManager.stopScreenShare(callId);

        // Notify all participants
        io.to(`call:${callId}`).emit("call:screen-share-stopped");
      } catch (error) {
        socket.emit("call:error", { message: error.message });
      }
    });

    // Call ended
    socket.on("call:end", ({ callId }) => {
      try {
        callManager.endCall(callId);

        // Notify all participants
        io.to(`call:${callId}`).emit("call:ended");

        console.log(`📞 Call ${callId} ended`);
      } catch (error) {
        socket.emit("call:error", { message: error.message });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      // Find and remove user from any active calls
      // This is a cleanup in case user didn't leave properly
      console.log(`📞 Socket ${socket.id} disconnected`);
    });
  });

  console.log("📞 Call signaling handlers initialized");
}
