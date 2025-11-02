import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { VideoOff, ChevronDown } from "lucide-react";

export default function JoinMeeting() {
  const navigate = useNavigate();
  const location = useLocation();
  const meetingTitle =
    location.state?.meetingTitle || "Microsoft Teams meeting";

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [selectedAudioOption, setSelectedAudioOption] = useState("computer");

  // Device lists
  const [audioInputDevices, setAudioInputDevices] = useState([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState([]);
  // eslint-disable-next-line no-unused-vars
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
    <div className="flex h-screen w-full bg-[#252525] text-white overflow-hidden">
      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl space-y-8">
          {/* Teams Logo and Title */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <img
              src="/logo.png"
              alt="Microsoft Teams"
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-xl font-normal text-white">{meetingTitle}</h1>
          </div>

          {/* Video and Audio Containers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Video Preview Section */}
            <div className="space-y-4">
              <div className="bg-[#3a3a3a] rounded-lg aspect-video flex flex-col items-center justify-center relative overflow-hidden border border-[#444444]">
                {cameraEnabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <VideoOff size={48} className="text-gray-500 mb-3" />
                    <p className="text-gray-400 text-sm">
                      Your camera is turned off
                    </p>
                  </div>
                )}

                {/* Controls overlay at bottom */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-3">
                  <button
                    onClick={toggleCamera}
                    className={`p-2.5 rounded-full border hover:bg-[#484848] transition ${
                      cameraEnabled
                        ? "bg-[#6264A7] border-[#6264A7]"
                        : "bg-[#3a3a3a] border-[#555555]"
                    }`}
                  >
                    <VideoOff size={18} className="text-white" />
                    <ChevronDown
                      size={12}
                      className="text-white absolute -bottom-1 -right-1"
                    />
                  </button>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={cameraEnabled}
                      onChange={(e) => {
                        if (e.target.checked) {
                          toggleCamera();
                        } else if (cameraEnabled) {
                          toggleCamera();
                        }
                      }}
                    />
                    <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6264A7]"></div>
                  </label>

                  <button className="px-3 py-2 text-xs bg-[#3a3a3a] border border-[#555555] hover:bg-[#484848] rounded text-gray-300 transition flex items-center gap-1.5">
                    <span className="text-lg">🎨</span>
                    Background filters
                  </button>
                </div>
              </div>
            </div>

            {/* Audio Settings Section */}
            <div className="space-y-4">
              <div className="bg-[#3a3a3a] rounded-lg p-6 space-y-6 border border-[#444444]">
                {/* Computer Audio Option */}
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id="computer-audio"
                    name="audio-option"
                    checked={selectedAudioOption === "computer"}
                    onChange={() => setSelectedAudioOption("computer")}
                    className="mt-1 w-4 h-4 accent-[#6264A7] cursor-pointer"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="computer-audio"
                      className="text-white font-normal cursor-pointer block mb-4"
                    >
                      Computer audio
                    </label>

                    {selectedAudioOption === "computer" && (
                      <div className="space-y-4">
                        {/* Microphone Selector */}
                        <div className="flex items-center gap-3">
                          <svg
                            width="18"
                            height="18"
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
                            className="flex-1 bg-[#2a2a2a] border border-[#555555] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6264A7]"
                          >
                            {audioInputDevices.length > 0 ? (
                              audioInputDevices.map((device) => (
                                <option
                                  key={device.deviceId}
                                  value={device.deviceId}
                                >
                                  {device.label ||
                                    `Microphone ${
                                      audioInputDevices.indexOf(device) + 1
                                    }`}
                                </option>
                              ))
                            ) : (
                              <option>None</option>
                            )}
                          </select>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={micEnabled}
                              onChange={(e) => setMicEnabled(e.target.checked)}
                            />
                            <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6264A7]"></div>
                          </label>
                        </div>

                        {/* Speaker Selector */}
                        <div className="flex items-center gap-3">
                          <svg
                            width="18"
                            height="18"
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
                            onChange={(e) => setSelectedSpeaker(e.target.value)}
                            className="flex-1 bg-[#2a2a2a] border border-[#555555] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6264A7]"
                          >
                            {audioOutputDevices.length > 0 ? (
                              audioOutputDevices.map((device) => (
                                <option
                                  key={device.deviceId}
                                  value={device.deviceId}
                                >
                                  {device.label ||
                                    `Speaker ${
                                      audioOutputDevices.indexOf(device) + 1
                                    }`}
                                </option>
                              ))
                            ) : (
                              <option>None</option>
                            )}
                          </select>
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
                    className="w-4 h-4 accent-[#6264A7] cursor-pointer"
                  />
                  <label
                    htmlFor="no-audio"
                    className="text-white font-normal cursor-pointer"
                  >
                    Don't use audio
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between max-w-5xl mx-auto mt-8">
            <a href="#" className="text-[#6264A7] hover:underline text-sm">
              Need help?
            </a>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-transparent border border-gray-600 hover:bg-[#3a3a3a] text-white rounded text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  navigate("/dashboard/active-call", {
                    state: { meetingTitle },
                  })
                }
                className="px-6 py-2 bg-[#6264A7] hover:bg-[#7173b8] text-white rounded text-sm font-medium transition"
              >
                Join now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
