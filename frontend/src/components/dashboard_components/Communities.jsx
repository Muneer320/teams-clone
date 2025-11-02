import React, { useState } from "react";
import {
  Plus,
  Settings,
  Search,
  MoreVertical,
  Calendar,
  Share2,
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Smile,
  AtSign,
  Paperclip,
  MoreHorizontal,
  Strikethrough,
  AlignLeft,
  Code,
  Quote,
} from "lucide-react";
import "../../styles/Communities.css";

const Communities = () => {
  const [selectedCommunity, setSelectedCommunity] = useState("School");
  const [activeTab, setActiveTab] = useState("Posts");
  const [isPostExpanded, setIsPostExpanded] = useState(false);
  const [postType, setPostType] = useState("post"); // "post" or "announcement"
  const [postSubject, setPostSubject] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState({});
  const [replyText, setReplyText] = useState({});

  // Sample communities data
  const communities = [
    { id: 1, name: "School", icon: "🎓", color: "#f4c2a0" },
    { id: 2, name: "Work", icon: "💼", color: "#a7c7e7" },
    { id: 3, name: "Gaming", icon: "🎮", color: "#b4e7a7" },
  ];

  // Sample posts data
  const posts = [
    {
      id: 1,
      author: "Kartik Dixit",
      role: "Owner",
      timestamp: "Yesterday 7:43 PM",
      content: "VERY IMP NEWS IS THIS",
      subject: "FEW FEW FEW",
      description: "SOMETHING IS VERY IMP EVEN i DONT KNOW WHAT IS IMP BUT IMP",
      isNew: true,
      avatar: "👨‍💼",
      reactions: [{ emoji: "👍", count: 1 }],
      replies: [
        {
          id: 101,
          author: "Hriday K.S.",
          timestamp: "4:09 AM",
          content: "hi",
          avatar: "👤",
          reactions: [{ emoji: "👍", count: 1 }],
        },
      ],
    },
    {
      id: 2,
      author: "Sarah Johnson",
      role: "Member",
      timestamp: "Yesterday 3:20 PM",
      content:
        "Welcome everyone to the community! Feel free to share your thoughts and ideas here.",
      isNew: false,
      avatar: "👩‍💼",
      replies: [],
    },
  ];

  const handlePostClick = () => {
    setIsPostExpanded(true);
  };

  const handlePostSubmit = () => {
    // Handle post submission
    console.log("Posting:", { postSubject, postContent });
    setIsPostExpanded(false);
    setPostSubject("");
    setPostContent("");
  };

  const handlePostCancel = () => {
    setIsPostExpanded(false);
    setPostSubject("");
    setPostContent("");
  };

  return (
    <div className="communities-container">
      {/* Left Sidebar */}
      <div className="communities-sidebar">
        <div className="communities-header">
          {!isSearchOpen ? (
            <>
              <h2>Communities</h2>
              <div className="header-actions">
                <button
                  className="icon-btn"
                  title="Search Communities"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search size={20} />
                </button>
                <button className="icon-btn" title="Add Community">
                  <Plus size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="search-input-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="community-search-input"
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                className="icon-btn"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="communities-list">
          {communities
            .filter((community) =>
              community.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((community) => (
              <div
                key={community.id}
                className={`community-item ${
                  selectedCommunity === community.name ? "active" : ""
                }`}
                onClick={() => setSelectedCommunity(community.name)}
              >
                <div
                  className="community-icon"
                  style={{ backgroundColor: community.color }}
                >
                  <span>{community.icon}</span>
                </div>
                <span className="community-name">{community.name}</span>
              </div>
            ))}
          {communities.filter((community) =>
            community.name.toLowerCase().includes(searchQuery.toLowerCase())
          ).length === 0 &&
            searchQuery && (
              <div className="no-results">
                <p>No communities found</p>
              </div>
            )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="communities-main">
        {/* Community Banner */}
        <div className="community-banner">
          <div className="banner-gradient"></div>
        </div>

        {/* Community Header */}
        <div className="community-header-section">
          <div className="community-info">
            <div className="community-avatar">
              <span>🎓</span>
            </div>
            <div className="community-details">
              <h1>{selectedCommunity}</h1>
              <div className="community-tabs">
                {["Posts", "Files", "Photos"].map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="community-actions">
            <button className="action-btn">
              <Calendar size={18} />
              <span>Events</span>
            </button>
            <button
              className="action-btn"
              onClick={() => setShowSharePopup(true)}
            >
              <Share2 size={18} />
              <span>Share join link</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="community-content">
          {/* Post Input Area */}
          <div
            className={`post-input-container ${
              isPostExpanded ? "expanded" : ""
            }`}
          >
            {!isPostExpanded ? (
              <>
                <div className="post-input-header" onClick={handlePostClick}>
                  <div className="user-avatar">
                    <span>👤</span>
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#e1e1e1",
                    }}
                  >
                    Post in channel
                  </span>
                </div>
                <div className="post-type-buttons-bottom">
                  <button
                    className={`post-type-btn ${
                      postType === "post" ? "active" : ""
                    }`}
                    onClick={() => setPostType("post")}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M3 3h10v2H3V3zm0 4h10v2H3V7zm0 4h7v2H3v-2z" />
                    </svg>
                    Post
                  </button>
                  <button
                    className={`post-type-btn ${
                      postType === "announcement" ? "active" : ""
                    }`}
                    onClick={() => setPostType("announcement")}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M11 2c-.6 0-1 .4-1 1v4H7V3c0-.6-.4-1-1-1s-1 .4-1 1v4H2.5c-.3 0-.5.2-.5.5s.2.5.5.5H5v1H2.5c-.3 0-.5.2-.5.5s.2.5.5.5H5v1H2.5c-.3 0-.5.2-.5.5s.2.5.5.5H5v1c0 .6.4 1 1 1s1-.4 1-1v-1h3v1c0 .6.4 1 1 1s1-.4 1-1v-1h2.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H11v-1h2.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H11V8h2.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H11V3c0-.6-.4-1-1-1z" />
                    </svg>
                    Announcement
                  </button>
                </div>
              </>
            ) : (
              <div className="post-input-expanded">
                <div className="post-header">
                  <div className="user-avatar">
                    <span>👤</span>
                  </div>
                  <span className="user-name">Muneer Alam</span>
                  <button className="close-btn" onClick={handlePostCancel}>
                    <X size={20} />
                  </button>
                </div>

                <input
                  type="text"
                  className="post-subject"
                  placeholder="Add a subject"
                  value={postSubject}
                  onChange={(e) => setPostSubject(e.target.value)}
                />

                <div className="formatting-toolbar">
                  <button className="format-btn" title="Bold">
                    <Bold size={16} />
                  </button>
                  <button className="format-btn" title="Italic">
                    <Italic size={16} />
                  </button>
                  <button className="format-btn" title="Underline">
                    <Underline size={16} />
                  </button>
                  <button className="format-btn" title="Strikethrough">
                    <Strikethrough size={16} />
                  </button>
                  <div className="toolbar-divider"></div>
                  <button className="format-btn" title="Bulleted list">
                    <List size={16} />
                  </button>
                  <button className="format-btn" title="Numbered list">
                    <ListOrdered size={16} />
                  </button>
                  <div className="toolbar-divider"></div>
                  <button className="format-btn" title="Align">
                    <AlignLeft size={16} />
                  </button>
                  <button className="format-btn" title="Text color">
                    <span className="text-color">A</span>
                  </button>
                  <button className="format-btn" title="Highlight">
                    <span className="highlight">ab</span>
                  </button>
                  <div className="toolbar-divider"></div>
                  <button className="format-btn" title="Quote">
                    <Quote size={16} />
                  </button>
                  <button className="format-btn" title="Link">
                    <Link size={16} />
                  </button>
                  <button className="format-btn" title="Code">
                    <Code size={16} />
                  </button>
                  <button className="format-btn" title="More">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <textarea
                  className="post-textarea"
                  placeholder="Type a message"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={4}
                />

                <div className="post-actions">
                  <div className="action-icons">
                    <button className="action-icon" title="Emoji">
                      <Smile size={20} />
                    </button>
                    <button className="action-icon" title="Attach image">
                      <Image size={20} />
                    </button>
                    <button className="action-icon" title="Attach file">
                      <Paperclip size={20} />
                    </button>
                    <button className="action-icon" title="More">
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="submit-actions">
                    <button className="schedule-btn" title="Schedule send">
                      <Calendar size={18} />
                    </button>
                    <button className="post-btn" onClick={handlePostSubmit}>
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Posts Feed */}
          <div className="posts-feed">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header-info">
                  <div className="post-avatar">
                    <span>{post.avatar}</span>
                  </div>
                  <div className="post-meta">
                    <div className="author-info">
                      <span className="author-name">{post.author}</span>
                      {post.role && (
                        <span className="author-role">{post.role}</span>
                      )}
                      <span className="post-timestamp">{post.timestamp}</span>
                    </div>
                  </div>
                  {post.isNew && <span className="new-badge">New</span>}
                </div>

                <div className="post-content-area">
                  <div className="post-text">{post.content}</div>
                </div>

                <div className="post-actions-bar">
                  <button className="post-action-btn">
                    <span>👍</span> Like
                  </button>
                  <button
                    className="post-action-btn"
                    onClick={() =>
                      setShowReplyInput((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                  >
                    <span>💬</span> Comment
                  </button>
                  <button className="post-action-btn">
                    <Share2 size={16} /> Share
                  </button>
                  <button className="post-action-btn">
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Replies Section */}
                {post.replies && post.replies.length > 0 && (
                  <div className="replies-section">
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="reply-card">
                        <div className="reply-avatar">
                          <span>{reply.avatar}</span>
                        </div>
                        <div className="reply-content">
                          <div className="reply-header">
                            <span className="reply-author">{reply.author}</span>
                            <span className="reply-timestamp">
                              {reply.timestamp}
                            </span>
                          </div>
                          <div className="reply-text">{reply.content}</div>
                          <div className="reply-actions">
                            <button className="reply-action-btn">
                              <span>👍</span> Like
                            </button>
                            <button
                              className="reply-action-btn"
                              onClick={() =>
                                setShowReplyInput((prev) => ({
                                  ...prev,
                                  [`${post.id}-${reply.id}`]:
                                    !prev[`${post.id}-${reply.id}`],
                                }))
                              }
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                {showReplyInput[post.id] && (
                  <div className="reply-input-section">
                    <div className="reply-input-avatar">
                      <span>👤</span>
                    </div>
                    <div className="reply-input-wrapper">
                      <textarea
                        className="reply-input"
                        placeholder="Write a reply..."
                        value={replyText[post.id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                      <div className="reply-input-actions">
                        <button
                          className="reply-send-btn"
                          onClick={() => {
                            // Handle reply submission
                            console.log("Reply:", replyText[post.id]);
                            setReplyText((prev) => ({
                              ...prev,
                              [post.id]: "",
                            }));
                            setShowReplyInput((prev) => ({
                              ...prev,
                              [post.id]: false,
                            }));
                          }}
                        >
                          Send
                        </button>
                        <button
                          className="reply-cancel-btn"
                          onClick={() =>
                            setShowReplyInput((prev) => ({
                              ...prev,
                              [post.id]: false,
                            }))
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Link Popup */}
      {showSharePopup && (
        <div className="popup-overlay" onClick={() => setShowSharePopup(false)}>
          <div className="share-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <div className="popup-title">
                <Share2 size={20} />
                <span>Link to "{selectedCommunity}" community copied</span>
              </div>
              <button
                className="popup-close"
                onClick={() => setShowSharePopup(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="popup-content">
              <div className="link-display">
                https://teams.live.com/l/community/
                {selectedCommunity.toLowerCase()}/fEAMWrvBHeTrX9r0gM
              </div>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://teams.live.com/l/community/${selectedCommunity.toLowerCase()}/fEAMWrvBHeTrX9r0gM`
                  );
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communities;
