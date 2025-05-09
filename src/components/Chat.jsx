import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    // Just load sample data without any API calls
    setIsLoading(true);

    // Sample user data
    setUser({
      id: userId,
      firstName: "John",
      lastName: "Developer",
      photoUrl: null, // Will use DefaultAvatar
      skills: ["React", "Node.js", "MongoDB"],
    });

    // Sample messages
    setMessages(generateSampleMessages(userId));

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
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
          "I'm building a  Nice choice! I've been working with the MERN stack too. Have you deployed it yet? Nice choice! I've been working with the MERN stack too. Have you deployed it yet? Nice choice! I've been working with the MERN stack too. Have you deployed it yet? media platform for developers, kind of like this one! It's a place where developers can connect and collaborate.",
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
      <div
        className={`chat-page h-screen flex flex-col ${
          darkMode ? "dark-mode" : "light-mode"
        }`}
      >
        {/* Fixed Top Navigation with 3D effect */}
        <div
          className="chat-top-nav flex justify-between items-center p-4 fixed top-0 left-0 right-0 z-50 shadow-lg"
          style={{
            boxShadow: darkMode
              ? "0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)"
              : "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)",
            transform: "translateZ(10px)",
            backgroundColor: darkMode ? "var(--card-bg)" : "white",
            borderBottom: `1px solid ${
              darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
            }`,
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="back-button flex items-center"
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
            <span className="ml-2 hidden sm:inline">Back</span>
          </button>

          <h1 className="text-lg font-semibold">Chat</h1>

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

        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="loading-container flex flex-col items-center justify-center p-8">
            <div
              className="loading-spinner w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin mb-4"
              style={{
                borderTopColor: darkMode ? "#3182ce" : "#4f46e5",
              }}
            ></div>
            <p className="loading-text text-lg font-medium">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  // We don't need error handling since we're using sample data
  // But keeping this commented out for future reference when real API is implemented
  /*
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
  */

  return (
    <div
      className={`chat-page h-screen flex flex-col ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* Fixed Top Navigation with 3D effect */}
      <div
        className="chat-top-nav flex justify-between items-center p-4 fixed top-0 left-0 right-0 z-50 shadow-lg"
        style={{
          boxShadow: darkMode
            ? "0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)"
            : "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)",
          transform: "translateZ(10px)",
          backgroundColor: darkMode ? "var(--card-bg)" : "white",
          borderBottom: `1px solid ${
            darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
          }`,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="back-button flex items-center"
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
          <span className="ml-2 hidden sm:inline">Back</span>
        </button>

        <h1 className="text-lg font-bold">Chat</h1>

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

      {/* User Info Header - Fixed below top nav */}
      <div
        className="chat-user-header flex items-center py-2 px-4 fixed top-16 left-0 right-0 z-40 shadow-md"
        style={{
          backgroundColor: darkMode
            ? "rgba(30, 30, 30, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${
            darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
          }`,
        }}
      >
        <div className="flex items-center">
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={`${user?.firstName || "Unknown"} ${
                user?.lastName || "User"
              }`}
              className="w-9 h-9 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-9 h-9 rounded-full mr-3 flex items-center justify-center overflow-hidden">
              <DefaultAvatar />
            </div>
          )}
          <div>
            <h2 className="font-semibold text-base">
              {`${user?.firstName || "Unknown"} ${user?.lastName || "User"}`}
            </h2>
            <p className="text-xs opacity-70 mt-0.5">
              {user?.skills?.slice(0, 2).join(", ")}
              {user?.skills?.length > 2 && ` +${user.skills.length - 2} more`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Container with proper spacing for fixed headers */}
      <div className="flex-1 flex flex-col pt-32 pb-20">
        {/* Scrollable Messages Container */}
        <motion.div
          className="flex-1 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div
            className="messages-container h-full overflow-y-auto px-4 py-2"
            ref={messagesContainerRef}
            style={{
              maxHeight: "calc(100vh - 130px - 70px)",
            }}
          >
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
              className="scroll-to-bottom-button fixed right-6 bottom-24 z-30 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: darkMode
                  ? "rgba(49, 130, 206, 0.9)"
                  : "rgba(79, 70, 229, 0.9)",
                color: "white",
                boxShadow: darkMode
                  ? "0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)"
                  : "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)",
              }}
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
        </motion.div>
      </div>

      {/* Fixed Input Area at Bottom */}
      <div
        className="chat-input-area fixed bottom-0 left-0 right-0 p-4 z-40"
        style={{
          backgroundColor: darkMode
            ? "rgba(30, 30, 30, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          borderTop: `1px solid ${
            darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
          }`,
          boxShadow: darkMode
            ? "0 -4px 12px rgba(0, 0, 0, 0.2)"
            : "0 -4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="max-w-4xl mx-auto w-full">
          <form
            className="message-input-container flex items-center p-2 rounded-full"
            onSubmit={handleSendMessage}
            style={{
              backgroundColor: darkMode
                ? "rgba(45, 55, 72, 0.5)"
                : "rgba(237, 242, 247, 0.8)",
              boxShadow: darkMode
                ? "0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.05)"
                : "0 2px 8px rgba(0, 0, 0, 0.05), inset 0 1px 2px rgba(0, 0, 0, 0.05)",
              border: `1px solid ${
                darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"
              }`,
            }}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="message-input flex-1 px-4 py-2 bg-transparent border-none outline-none"
              style={{
                color: darkMode
                  ? "rgba(255, 255, 255, 0.9)"
                  : "rgba(0, 0, 0, 0.8)",
              }}
              ref={messageInputRef}
            />
            <motion.button
              type="submit"
              className="send-button ml-2 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: darkMode
                  ? "rgba(49, 130, 206, 0.9)"
                  : "rgba(79, 70, 229, 0.9)",
                color: "white",
                boxShadow: darkMode
                  ? "0 2px 6px rgba(0, 0, 0, 0.3)"
                  : "0 2px 6px rgba(0, 0, 0, 0.1)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!newMessage.trim()}
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
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
