import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import DefaultAvatar from "./ui/DefaultAvatar";

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Sample data for demonstration
  const currentUser = {
    id: "current-user-id",
    firstName: "You",
    lastName: "",
    photoUrl: null,
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      setIsLoading(true);
      try {
        // Fetch user info
        const userResponse = await axios.get(`/user/info/${userId}`, {
          withCredentials: true,
        });
        setUser(userResponse.data.data);

        // In a real app, fetch messages here
        // For now, using sample data
        setMessages(generateSampleMessages(userId));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load chat. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserAndMessages();
    }
  }, [userId]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  // Add scroll event listener to show/hide scroll button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Show button if user has scrolled up more than 200px from bottom
      const isScrolledUp =
        container.scrollHeight - container.scrollTop - container.clientHeight >
        200;
      setShowScrollButton(isScrolledUp);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: userId,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    messageInputRef.current.focus();
  };

  const formatMessageTime = (timestamp) => {
    return format(new Date(timestamp), "h:mm a");
  };

  // Generate sample messages for demonstration
  const generateSampleMessages = (partnerId) => {
    const now = new Date();
    return [
      {
        id: "msg1",
        senderId: "current-user-id",
        receiverId: partnerId,
        content: "Hey there! How's your coding project going?",
        timestamp: new Date(now.getTime() - 120 * 60000).toISOString(), // 2 hours ago
      },
      {
        id: "msg2",
        senderId: partnerId,
        receiverId: "current-user-id",
        content: "It's going well! I'm working on a React component right now.",
        timestamp: new Date(now.getTime() - 118 * 60000).toISOString(),
      },
      {
        id: "msg3",
        senderId: "current-user-id",
        receiverId: partnerId,
        content: "Nice! Are you using any specific libraries?",
        timestamp: new Date(now.getTime() - 115 * 60000).toISOString(),
      },
      {
        id: "msg4",
        senderId: partnerId,
        receiverId: "current-user-id",
        content:
          "Yes, I'm using Framer Motion for animations and Tailwind for styling. The combination is really powerful!",
        timestamp: new Date(now.getTime() - 110 * 60000).toISOString(),
      },
      {
        id: "msg5",
        senderId: "current-user-id",
        receiverId: partnerId,
        content:
          "That sounds great! I've been meaning to try Tailwind. Would you recommend it for someone just starting with CSS frameworks?",
        timestamp: new Date(now.getTime() - 105 * 60000).toISOString(),
      },
      {
        id: "msg6",
        senderId: partnerId,
        receiverId: "current-user-id",
        content:
          "Absolutely! It has a bit of a learning curve but once you get used to the utility-first approach, it's super productive.",
        timestamp: new Date(now.getTime() - 100 * 60000).toISOString(),
      },
      {
        id: "msg7",
        senderId: "current-user-id",
        receiverId: partnerId,
        content:
          "Do you have any resources you'd recommend for learning Tailwind?",
        timestamp: new Date(now.getTime() - 95 * 60000).toISOString(),
      },
      {
        id: "msg8",
        senderId: partnerId,
        receiverId: "current-user-id",
        content:
          "The official documentation is really good, but I also found some great tutorials on YouTube. I'll send you the links.",
        timestamp: new Date(now.getTime() - 90 * 60000).toISOString(),
      },
      {
        id: "msg9",
        senderId: partnerId,
        receiverId: "current-user-id",
        content:
          "https://tailwindcss.com/docs and https://www.youtube.com/watch?v=UBOj6rqRUME",
        timestamp: new Date(now.getTime() - 89 * 60000).toISOString(),
      },
      {
        id: "msg10",
        senderId: "current-user-id",
        receiverId: partnerId,
        content:
          "Thanks! I'll check them out. What kind of project are you working on?",
        timestamp: new Date(now.getTime() - 80 * 60000).toISOString(),
      },
      {
        id: "msg11",
        senderId: partnerId,
        receiverId: "current-user-id",
        content:
          "I'm building a portfolio website with a blog section. I want to showcase my projects and share my learning journey.",
        timestamp: new Date(now.getTime() - 75 * 60000).toISOString(),
      },
      {
        id: "msg12",
        senderId: "current-user-id",
        receiverId: partnerId,
        content:
          "That sounds awesome! Are you using any backend technology for the blog?",
        timestamp: new Date(now.getTime() - 70 * 60000).toISOString(),
      },
      {
        id: "msg13",
        senderId: partnerId,
        receiverId: "current-user-id",
        content:
          "I'm using Node.js with Express for the API and MongoDB for the database. It's a MERN stack application.",
        timestamp: new Date(now.getTime() - 65 * 60000).toISOString(),
      },
      {
        id: "msg14",
        senderId: "current-user-id",
        receiverId: partnerId,
        content:
          "Nice choice! I've been working with the MERN stack too. Have you deployed it yet?",
        timestamp: new Date(now.getTime() - 60 * 60000).toISOString(),
      },
      {
        id: "msg15",
        senderId: partnerId,
        receiverId: "current-user-id",
        content:
          "Not yet, I'm still working on the frontend. I'm planning to deploy it on Vercel for the frontend and Render for the backend.",
        timestamp: new Date(now.getTime() - 55 * 60000).toISOString(),
      },
      {
        id: "msg16",
        senderId: "current-user-id",
        receiverId: partnerId,
        content: "That's a good combination. Vercel is great for React apps.",
        timestamp: new Date(now.getTime() - 50 * 60000).toISOString(),
      },
      {
        id: "msg17",
        senderId: partnerId,
        receiverId: "current-user-id",
        content:
          "Yeah, I love their CI/CD pipeline. It makes deployment so easy.",
        timestamp: new Date(now.getTime() - 45 * 60000).toISOString(),
      },
      {
        id: "msg18",
        senderId: "current-user-id",
        receiverId: partnerId,
        content: "Absolutely! Are you using any state management library?",
        timestamp: new Date(now.getTime() - 40 * 60000).toISOString(),
      },
      {
        id: "msg19",
        senderId: partnerId,
        receiverId: "current-user-id",
        content:
          "I'm using Redux Toolkit. It simplifies a lot of the Redux boilerplate.",
        timestamp: new Date(now.getTime() - 35 * 60000).toISOString(),
      },
      {
        id: "msg20",
        senderId: "current-user-id",
        receiverId: partnerId,
        content:
          "Good choice! Redux Toolkit is much more developer-friendly than plain Redux.",
        timestamp: new Date(now.getTime() - 30 * 60000).toISOString(),
      },
      {
        id: "msg21",
        senderId: partnerId,
        receiverId: "current-user-id",
        content:
          "Definitely! What about you? What are you working on these days?",
        timestamp: new Date(now.getTime() - 25 * 60000).toISOString(),
      },
      {
        id: "msg22",
        senderId: "current-user-id",
        receiverId: partnerId,
        content:
          "I'm building a social media platform for developers, kind of like this one! It's a place where developers can connect and collaborate.",
        timestamp: new Date(now.getTime() - 20 * 60000).toISOString(),
      },
      {
        id: "msg23",
        senderId: partnerId,
        receiverId: "current-user-id",
        content:
          "That sounds really interesting! I'd love to check it out when it's ready.",
        timestamp: new Date(now.getTime() - 15 * 60000).toISOString(),
      },
      {
        id: "msg24",
        senderId: "current-user-id",
        receiverId: partnerId,
        content: "Sure thing! I'll send you an invite when it's in beta.",
        timestamp: new Date(now.getTime() - 10 * 60000).toISOString(),
      },
      {
        id: "msg25",
        senderId: partnerId,
        receiverId: "current-user-id",
        content: "Maybe we could collaborate on a project sometime?",
        timestamp: new Date(now.getTime() - 5 * 60000).toISOString(),
      },
    ];
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`chat-page ${darkMode ? "dark-mode" : "light-mode"}`}>
        <div className="chat-top-nav">
          <button
            onClick={() => navigate(-1)}
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
            <span>Back</span>
          </button>
          <button
            onClick={toggleDarkMode}
            className="theme-toggle"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
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
        <div className="chat-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`chat-page ${darkMode ? "dark-mode" : "light-mode"}`}>
        <div className="chat-top-nav">
          <button
            onClick={() => navigate(-1)}
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
            <span>Back</span>
          </button>
          <button
            onClick={toggleDarkMode}
            className="theme-toggle"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
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
        <div className="chat-container">
          <div className="error-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h2 className="error-title">Error Loading Chat</h2>
            <p className="error-message">{error}</p>
            <button className="error-button" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-page ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="chat-top-nav">
        <button
          onClick={() => navigate(-1)}
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
          <span>Back</span>
        </button>
        <div className="chat-user-info">
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={`${user?.firstName || "Unknown"} ${
                user?.lastName || "User"
              }`}
              className="chat-user-avatar"
            />
          ) : (
            <div className="chat-user-avatar">
              <DefaultAvatar />
            </div>
          )}
          <h2 className="chat-user-name">
            {`${user?.firstName || "Unknown"} ${user?.lastName || "User"}`}
          </h2>
        </div>
        <button
          onClick={toggleDarkMode}
          className="theme-toggle"
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

      <motion.div
        className="chat-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="messages-container" ref={messagesContainerRef}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`message ${
                  message.senderId === currentUser.id ? "sent" : "received"
                }`}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {showScrollButton && (
          <motion.button
            className="scroll-to-bottom-button"
            onClick={() => scrollToBottom()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </motion.button>
        )}

        <form className="message-input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
            ref={messageInputRef}
          />
          <motion.button
            type="submit"
            className="send-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!newMessage.trim()}
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
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Chat;
