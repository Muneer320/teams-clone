import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MeetingActionCard } from "../dashboard_components/MeetingActionCard";
import {
  Link2,
  Calendar,
  Hash,
  CalendarDays,
  X,
  MoreHorizontal,
  EyeOff,
} from "lucide-react";

const MeetingsPage = () => {
  const navigate = useNavigate();
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingLinks, setMeetingLinks] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [showViewAllPopup, setShowViewAllPopup] = useState(false);
  const [copiedMeetingId, setCopiedMeetingId] = useState(null);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const viewAllPopupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowCreatePopup(false);
      }
    };

    if (showCreatePopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCreatePopup]);

  const handleCreateMeeting = () => {
    if (meetingTitle.trim()) {
      const newMeeting = {
        id: Date.now(),
        title: meetingTitle,
        createdAt: new Date(),
        link: `https://teams.microsoft.com/meet/${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      };
      setMeetingLinks([newMeeting, ...meetingLinks]);
      setMeetingTitle("");
      setShowCreatePopup(false);
    }
  };

  const handleHideMeeting = (id) => {
    setMeetingLinks(meetingLinks.filter((meeting) => meeting.id !== id));
    setExpandedMenu(null);
  };

  const handleShareLink = (meetingId, link) => {
    navigator.clipboard.writeText(link);
    setCopiedMeetingId(meetingId);
    setTimeout(() => {
      setCopiedMeetingId(null);
    }, 1000);
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "Created just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)
      return `Created ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Created ${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `Created ${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-100">Meet</h1>

      {/* Meeting Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 relative">
        <div className="relative" ref={buttonRef}>
          <MeetingActionCard
            icon={Link2}
            title="Create a meeting link"
            variant="primary"
            onClick={() => setShowCreatePopup(!showCreatePopup)}
          />

          {/* Create Meeting Popup */}
          {showCreatePopup && (
            <div
              ref={popupRef}
              className="absolute top-full left-0 mt-2 w-80 bg-[#292929] rounded-lg shadow-2xl border border-[#3a3a3a] p-4 z-50"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium text-sm">
                  Give your meeting a title
                </h3>
                <button
                  onClick={() => setShowCreatePopup(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>

              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Meeting with Muneer Alam"
                className="w-full bg-[#1f1f1f] border border-[#3a3a3a] rounded px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:border-[#4F52B2]"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleCreateMeeting();
                }}
              />

              <button
                onClick={handleCreateMeeting}
                disabled={!meetingTitle.trim()}
                className="w-full bg-[#4F52B2] hover:bg-[#5a5dc4] disabled:bg-[#3a3d7a] disabled:cursor-not-allowed text-white font-medium py-2 rounded transition"
              >
                Create and copy link
              </button>
            </div>
          )}
        </div>

        <MeetingActionCard icon={Calendar} title="Schedule a meeting" />
        <MeetingActionCard icon={Hash} title="Join with a meeting ID" />
      </div>

      {/* Meeting Links */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-300">Meeting links</h2>
          {meetingLinks.length > 3 && (
            <button
              onClick={() => setShowViewAllPopup(true)}
              className="text-sm text-gray-300 hover:text-gray-200 transition"
            >
              View all
            </button>
          )}
        </div>

        {meetingLinks.length > 0 ? (
          <div className="flex gap-3">
            {/* Display first 3 meetings with dynamic widths */}
            {meetingLinks.slice(0, 3).map((meeting) => {
              let widthClass = "";
              const totalMeetings = Math.min(meetingLinks.length, 3);

              if (totalMeetings === 1) {
                widthClass = "flex-[0_0_calc(50%-0.375rem)]";
              } else if (totalMeetings === 2) {
                widthClass = "flex-[0_0_calc(33.333%-0.5rem)]";
              } else {
                widthClass = "flex-[0_0_calc(33.333%-0.5rem)]";
              }

              return (
                <div
                  key={meeting.id}
                  className={`${widthClass} bg-[#1f1f1f] rounded-lg p-4 border border-[#2a2a2a] hover:bg-[#242424] transition`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-[#5a5a3a] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">💡</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium mb-1 truncate">
                          {meeting.title}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {getTimeAgo(meeting.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() =>
                          setExpandedMenu(
                            expandedMenu === meeting.id ? null : meeting.id
                          )
                        }
                        className="text-gray-400 hover:text-white p-1 transition"
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {expandedMenu === meeting.id && (
                        <div className="absolute right-0 top-full mt-1 bg-[#292929] rounded-lg shadow-xl border border-[#3a3a3a] py-1 w-40 z-10">
                          <button
                            onClick={() => handleHideMeeting(meeting.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#1f1f1f] transition"
                          >
                            <EyeOff size={16} />
                            Hide
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigate("/join-meeting", {
                          state: { meetingTitle: meeting.title },
                        });
                      }}
                      className="flex-1 bg-[#2a2a2a] hover:bg-[#333333] text-white py-2 rounded text-sm font-medium transition"
                    >
                      Join
                    </button>
                    <div className="flex-1 relative">
                      <button
                        onClick={() =>
                          handleShareLink(meeting.id, meeting.link)
                        }
                        className="w-full bg-[#2a2a2a] hover:bg-[#333333] text-white py-2 rounded text-sm font-medium transition"
                      >
                        Share link
                      </button>
                      {copiedMeetingId === meeting.id && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-[#4F52B2] text-white text-xs rounded shadow-lg whitespace-nowrap">
                          Copied to clipboard
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Default info card - shown when less than 3 meetings */}
            {meetingLinks.length < 3 && (
              <div
                className={`${
                  meetingLinks.length === 1
                    ? "flex-[0_0_calc(50%-0.375rem)]"
                    : meetingLinks.length === 2
                    ? "flex-[0_0_calc(33.333%-0.5rem)]"
                    : ""
                } bg-[#1f1f1f] rounded-lg p-4 border border-[#2a2a2a] hover:bg-[#242424] transition flex flex-col justify-between`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-4xl">🔗</div>
                  <p className="text-gray-200 text-sm">
                    Quickly create, save, and share links with anyone.
                  </p>
                </div>
                <a href="#" className="text-[#7b7dcf] hover:underline text-xs">
                  Learn more about meeting links
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#1f1f1f] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between border border-[#2a2a2a] transition hover:bg-[#242424]">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="text-5xl">🔗</div>
              <p className="text-gray-200 font-medium">
                Quickly create, save, and share links with anyone.
              </p>
            </div>
            <a
              href="#"
              className="text-[#7b7dcf] hover:underline text-sm ml-auto"
            >
              Learn more about meeting links
            </a>
          </div>
        )}
      </section>

      {/* View All Popup */}
      {showViewAllPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowViewAllPopup(false)}
        >
          <div
            ref={viewAllPopupRef}
            className="bg-[#292929] rounded-lg shadow-2xl border border-[#3a3a3a] w-full max-w-4xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
              <h2 className="text-white font-semibold">Meeting links</h2>
              <button
                onClick={() => setShowViewAllPopup(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="grid grid-cols-2 gap-4">
                {meetingLinks.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-[#1f1f1f] rounded-lg p-4 border border-[#2a2a2a] hover:bg-[#242424] transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-[#5a5a3a] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">💡</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium mb-1 truncate">
                            {meeting.title}
                          </h3>
                          <p className="text-gray-400 text-xs">
                            {getTimeAgo(meeting.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() =>
                            setExpandedMenu(
                              expandedMenu === meeting.id ? null : meeting.id
                            )
                          }
                          className="text-gray-400 hover:text-white p-1 transition"
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        {expandedMenu === meeting.id && (
                          <div className="absolute right-0 top-full mt-1 bg-[#292929] rounded-lg shadow-xl border border-[#3a3a3a] py-1 w-40 z-10">
                            <button
                              onClick={() => handleHideMeeting(meeting.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#1f1f1f] transition"
                            >
                              <EyeOff size={16} />
                              Hide
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigate("/join-meeting", {
                            state: { meetingTitle: meeting.title },
                          });
                        }}
                        className="flex-1 bg-[#2a2a2a] hover:bg-[#333333] text-white py-2 rounded text-sm font-medium transition"
                      >
                        Join
                      </button>
                      <div className="flex-1 relative">
                        <button
                          onClick={() =>
                            handleShareLink(meeting.id, meeting.link)
                          }
                          className="w-full bg-[#2a2a2a] hover:bg-[#333333] text-white py-2 rounded text-sm font-medium transition"
                        >
                          Share link
                        </button>
                        {copiedMeetingId === meeting.id && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-[#4F52B2] text-white text-xs rounded shadow-lg whitespace-nowrap">
                            Copied to clipboard
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Calls */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-300">Recent calls</h2>
          <button className="text-sm text-gray-300 hover:text-gray-200 transition">
            View all
          </button>
        </div>

        <div className="bg-[#1f1f1f] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <div className="divide-y divide-[#2a2a2a]">
            {/* Sample recent call */}
            <div className="p-4 flex items-center justify-between hover:bg-[#242424] transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">KD</span>
                </div>
                <div>
                  <p className="text-white font-medium">Kushwaha Deepak</p>
                  <div className="flex items-center gap-1 text-xs text-red-400">
                    <span>↗</span>
                    <span>No answer</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">9:31 am</span>
                <button className="bg-[#2a2a2a] hover:bg-[#333333] text-white px-4 py-2 rounded text-sm font-medium transition">
                  Call
                </button>
                <button className="text-gray-400 hover:text-white p-1">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-[#242424] transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">KD</span>
                </div>
                <div>
                  <p className="text-white font-medium">Kushwaha Deepak</p>
                  <div className="flex items-center gap-1 text-xs text-red-400">
                    <span>↗</span>
                    <span>No answer</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">7:13 am</span>
                <button className="bg-[#2a2a2a] hover:bg-[#333333] text-white px-4 py-2 rounded text-sm font-medium transition">
                  Call
                </button>
                <button className="text-gray-400 hover:text-white p-1">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MeetingsPage;
