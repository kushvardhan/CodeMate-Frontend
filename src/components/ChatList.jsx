import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { createSocketConnection } from "../utils/socket";
import DefaultAvatar from "./ui/DefaultAvatar";

const ChatList = ({ selectedUserId, onUserSelect }) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [connections, setConnections] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const loggedInUser = useSelector((state) => state.user.user);
  const socketRef = useRef(null);

  // Fetch chat list data
  const fetchChatData = useCallback(async () => {
    if (!loggedInUser?._id) return;

    try {
      setLoading(true);

      // Use the new efficient chat-list endpoint
      const response = await axios.get("/chat/chat-list", {
        withCredentials: true,
      });

      const chatListData = response.data?.data || [];
      setChatData(chatListData);

      // Extract connections for backward compatibility
      const connectionsData = chatListData.map((chat) => chat.user);
      setConnections(connectionsData);
    } catch (error) {
      console.error("Error fetching chat data:", error);
      // Fallback to empty data
      setChatData([]);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  }, [loggedInUser]);

  useEffect(() => {
    fetchChatData();
  }, [fetchChatData]);

  // Setup socket connection for real-time updates
  useEffect(() => {
    if (!loggedInUser?._id) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    // Join user room for real-time updates
    const joinUserRoom = () => {
      if (socket.connected) {
        socket.emit("joinUserRoom", { userId: loggedInUser._id });
      }
    };

    // Join immediately if connected, or wait for connection
    if (socket.connected) {
      joinUserRoom();
    } else {
      socket.on("connect", joinUserRoom);
    }

    // Debounce chat data updates to prevent excessive API calls
    let updateTimeout;
    const debouncedFetchChatData = () => {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        fetchChatData();
      }, 500);
    };

    // Listen for new messages to update chat list
    const handleReceiveMessage = ({ senderId }) => {
      console.log("ChatList received new message from:", senderId);
      debouncedFetchChatData();
    };

    // Listen for unseen count updates
    const handleUnseenCountUpdate = () => {
      console.log("ChatList received unseen count update");
      debouncedFetchChatData();
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("unseenCountUpdate", handleUnseenCountUpdate);

    return () => {
      // Clean up event listeners and timeout
      clearTimeout(updateTimeout);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("unseenCountUpdate", handleUnseenCountUpdate);
      socket.off("connect", joinUserRoom);
      socketRef.current = null;
    };
  }, [loggedInUser, fetchChatData]);

  // Filter chat data based on active tab and search query
  const filteredChatData = chatData.filter((chat) => {
    const matchesSearch =
      chat.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.user.lastName.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "unseen") {
      return matchesSearch && chat.unseenCount > 0;
    }

    return matchesSearch;
  });

  const handleUserClick = (userId) => {
    if (window.innerWidth <= 768) {
      // On mobile, navigate to individual chat page
      navigate(`/chat/${userId}`);
    } else {
      // On desktop, update selected user
      onUserSelect && onUserSelect(userId);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateMessage = (text, maxLength = 40) => {
    if (!text) return "No messages yet";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading) {
    return (
      <div className={`chat-list-container ${darkMode ? "dark" : ""}`}>
        <div className="chat-list-loading">
          <div className="loading-spinner"></div>
          <p>Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-list-container ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <div className="chat-list-header">
        <h2>Recent chats</h2>
        <button className="new-chat-btn">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="chat-search">
        <div className="search-input-container">
          <svg
            className="search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="chat-tabs">
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`tab-btn ${activeTab === "unseen" ? "active" : ""}`}
          onClick={() => setActiveTab("unseen")}
        >
          Unread
        </button>
      </div>

      {/* Chat List */}
      <div className="chat-list">
        {filteredChatData.length === 0 ? (
          <div className="no-chats">
            <p>
              {activeTab === "unseen"
                ? "No unread messages"
                : "No conversations yet"}
            </p>
          </div>
        ) : (
          filteredChatData.map((chat) => (
            <div
              key={chat.user._id}
              className={`chat-item ${
                selectedUserId === chat.user._id ? "selected" : ""
              }`}
              onClick={() => handleUserClick(chat.user._id)}
            >
              <div className="chat-avatar">
                {chat.user.photoUrl ? (
                  <img src={chat.user.photoUrl} alt={chat.user.firstName} />
                ) : (
                  <DefaultAvatar
                    name={`${chat.user.firstName} ${chat.user.lastName}`}
                  />
                )}
                <div className="online-indicator"></div>
              </div>

              <div className="chat-content">
                <div className="chat-header">
                  <h3 className="chat-name">
                    {chat.user.firstName} {chat.user.lastName}
                  </h3>
                  <span className="chat-time">
                    {formatTime(chat.lastMessageTime)}
                  </span>
                </div>

                <div className="chat-preview">
                  <p className="last-message">
                    {chat.lastMessage
                      ? truncateMessage(chat.lastMessage.text)
                      : "Start a conversation"}
                  </p>
                  {chat.unseenCount > 0 && (
                    <span className="unseen-badge">{chat.unseenCount}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
