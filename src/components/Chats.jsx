import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Chat from "./Chat";
import ChatList from "./ChatList";
import Footer from "./ui/Footer";
import Nav from "./ui/Nav";

const Chats = () => {
  const { darkMode } = useTheme();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(userId || null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
        <Nav />
        <div className="navbar-spacer"></div>
        <div className="chat-sidebar">
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
      <Nav />
      <div className="navbar-spacer"></div>
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
      <Footer />
    </div>
  );
};

export default Chats;
