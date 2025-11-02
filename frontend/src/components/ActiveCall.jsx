import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

export default function ActiveCall() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

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
  const handleLeaveCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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

  return (
    <div className="flex flex-col h-full bg-[#252525] text-white">
      {/* Meeting Controls Bar - Below TopBar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d30] border-b border-[#3e3e42]">
        {/* Left - Call Duration */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-sm text-gray-300">
            {formatDuration(callDuration)}
          </span>
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
      <div className="flex-1 flex items-center justify-center relative bg-[#1f1f1f]">
        {/* Main participant video - centered */}
        <div className="w-64 h-64 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 shadow-2xl flex items-center justify-center">
          {/* Placeholder for actual participant video */}
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <span className="text-6xl font-bold text-white">A</span>
          </div>
        </div>

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
