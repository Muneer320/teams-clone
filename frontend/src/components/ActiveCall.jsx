import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  MoreHorizontal,
  Users,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import API_CONFIG from "../config/api";

export default function ActiveCall() {
  const navigate = useNavigate();
  const { callId } = useParams();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callInfo, setCallInfo] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Join call on mount
  useEffect(() => {
    const joinCall = async () => {
      if (!callId) {
        setError("No call ID provided");
        setLoading(false);
        return;
      }
      try {
        // Get user info from localStorage
        const userName = localStorage.getItem("userName") || "Guest User";
        let userId = localStorage.getItem("userId");

        // Generate and save userId if it doesn't exist
        if (!userId) {
          userId = `user-${Date.now()}`;
          localStorage.setItem("userId", userId);
        }

        // Join the call via backend API
        const response = await fetch(`${API_CONFIG.CALLS}/${callId}/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            userName: userName,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setCallInfo(data.call);
          // Combine initiator and participants into one array, avoiding duplicates
          const initiatorId = data.call.initiator?.id;
          const participantsArray = data.call.participants || [];

          // Filter out the initiator from participants if they're in both places
          const uniqueParticipants = participantsArray.filter(
            (p) => p.id !== initiatorId
          );

          const allParticipants = [
            ...(data.call.initiator
              ? [
                  {
                    id: data.call.initiator.id,
                    name: data.call.initiator.name,
                    status: data.call.initiator.status,
                    audio: true,
                    video: data.call.type === "video",
                    isInitiator: true,
                  },
                ]
              : []),
            ...uniqueParticipants,
          ];
          setParticipants(allParticipants);
          setLoading(false);
        } else {
          setError(data.error || "Failed to join call");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error joining call:", error);
        setError("Failed to join call. Please try again.");
        setLoading(false);
      }
    };

    joinCall();
  }, [callId]);

  // Fetch call details periodically to update participants
  useEffect(() => {
    if (!callId || loading) return;

    const fetchCallDetails = async () => {
      try {
        const response = await fetch(`${API_CONFIG.CALLS}/${callId}`);
        const data = await response.json();

        if (data.success) {
          setCallInfo(data.call);
          // Combine initiator and participants into one array, avoiding duplicates
          const initiatorId = data.call.initiator?.id;
          const participantsArray = data.call.participants || [];

          // Filter out the initiator from participants if they're in both places
          const uniqueParticipants = participantsArray.filter(
            (p) => p.id !== initiatorId
          );

          const allParticipants = [
            ...(data.call.initiator
              ? [
                  {
                    id: data.call.initiator.id,
                    name: data.call.initiator.name,
                    status: data.call.initiator.status,
                    audio: true,
                    video: data.call.type === "video",
                    isInitiator: true,
                  },
                ]
              : []),
            ...uniqueParticipants,
          ];
          setParticipants(allParticipants);
        }
      } catch (error) {
        console.error("Error fetching call details:", error);
      }
    };

    // Fetch initially and then every 3 seconds
    fetchCallDetails();
    const interval = setInterval(fetchCallDetails, 3000);

    return () => clearInterval(interval);
  }, [callId, loading]);

  // Timer for call duration
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format call duration as MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle camera toggle
  const toggleCamera = async () => {
    if (cameraEnabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraEnabled(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraEnabled(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }
  };

  // Handle leaving the call
  const handleLeaveCall = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Leave call via backend API
    if (callId) {
      try {
        const userId = localStorage.getItem("userId") || `user-${Date.now()}`;

        await fetch(`${API_CONFIG.CALLS}/${callId}/leave`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        });
      } catch (error) {
        console.error("Error leaving call:", error);
      }
    }

    navigate("/dashboard/meet");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col h-full bg-[#252525] text-white items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Joining call...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col h-full bg-[#252525] text-white items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mb-2">Unable to Join Call</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/dashboard/meet")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
          >
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#252525] text-white">
      {/* Meeting Controls Bar - Below TopBar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d30] border-b border-[#3e3e42]">
        {/* Left - Call Duration and Participant Count */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm text-gray-300">
              {formatDuration(callDuration)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Users size={16} />
            <span className="text-xs">
              {participants.length} participant
              {participants.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Right - Control Buttons */}
        <div className="flex items-center gap-1">
          {/* Chat Button */}
          <button className="p-2 hover:bg-[#3e3e42] rounded transition flex flex-col items-center gap-1">
            <MessageSquare size={18} />
            <span className="text-xs">Chat</span>
          </button>

          {/* People Button */}
          <button className="p-2 hover:bg-[#3e3e42] rounded transition flex flex-col items-center gap-1">
            <Users size={18} />
            <span className="text-xs">People</span>
          </button>

          {/* View Button */}
          <button className="p-2 hover:bg-[#3e3e42] rounded transition flex flex-col items-center gap-1">
            <LayoutGrid size={18} />
            <span className="text-xs">View</span>
          </button>

          {/* More Button */}
          <button className="p-2 hover:bg-[#3e3e42] rounded transition flex flex-col items-center gap-1">
            <MoreHorizontal size={18} />
            <span className="text-xs">More</span>
          </button>

          {/* Camera Button */}
          <button
            onClick={toggleCamera}
            className="p-2 hover:bg-[#3e3e42] rounded transition flex flex-col items-center gap-1 relative"
          >
            {cameraEnabled ? (
              <Video size={18} />
            ) : (
              <VideoOff size={18} className="text-red-500" />
            )}
            <span className="text-xs">Camera</span>
            <ChevronDown size={12} className="absolute top-0 right-0" />
          </button>

          {/* Microphone Button */}
          <button
            onClick={() => setMicEnabled(!micEnabled)}
            className="p-2 hover:bg-[#3e3e42] rounded transition flex flex-col items-center gap-1 relative"
          >
            {micEnabled ? (
              <Mic size={18} />
            ) : (
              <MicOff size={18} className="text-red-500" />
            )}
            <span className="text-xs">Mic</span>
            <ChevronDown size={12} className="absolute top-0 right-0" />
          </button>

          {/* Share Button */}
          <button className="p-2 hover:bg-[#3e3e42] rounded transition flex flex-col items-center gap-1">
            <Monitor size={18} />
            <span className="text-xs">Share</span>
          </button>

          {/* Leave Button */}
          <button
            onClick={handleLeaveCall}
            className="p-2 hover:bg-red-700 bg-red-600 rounded transition flex flex-col items-center gap-1 ml-2"
          >
            <PhoneOff size={18} />
            <span className="text-xs">Leave</span>
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex items-center justify-center relative bg-[#1f1f1f] p-8">
        {/* Show participants in a grid */}
        {participants.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400 mb-2">No participants yet</p>
            <p className="text-sm text-gray-500">
              Share the meeting link to invite others
            </p>
          </div>
        ) : participants.length === 1 ? (
          /* Single participant - show large */
          <div className="relative">
            <div className="w-64 h-64 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl flex items-center justify-center">
              <span className="text-6xl font-bold text-white">
                {participants[0].name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full flex items-center gap-2">
              <span className="text-sm text-white">{participants[0].name}</span>
              {participants[0].isInitiator && (
                <span className="text-xs text-blue-400">(Host)</span>
              )}
            </div>
          </div>
        ) : (
          /* Multiple participants - show grid */
          <div className="grid grid-cols-2 gap-4 max-w-4xl">
            {participants.map((participant) => (
              <div key={participant.id} className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-xl">
                  <span className="text-5xl font-bold text-white">
                    {participant.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded flex items-center gap-1">
                  <span className="text-xs text-white">{participant.name}</span>
                  {participant.isInitiator && (
                    <span className="text-xs text-blue-400 ml-1">(Host)</span>
                  )}
                </div>
                {!participant.audio && (
                  <div className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full">
                    <MicOff size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Self Video Preview - Bottom Right */}
        <div className="absolute bottom-6 right-6 w-64 h-48 bg-[#2a2a2a] rounded-lg overflow-hidden border-2 border-[#3a3a3a] shadow-lg">
          {cameraEnabled ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#2a2a2a]">
              <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mb-2">
                <span className="text-2xl font-semibold text-gray-800">K</span>
              </div>
              <span className="text-sm text-gray-400">Kartik Dixit</span>
              {!micEnabled && (
                <div className="absolute bottom-2 right-2 p-1 bg-black/60 rounded">
                  <MicOff size={14} className="text-white" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
