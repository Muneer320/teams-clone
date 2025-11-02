import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./dashboard_components/Sidebar";
import { TopBar } from "./dashboard_components/TopBar";

export default function JoinMeeting() {
  const navigate = useNavigate();
  const location = useLocation();
  const meetingTitle =
    location.state?.meetingTitle || "Microsoft Teams meeting";

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [selectedAudioOption, setSelectedAudioOption] = useState("computer");

  // Device lists
  const [audioInputDevices, setAudioInputDevices] = useState([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);

  // Selected devices
  const [selectedMicrophone, setSelectedMicrophone] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");

  // Get available media devices
  useEffect(() => {
    async function getDevices() {
      try {
        // Request permissions first
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        const devices = await navigator.mediaDevices.enumerateDevices();

        const audioInputs = devices.filter(
          (device) => device.kind === "audioinput"
        );
        const audioOutputs = devices.filter(
          (device) => device.kind === "audiooutput"
        );
        const videoInputs = devices.filter(
          (device) => device.kind === "videoinput"
        );

        setAudioInputDevices(audioInputs);
        setAudioOutputDevices(audioOutputs);
        setVideoDevices(videoInputs);

        // Set default devices
        if (audioInputs.length > 0)
          setSelectedMicrophone(audioInputs[0].deviceId);
        if (audioOutputs.length > 0)
          setSelectedSpeaker(audioOutputs[0].deviceId);
        if (videoInputs.length > 0) setSelectedCamera(videoInputs[0].deviceId);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    }

    getDevices();
  }, []);

  // Handle camera toggle
  const toggleCamera = async () => {
    if (cameraEnabled) {
      // Turn off camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraEnabled(false);
    } else {
      // Turn on camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          },
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

  // Update video stream when camera changes
  useEffect(() => {
    async function updateCamera() {
      if (cameraEnabled && selectedCamera) {
        // Stop current stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Start new stream with selected camera
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: selectedCamera } },
            audio: false,
          });

          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error updating camera:", error);
        }
      }
    }

    updateCamera();
  }, [selectedCamera, cameraEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#121212] text-white overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content - Centered */}
        <main className="flex-1 overflow-y-auto bg-[#1a1a1a] flex items-center justify-center p-6">
          <div className="w-full max-w-5xl space-y-8">
            {/* Teams Logo and Title */}
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <img
                src="/logo.png"
                alt="Microsoft Teams"
                className="w-16 h-16 object-contain"
              />
              <h1 className="text-2xl font-semibold">{meetingTitle}</h1>
            </div>

            {/* Video and Audio Containers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Video Preview Section */}
              <div className="space-y-4">
                <div className="bg-[#2a2a2a] rounded-lg aspect-video flex flex-col items-center justify-center p-8 relative overflow-hidden">
                  {cameraEnabled ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="text-gray-500 mb-4">
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M23 7l-7 5 7 5V7z" />
                          <rect
                            x="1"
                            y="5"
                            width="15"
                            height="14"
                            rx="2"
                            ry="2"
                          />
                          <line x1="1" y1="19" x2="16" y2="5" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Your camera is turned off
                      </p>
                    </>
                  )}
                </div>

                {/* Camera and Audio Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={toggleCamera}
                    className={`flex items-center gap-2 px-4 py-2 rounded text-sm transition ${
                      cameraEnabled
                        ? "bg-[#4F52B2] hover:bg-[#5a5dc4] text-white"
                        : "bg-[#2a2a2a] hover:bg-[#333333] text-gray-300"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      {cameraEnabled ? (
                        <>
                          <path d="M23 7l-7 5 7 5V7z" />
                          <rect
                            x="1"
                            y="5"
                            width="15"
                            height="14"
                            rx="2"
                            ry="2"
                          />
                        </>
                      ) : (
                        <>
                          <path d="M23 7l-7 5 7 5V7z" />
                          <rect
                            x="1"
                            y="5"
                            width="15"
                            height="14"
                            rx="2"
                            ry="2"
                          />
                          <line x1="1" y1="19" x2="16" y2="5" />
                        </>
                      )}
                    </svg>
                  </button>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={micEnabled}
                      onChange={(e) => setMicEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F52B2]"></div>
                  </label>

                  <button className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#333333] rounded text-gray-300 text-sm transition">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                    Background filters
                  </button>
                </div>

                {/* Camera Selector */}
                {videoDevices.length > 0 && (
                  <div className="bg-[#2a2a2a] rounded-lg p-4">
                    <label className="text-sm text-gray-400 mb-2 block">
                      Camera
                    </label>
                    <select
                      value={selectedCamera}
                      onChange={(e) => setSelectedCamera(e.target.value)}
                      className="w-full bg-[#1f1f1f] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4F52B2]"
                    >
                      {videoDevices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label ||
                            `Camera ${videoDevices.indexOf(device) + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Audio Settings Section */}
              <div className="space-y-4">
                <div className="bg-[#2a2a2a] rounded-lg p-6 space-y-6">
                  {/* Computer Audio Option */}
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="computer-audio"
                      name="audio-option"
                      checked={selectedAudioOption === "computer"}
                      onChange={() => setSelectedAudioOption("computer")}
                      className="mt-1 w-4 h-4 text-[#4F52B2] bg-gray-600 border-gray-500 focus:ring-[#4F52B2]"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="computer-audio"
                        className="text-white font-medium cursor-pointer"
                      >
                        Computer audio
                      </label>

                      {selectedAudioOption === "computer" && (
                        <div className="mt-4 space-y-4">
                          {/* Microphone Selector */}
                          <div className="flex items-center gap-3">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-gray-400 flex-shrink-0"
                            >
                              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                              <line x1="12" y1="19" x2="12" y2="23" />
                              <line x1="8" y1="23" x2="16" y2="23" />
                            </svg>
                            <select
                              value={selectedMicrophone}
                              onChange={(e) =>
                                setSelectedMicrophone(e.target.value)
                              }
                              className="flex-1 bg-[#1f1f1f] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4F52B2]"
                            >
                              {audioInputDevices.map((device) => (
                                <option
                                  key={device.deviceId}
                                  value={device.deviceId}
                                >
                                  {device.label ||
                                    `Microphone ${
                                      audioInputDevices.indexOf(device) + 1
                                    }`}
                                </option>
                              ))}
                            </select>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={micEnabled}
                                onChange={(e) =>
                                  setMicEnabled(e.target.checked)
                                }
                              />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F52B2]"></div>
                            </label>
                          </div>

                          {/* Speaker Selector */}
                          <div className="flex items-center gap-3">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-gray-400 flex-shrink-0"
                            >
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            </svg>
                            <select
                              value={selectedSpeaker}
                              onChange={(e) =>
                                setSelectedSpeaker(e.target.value)
                              }
                              className="flex-1 bg-[#1f1f1f] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4F52B2]"
                            >
                              {audioOutputDevices.map((device) => (
                                <option
                                  key={device.deviceId}
                                  value={device.deviceId}
                                >
                                  {device.label ||
                                    `Speaker ${
                                      audioOutputDevices.indexOf(device) + 1
                                    }`}
                                </option>
                              ))}
                            </select>
                            <div className="w-11"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Don't Use Audio Option */}
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="no-audio"
                      name="audio-option"
                      checked={selectedAudioOption === "none"}
                      onChange={() => setSelectedAudioOption("none")}
                      className="mt-0 w-4 h-4 text-[#4F52B2] bg-gray-600 border-gray-500 focus:ring-[#4F52B2]"
                    />
                    <label
                      htmlFor="no-audio"
                      className="text-white font-medium cursor-pointer"
                    >
                      Don't use audio
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <a href="#" className="text-[#7b7dcf] hover:underline text-sm">
                Need help?
              </a>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 bg-[#2a2a2a] hover:bg-[#333333] text-white rounded text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-[#4F52B2] hover:bg-[#5a5dc4] text-white rounded text-sm font-medium transition">
                  Join now
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
