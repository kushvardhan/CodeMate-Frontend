import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Chat from "./Chat";
import ChatList from "./ChatList";

const Chats = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(userId || null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const ChatHeader = () => (
    <div className="profile-top-nav">
      <button
        onClick={() => navigate("/")}
        className="back-button"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Home</span>
      </button>

      <button
        onClick={toggleDarkMode}
        className={`theme-toggle ${darkMode ? "dark" : "light"}`}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </button>
    </div>
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update selected user when URL changes
  useEffect(() => {
    setSelectedUserId(userId || null);
  }, [userId]);

  const handleUserSelect = (newUserId) => {
    setSelectedUserId(newUserId);
    if (!isMobile) {
      // On desktop, update URL without navigation
      window.history.replaceState(null, "", `/chats/${newUserId}`);
    } else {
      // On mobile, navigate to individual chat
      navigate(`/chat/${newUserId}`);
    }
  };

  const ChatWelcome = () => (
    <div className="chat-welcome">
      <div className="chat-welcome-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          <path d="M8 10h.01"></path>
          <path d="M12 10h.01"></path>
          <path d="M16 10h.01"></path>
        </svg>
      </div>
      <h2>Welcome to CodeMate Chat</h2>
      <p>Select a conversation to start messaging with your connections.</p>
    </div>
  );

  if (isMobile) {
    // On mobile, show only the chat list (individual chats are handled by separate Chat component)
    return (
      <div className={`chat-layout ${darkMode ? "dark" : ""}`}>
        <ChatHeader />
        <div className="chat-content">
          <ChatList
            selectedUserId={selectedUserId}
            onUserSelect={handleUserSelect}
          />
        </div>
      </div>
    );
  }

  // Desktop layout with sidebar and chat area
  return (
    <div className={`chat-layout ${darkMode ? "dark" : ""}`}>
      {/* Only show header when no chat is selected */}
      {!selectedUserId && <ChatHeader />}
      <div className="chat-layout-content">
        <div className="chat-sidebar">
          <ChatList
            selectedUserId={selectedUserId}
            onUserSelect={handleUserSelect}
          />
        </div>
        <div className="chat-main">
          {selectedUserId ? (
            <Chat userId={selectedUserId} isEmbedded={true} />
          ) : (
            <ChatWelcome />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
