import { format } from "date-fns";
import axios from "../api/axios";
import EmojiPicker from "emoji-picker-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { createSocketConnection } from "../utils/socket";
import DefaultAvatar from "./ui/DefaultAvatar";

const Chat = () => {
  // Get user from Redux store with strict authentication check
  const userState = useSelector((state) => state.user);
  const { isAuthenticated, user: currentAuthUser } = userState;
  const loggedInUser = currentAuthUser; // Don't provide fallback to ensure we only use real user data
  const { userId } = useParams();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [chatPartner, setChatPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const loggedInUserId = loggedInUser ? loggedInUser._id : null;

const fetchChat = async () => {
  try {
    const response = await axios.get(`/chat/getChat/${userId}`, {
      withCredentials: true,
    });

    console.log("User data fetched: ", response.data);

    const chatMessages = response.data?.map((message) => ({
      id: message._id,
      senderId: message.senderId._id,
      firstName: message?.senderId?.firstName,
      lastName: message?.senderId?.lastName,
      photoUrl: message?.senderId?.photoUrl,
      text: message?.text,
      timestamp: message?.createdAt,
    }));

    setMessages(chatMessages);

    const firstMessage = chatMessages?.[0];
    if (firstMessage?.senderId !== loggedInUserId) {
      setChatPartner({
        firstName: firstMessage.firstName,
        lastName: firstMessage.lastName,
        photoUrl: firstMessage.photoUrl,
      });
    }
            setIsLoading(false);

  } catch (err) {
    console.error("Error fetching chat: ", err);
            setIsLoading(false);

  }
};


useEffect(()=>{
      setIsLoading(true);

  fetchChat();
},[])


  useEffect(() => {
    // Only attempt to connect if we have both user IDs
    // Don't depend on authentication state to prevent unnecessary reconnections
    if (!userId) return;

    // Use the ID if available, otherwise use a placeholder
    const currentUserId = loggedInUserId || "temp-user-id";

    try {
      console.log(
        `Attempting socket connection for chat between ${currentUserId} and ${userId}`
      );
      const socket = createSocketConnection();
      const firstName = loggedInUser ? loggedInUser?.firstName : "User";

      socket.emit("joinChat", {
        firstName,
        loggedInUserId: currentUserId,
        userId,
      });

      socket.on("receiveMessage", ({ senderFirstName, content }) => {
        console.log(senderFirstName + " has send this message: " + content);
      });

      return () => {
        socket.disconnect();
        console.log(`Socket disconnected for chat`);
      };
    } catch (err) {
      console.error("Socket connection error:", err);
    }
  }, [userId, loggedInUserId]);

  const currentUser = {
    id: loggedInUser?._id || "current-user-id", 
    firstName: loggedInUser?.firstName || "You",
    lastName: loggedInUser?.lastName || "",
    photoUrl: loggedInUser?.photoUrl || null,
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


  // Scroll to bottom whenever messages change
  useEffect(() => {
    // Immediate scroll
    scrollToBottom("auto");

    // Also scroll after a short delay to ensure all content is rendered
    const timer = setTimeout(() => {
      scrollToBottom("auto");
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  // Also scroll to bottom when the component first loads and when loading completes
  useEffect(() => {
    // Initial scroll to bottom
    scrollToBottom("auto");

    // Set up multiple scroll attempts to ensure it works
    const timers = [
      setTimeout(() => scrollToBottom("auto"), 100),
      setTimeout(() => scrollToBottom("auto"), 300),
      setTimeout(() => scrollToBottom("auto"), 500),
      setTimeout(() => scrollToBottom("auto"), 1000),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [isLoading]);

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

  // Enhanced scrollToBottom function with fallbacks
  const scrollToBottom = (behavior = "smooth") => {
    try {
      // First try using the end ref
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior });
        return;
      }

      // If end ref isn't available, try using the container ref
      if (messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        container.scrollTop = container.scrollHeight;
        return;
      }

      // Last resort: try to find the messages container by class name
      const messagesContainer = document.querySelector(".messages-container");
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return;
      }
    } catch (err) {
      console.error("Error scrolling to bottom:", err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const firstName = loggedInUser ? loggedInUser?.firstName : null;

    // Create a local message object for immediate display
    const message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: userId,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Add message to local state for immediate display
    setMessages([...messages, message]);

    try {
      if (!isAuthenticated) {
        console.error("Cannot send message: User not authenticated");
        return;
      }

      const loggedInUserId = loggedInUser?._id;

      if (!loggedInUserId) {
        console.error("Cannot send message: No valid user ID");
        return;
      }

      // Use the existing socket connection from the ref
      if (socketRef.current && socketRef.current.connected) {
        console.log(
          "Sending message using existing socket:",
          socketRef.current.id
        );

        // Emit the message through the existing socket
        socketRef.current.emit("sendMessage", {
          senderFirstName: firstName,
          senderId: loggedInUserId,
          receiverId: userId,
          content: newMessage,
        });
      } else {
        console.error("Socket not connected, cannot send message");

        // If socket is not connected, try to reconnect
        const socket = createSocketConnection();
        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("New socket connected for sending message:", socket.id);

          // First join the chat room
          socket.emit("joinChat", { loggedInUserId, userId });

          // Then send the message
          socket.emit("sendMessage", {
            senderFirstName: firstName,
            senderId: loggedInUserId,
            receiverId: userId,
            content: newMessage,
          });
        });

        // Handle connection errors
        socket.on("connect_error", (error) => {
          console.error("Socket connection error when sending message:", error);
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }

    // Clear the input field and focus it for the next message
    setNewMessage("");
    messageInputRef.current.focus();
  };

  const formatMessageTime = (timestamp) => {
    return format(new Date(timestamp), "h:mm a");
  };

  // Convert URLs in text to clickable links
  const linkifyText = (text) => {
    if (!text) return "";

    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // If no URLs found, return the original text
    if (!text.match(urlRegex)) {
      return text;
    }

    // Use replace with a function to convert URLs to React elements
    let lastIndex = 0;
    const result = [];
    let counter = 0;

    // Replace each URL with a React element
    text.replace(urlRegex, (url) => {
      // Get the position where the URL was found
      const matchIndex = text.indexOf(url, lastIndex);

      // Add the text before the URL
      if (matchIndex > lastIndex) {
        result.push(text.substring(lastIndex, matchIndex));
      }

      // Add the URL as a link
      result.push(
        <a
          key={counter++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="message-link"
        >
          {url}
        </a>
      );

      // Update the last index
      lastIndex = matchIndex + url.length;

      return url;
    });

    // Add any remaining text after the last URL
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }

    return result;
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Create a ref to store the socket instance
  const socketRef = useRef(null);

  // Socket connection effect
  useEffect(() => {
    // Only create socket connection if authenticated
    if (!isAuthenticated || !userId) return;

    try {
      // Get the logged in user ID
      const loggedInUserId = loggedInUser?._id;

      // Only proceed if we have a valid user ID
      if (!loggedInUserId) {
        console.error("No valid user ID available for socket connection");
        return;
      }

      // Create socket connection
      const socket = createSocketConnection();
      socketRef.current = socket;

      // Connect and join chat room
      socket.on("connect", () => {
        console.log("Socket connected with ID:", socket.id);
        // Emit joinChat after successful connection
        socket.emit("joinChat", { loggedInUserId, userId });
      });

      // Listen for connection errors
      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      // Listen for incoming messages
      socket.on("receiveMessage", (data) => {
        console.log("Received message:", data);
        // Add received message to state
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: `msg-${Date.now()}`,
            senderId: data.senderId,
            receiverId: loggedInUserId,
            content: data.content,
            timestamp: data.timestamp || new Date().toISOString(),
          },
        ]);
      });

      // Clean up socket connection on component unmount
      return () => {
        if (socket) {
          console.log("Disconnecting socket:", socket.id);
          socket.disconnect();
          socketRef.current = null;
        }
      };
    } catch (err) {
      console.error("Error in socket connection:", err);
    }
  }, [userId, loggedInUserId, loggedInUser]);

  // No sample messages needed as we show the welcome message separately
  const generateSampleMessages = () => {
    return [];
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`chat-page ${darkMode ? "dark-mode" : "light-mode"}`}>
        {/* Fixed Top Navigation */}
        <div className="chat-top-nav">
          <div className="msg-cont">
            <div className="chat-top-left">
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
            </div>

            <div className="chat-top-center">
              <div className="chat-user-info">
                <div className="chat-user-avatar">
                  <DefaultAvatar />
                </div>
                <h2 className="chat-user-name">Loading...</h2>
              </div>
            </div>

            <div className="chat-top-right">
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
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="chat-main-container">
          <div className="messages-container">
            <div className="messages-wrapper msg-cont">
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading chat...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Input Area at Bottom */}
        <div className="chat-input-area">
          <form className="message-input-container msg-cont">
            <div className="emoji-input-container">
              <span className="emoji-button-disabled">
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Type a message..."
                className="message-input"
                value=""
                onChange={() => {}}
                disabled
              />
            </div>
            {/* Send button hidden when disabled */}
          </form>
        </div>
      </div>
    );
  }

  // We'll only show a loading indicator if we're still loading
  // but we won't redirect - let the ProtectedRoute handle that
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-page ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* Fixed Top Navigation */}
      <div className="chat-top-nav">
        <div className="msg-cont">
          <div className="chat-top-left">
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
          </div>

          <div className="chat-top-center">
            <div className="chat-user-info">
              {chatPartner?.photoUrl ? (
                <img
                  src={chatPartner?.photoUrl}
                  alt={`${chatPartner?.firstName || "Unknown"} ${
                    chatPartner?.lastName || ""
                  }`}
                  className="chat-user-avatar"
                />
              ) : (
                <div className="chat-user-avatar">
                  <DefaultAvatar />
                </div>
              )}
              <h2 className="chat-user-name">
                {`${chatPartner?.firstName || "Unknown"} ${
                  chatPartner?.firstName || ""
                }`}
              </h2>
            </div>
          </div>

          <div className="chat-top-right">
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
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="chat-main-container">
        {/* Scrollable Messages Container */}
        <motion.div
          className="messages-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          ref={messagesContainerRef}
        >
          <div className="messages-wrapper msg-cont">
            {/* Responsive Welcome Message */}
            <motion.div
              className="welcome-message-container"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="welcome-message">
                
                <h3>
                Welcome to your conversation with {chatPartner?.firstName || "Unknown"}
                </h3>
                <p className="welcome-description">
                  Start chatting to collaborate on projects!
                </p>
              </div>
            </motion.div>

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${
                    message.senderId === currentUser.id ||
                    message.senderId === loggedInUser?._id
                      ? "sent"
                      : "received"
                  }`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 20 }}
                >
                  <div className="message-content">
                    <p>{linkifyText(message.content)}</p>
                    <span className="message-time">
                      {formatMessageTime(message.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </motion.div>

        {showScrollButton && (
          <motion.button
            className="scroll-to-bottom-button"
            onClick={() => scrollToBottom()}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
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
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </motion.button>
        )}
      </div>

      {/* Fixed Input Area at Bottom */}
      <div className="chat-input-area">
        <form
          className="message-input-container msg-cont"
          onSubmit={handleSendMessage}
        >
          <div className="emoji-input-container">
            <button
              type="button"
              className="emoji-button"
              onClick={toggleEmojiPicker}
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
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="message-input"
              ref={messageInputRef}
            />
          </div>

          {showEmojiPicker && (
            <div className="emoji-picker-container" ref={emojiPickerRef}>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width="100%"
                height="350px"
                theme={darkMode ? "dark" : "light"}
              />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
            animate={{
              opacity: newMessage.trim() ? 1 : 0,
              width: newMessage.trim() ? "auto" : 0,
              marginLeft: newMessage.trim() ? "0.5rem" : 0,
            }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
