/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { addConnection } from "../slice/ConnectionSlice";
import { addRequest } from "../slice/RequestSlice";
import { fetchUnseenCounts } from "../slice/unseenSlice";
import Card from "./ui/Card";
import Nav from "./ui/Nav";

const Home = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request) || [];
  const connections = useSelector((state) => state.connection) || [];

  const unseenChats = useSelector((state) => state.unseenMessage.unseenChats) || [];
  const loggedInUser = useSelector((state) => state.user.user);
useEffect(() => {
  if (loggedInUser?._id) {
    console.log("yeorIR ",loggedInUser._id );
    dispatch(fetchUnseenCounts(loggedInUser._id));
  }
  else{
console.log("BHS");
  }
  
}, [dispatch, loggedInUser]);

// Render count:



  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Fetch requests and connections data immediately when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        try {
          // Try to fetch requests
          const requestsResponse = await axios.get("/user/request/received", {
            withCredentials: true,
          });

          if (requestsResponse.data && requestsResponse.data.data) {
            dispatch(addRequest(requestsResponse.data.data));
          } else if (requestsResponse.data) {
            dispatch(addRequest(requestsResponse.data));
          }
        } catch (requestError) {
          console.log(requestError);
        }

        try {
          // Try to fetch connections
          const connectionsResponse = await axios.get(
            "/user/request/connections",
            {
              withCredentials: true,
            }
          );

          if (connectionsResponse.data && connectionsResponse.data.data) {
            dispatch(addConnection(connectionsResponse.data.data));
          } else if (connectionsResponse.data) {
            dispatch(addConnection(connectionsResponse.data));
          }
        } catch (connectionsError) {
          console.log(connectionsError);
        }
      } catch (error) {
        // This will only catch errors that occur outside the inner try/catch blocks
        console.error("Error in fetchData:", error);
      }
    };

    // Fetch data immediately when component mounts
    fetchData();

    // Set up interval to refresh data every 10 seconds for real-time updates
    const intervalId = setInterval(fetchData, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch]);
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousCards, setPreviousCards] = useState([]); // Store swiped cards for rewind function

  // State to track loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // This useEffect has been consolidated with the one above

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Make API call to fetch feed data
        const response = await axios.get("/user/feed", {
          withCredentials: true,
        });
        console.log(response);
        // Data fetched successfully

        if (response.data && response.data.data) {
          // Map the backend data to match the expected format for cards
          const formattedUsers = response.data.data.map((user) => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName || ""}`.trim(),
            image: user.photoUrl || "https://i.imgur.com/6YQ1Zzt.png", // Use default if no image
            bio: user.about || "No bio available",
            skills: user.skills || [],
            age: user.age || null,
            gender: user.gender || null,
          }));

          setUsers(formattedUsers);
        } else {
          // Fallback to empty array if no data
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching feed data:", err);
        setError("Failed to load profiles. Please try again later.");

        // If unauthorized, you might want to redirect to login
        if (err.response && err.response.status === 401) {
          // Redirect to login page
          window.location.href = "/login";
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // State to track if all cards have been swiped
  const [allCardsFinished, setAllCardsFinished] = useState(false);
  // State to track if a card is being swiped
  const [isCardSwiping, setIsCardSwiping] = useState(false);
  // State to track the previous index for animation (used in swipe handlers)
  // eslint-disable-next-line no-unused-vars
  const [prevIndex, setPrevIndex] = useState(null);
  // State to track the swipe direction for animation
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Preload all images when component mounts with high priority
  useEffect(() => {
    if (users.length > 0) {
      // Create a promise for each image load
      const preloadPromises = users.map((user) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Resolve even on error to prevent hanging
          img.src = user.image;
        });
      });

      // Wait for all images to load
      Promise.all(preloadPromises).then(() => {
        // All images preloaded successfully
      });
    }
  }, [users]);

  // Preload the next few card images with highest priority to prevent lag
  useEffect(() => {
    if (users.length > 0 && currentIndex < users.length) {
      // Preload current and next image with highest priority
      const currentImg = new Image();
      // Use setAttribute for better browser compatibility
      currentImg.setAttribute("fetchpriority", "high");
      currentImg.decoding = "sync";
      currentImg.src = users[currentIndex].image;

      // Preload next image if available
      if (currentIndex + 1 < users.length) {
        const nextImg = new Image();
        // Use setAttribute for better browser compatibility
        nextImg.setAttribute("fetchpriority", "high");
        nextImg.decoding = "sync";
        nextImg.src = users[currentIndex + 1].image;
      }

      // Preload additional images with normal priority
      for (let i = 2; i <= 4; i++) {
        if (currentIndex + i < users.length) {
          const img = new Image();
          img.src = users[currentIndex + i].image;
        }
      }
    }
  }, [currentIndex, users]);

  useEffect(() => {}, []);
  // Pre-calculate next index to avoid state updates during animation
  const nextCardIndex =
    currentIndex < users.length - 1 ? currentIndex + 1 : null;

  const handleSwipeLeft = async () => {
    // Handle swipe left (pass)
    if (isCardSwiping) return;

    setIsCardSwiping(true);
    setSwipeDirection("left");
    setPrevIndex(currentIndex);

    const currentCard = users[currentIndex];
    setPreviousCards((prev) => [
      ...prev,
      { card: currentCard, direction: "left" },
    ]);

    // Send "ignored" status to the API
    try {
      const userId = currentCard.id;

      // Make API call to update status
      await axios.post(
        `/request/send/ignored/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );

      // If API call is successful, move to the next card
      if (nextCardIndex !== null) {
        setCurrentIndex(nextCardIndex);

        // Reset swiping state after a short delay
        setTimeout(() => {
          setIsCardSwiping(false);
          setSwipeDirection(null);
        }, 300);
      } else {
        setAllCardsFinished(true);
        setIsCardSwiping(false);
        setSwipeDirection(null);
      }
    } catch (error) {
      console.error("Error sending ignored status:", error);

      // Even if API call fails, still move to the next card
      if (nextCardIndex !== null) {
        setCurrentIndex(nextCardIndex);

        // Reset swiping state after a short delay
        setTimeout(() => {
          setIsCardSwiping(false);
          setSwipeDirection(null);
        }, 300);
      } else {
        setAllCardsFinished(true);
        setIsCardSwiping(false);
        setSwipeDirection(null);
      }
    }
  };

  const handleSwipeRight = async () => {
    // Handle swipe right (like)
    if (isCardSwiping) return;

    setIsCardSwiping(true);
    setSwipeDirection("right");
    setPrevIndex(currentIndex);

    const currentCard = users[currentIndex];
    setPreviousCards((prev) => [
      ...prev,
      { card: currentCard, direction: "right" },
    ]);

    // Send "interested" status to the API
    try {
      const userId = currentCard.id;

      // Make API call to update status
      await axios.post(
        `/request/send/interested/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );

      // If API call is successful, move to the next card
      if (nextCardIndex !== null) {
        setCurrentIndex(nextCardIndex);

        // Reset swiping state after a short delay
        setTimeout(() => {
          setIsCardSwiping(false);
          setSwipeDirection(null);
        }, 300);
      } else {
        setAllCardsFinished(true);
        setIsCardSwiping(false);
        setSwipeDirection(null);
      }
    } catch (error) {
      console.error("Error sending interested status:", error);

      // Even if API call fails, still move to the next card
      if (nextCardIndex !== null) {
        setCurrentIndex(nextCardIndex);

        // Reset swiping state after a short delay
        setTimeout(() => {
          setIsCardSwiping(false);
          setSwipeDirection(null);
        }, 300);
      } else {
        setAllCardsFinished(true);
        setIsCardSwiping(false);
        setSwipeDirection(null);
      }
    }
  };

  // Rewind function to bring back the last card
  const handleRewind = async () => {
    // Check if there are any previous cards
    if (previousCards.length === 0) {
      return;
    }

    // Prevent rewind during swiping
    if (isCardSwiping) return;

    // Get the last card
    const lastCard = previousCards[previousCards.length - 1];

    // If we're rewinding a card, we should cancel the previous action
    try {
      const userId = lastCard.card.id;

      // Make API call to cancel the previous action
      await axios.post(
        `/user/request/cancel/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error canceling previous action:", error);
    }

    // Remove the last card from previousCards
    setPreviousCards((prev) => prev.slice(0, -1));

    // Set swiping state for animation
    setIsCardSwiping(true);
    setSwipeDirection("rewind");

    // Decrement the index to show the previous card
    // The card stack will automatically rerender with the correct cards centered
    setCurrentIndex((prev) => Math.max(prev - 1, 0));

    // Reset swiping state after animation
    setTimeout(() => {
      setIsCardSwiping(false);
      setSwipeDirection(null);
    }, 300);
  };

  // State to track loading sequence
  const [loadingSequence, setLoadingSequence] = useState({
    headingLoaded: false,
    statsLoaded: false,
    cardLoaded: false,
  });

  // Simulate sequential loading
  useEffect(() => {
    // First load the heading
    setTimeout(() => {
      setLoadingSequence((prev) => ({ ...prev, headingLoaded: true }));

      // Then load the stats
      setTimeout(() => {
        setLoadingSequence((prev) => ({ ...prev, statsLoaded: true }));

        // Finally load the card
        setTimeout(() => {
          setLoadingSequence((prev) => ({ ...prev, cardLoaded: true }));
        }, 300); // Delay before showing card
      }, 200); // Delay before showing stats
    }, 100); // Delay before showing heading
  }, []);

  // Effect to reset swiping state when currentIndex changes
  useEffect(() => {
    setIsCardSwiping(false);
    setSwipeDirection(null);
  }, [currentIndex]);

  // Code symbols with small special symbols
  const codeSymbols = [
    "⨉",
    "≔",
    "≅",
    "",
    "</>",
    "* **",
    "!==",
    "#",
    "$",
    "print(",
    "₰",
    "૱",
    "ctrl+C",
    "⩽",
    "⧺",
    "ctrl+V",
    "∑",
    "func(..",
    "∂",
    "∞",
    "for n:∞",
    "⊗",
    "∇",
    "∩",
    "∪",
    "∴",
    "∼",
    "⊆",
    "⊇",
    "⊂",
    "⊃",
  ];

  // Vibrant and glowy colors for symbols, avoiding yellow and green
  const symbolColors = [
    "#FF4500", // Vibrant orange
    "#FF1493", // Deep pink
    "#9400D3", // Dark violet
    "#1E90FF", // Dodger blue
    "#FF6347", // Tomato
    "#FF69B4", // Hot pink
    "#8A2BE2", // Blue violet
    "#DC143C", // Crimson
    "#FF4500", // Orange red
    "#FF1493", // Deep pink
    "#FF6347", // Tomato
    "#8A2BE2", // Blue violet
    "#FF69B4", // Hot pink
    "#DC143C", // Crimson
    "#1E90FF", // Dodger blue
    "#9400D3", // Dark violet
  ];

  // Generate fixed positions for code symbols, ensuring they are spaced apart and not near the card or heading
  const generateFixedPositions = () => {
    const positions = [
      { top: "5%", left: "5%" },
      { top: "10%", left: "20%" },
      { top: "15%", left: "35%" },
      { top: "20%", left: "50%" },
      { top: "25%", left: "70%" },
      { top: "30%", left: "85%" },
      { top: "40%", left: "10%" },
      { top: "45%", left: "25%" },
      { top: "50%", left: "40%" },
      { top: "55%", left: "60%" },
      { top: "60%", left: "75%" },
      { top: "65%", left: "90%" },
      { top: "75%", left: "15%" },
      { top: "80%", left: "30%" },
      { top: "85%", left: "50%" },
      { top: "90%", left: "70%" },
    ];
    return positions;
  };

  const allPositions = generateFixedPositions();

  // Generate random sizes and animation delays for code symbols
  const distributedSymbols = codeSymbols.map((symbol, i) => ({
    name: symbol,
    color: symbolColors[i % symbolColors.length],
    position: allPositions[i % allPositions.length],
    size: `${Math.random() * 20 + 12}px`, // Random size between 15px and 35px
    animationDelay: `${Math.random() * 2}s`, // Random delay between 0s and 2s
  }));

  // This function is not used but kept for reference
  // const handleDrag = (event, info) => {
  //   const screenWidth = window.innerWidth;
  //   const cardWidth = info.point.x;
  //
  //   // Restrict the card's movement to stay within the screen width
  //   if (cardWidth < -screenWidth / 2) {
  //     info.point.x = -screenWidth / 2;
  //   } else if (cardWidth > screenWidth / 2) {
  //     info.point.x = screenWidth / 2;
  //   }
  // };

  return (
    <div className="min-h-screen transition-all duration-300 text-white relative overflow-hidden">
      {/* Background with coding icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0A0F18] dark:bg-[#0A0F18] light:bg-[#f8fafc]"></div>

        {/* Code symbols */}
        {distributedSymbols.map((symbol, i) => (
          <div
            key={`symbol-${i}`}
            style={{
              ...symbol.position,
              fontSize: symbol.size, // Apply random size
              color: symbol.color,
              filter: `blur(0.3px) drop-shadow(0 0 5px ${symbol.color})`, // Subtle glow
              textShadow: `0 0 6px ${symbol.color}`, // Vibrant glow
              opacity: 0.8, // Slightly prominent
              position: "absolute",
              zIndex: 1,
              animation: `togglePosition 3s ease-in-out ${symbol.animationDelay} infinite`, // Add animation
            }}
            className="font-mono font-bold"
          >
            {symbol.name}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="content-wrapper absolute top-[13vh] left-0 right-0 z-10 bg-transparent">
        {/* Navigation */}
        <div className="nav-container">
          <Nav />
        </div>

        {/* Main content */}
        <div className="home-container pt-6 pb-12 mx-auto max-w-4xl bg-transparent">
          {/* Heading and subheading */}
          <motion.div
            className="Headingandsubheading text-center mb-6 relative z-10 p-4 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={
              loadingSequence.headingLoaded
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: -20 }
            }
            transition={{ duration: 0.5 }}
          >
            <motion.h1
  className="hero-heading text-4xl md:text-5xl font-extrabold text-white mb-4 px-6 py-3 rounded-xl border border-white/20 bg-gradient-to-r from-purple-600/70 via-indigo-600/60 to-blue-600/70 backdrop-blur-md shadow-lg drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-tight"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
>
  Connect with Developers
</motion.h1>

<motion.p
  className="hero-subtext text-lg md:text-xl font-medium text-white px-5 py-2 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md shadow-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mt-2 inline-block"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
>
  Swipe. Match. Collaborate. 🚀
</motion.p>

          </motion.div>

          {/* Card component */}
          <motion.div
            className="card-wrapper relative z-10 flex justify-center items-center w-full max-w-full mx-auto mt-2 mb-14"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              loadingSequence.cardLoaded
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
                <div className="no-more-cards-in-place bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 shadow-lg animate-pulse">
    <div className="no-more-cards-content text-white flex flex-col items-center">
      <div className="no-more-icon mb-4">
        <svg
          className="animate-spin text-white w-8 h-8"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-1">Loading Profiles...</h3>
      <p className="text-center opacity-80">
        Please wait while we fetch interesting people for you ✨
      </p>
    </div>
  </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 text-red-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : users.length > 0 &&
              currentIndex < users.length &&
              !allCardsFinished ? (
              <div
                className="tinder-card-stack relative w-full max-w-[340px] mx-auto"
                style={{
                  position: "relative",
                  margin: "0 auto", // Center the card stack
                  overflow: "visible", // Allow overflow for swiping
                  maxWidth: "100%", // Ensure it doesn't exceed the screen width
                  height: "500px", // Fixed height for the container
                }}
              >
                {/* Rewind button */}
                {previousCards.length > 0 && !isCardSwiping && (
                  <motion.button
                    className="rewind-button absolute opacity-0 -left-[9999px] z-30 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
                    onClick={handleRewind}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0, scale: 0.8 }}
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
                      className="text-indigo-600 dark:text-indigo-400"
                    >
                      <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38" />
                    </svg>
                  </motion.button>
                )}

                {/* Fixed Tinder-style card stack */}
                <div
                  className="tinder-cards-wrapper"
                  style={{
                    position: "relative",
                    width: "300px",
                    height: "550px", // Increased height
                    margin: "0 auto",
                    overflow: "visible",
                  }}
                >
                  {/* Stack of cards with proper positioning */}
                  {users
                    .slice(currentIndex, currentIndex + 3)
                    .map((user, index) => {
                      const cardIndex = currentIndex + index;
                      const isTopCard = index === 0;

                      return (
                        <div
                          key={`card-${user.id}-${cardIndex}`}
                          className={`tinder-card ${
                            isTopCard ? "top-card" : "background-card"
                          }`}
                          style={{
                            position: "absolute",
                            width: "300px",
                            height: "500px",
                            borderRadius: "10px",
                            boxShadow: isTopCard
                              ? "0 8px 25px rgba(0, 0, 0, 0.15)"
                              : "0 4px 10px rgba(0, 0, 0, 0.1)",
                            background: "white",
                            zIndex: 10 - index,
                            left: "0",
                            top: "0",
                            transformOrigin: "center center",
                            transform: isTopCard
                              ? "translate(0, 0) scale(1)"
                              : `translate(0, ${index * 2}px) scale(${
                                  1 - index * 0.02
                                })`,
                            transition: isTopCard
                              ? "none"
                              : "transform 0.3s ease",
                            pointerEvents: isTopCard ? "auto" : "none",
                            overflow: "hidden",
                          }}
                        >
                          {isTopCard ? (
                            <motion.div
                              drag="x"
                              dragConstraints={{ left: 0, right: 0 }}
                              dragElastic={1}
                              whileDrag={{
                                scale: 1.05,
                                transition: { duration: 0.1 },
                              }}
                              onDrag={(_, info) => {
                                const card =
                                  document.querySelector(".top-card");
                                if (!card) return;

                                // Calculate rotation based on drag distance
                                const rotate = Math.min(
                                  Math.max(info.offset.x * 0.1, -15),
                                  15
                                );

                                // Apply transform from the original position
                                card.style.transform = `translate(0, 0) translateX(${info.offset.x}px) rotate(${rotate}deg)`;

                                // Apply color overlay based on direction
                                if (info.offset.x > 50) {
                                  const opacity = Math.min(
                                    Math.abs(info.offset.x) / 300,
                                    0.8
                                  );
                                  card.style.boxShadow = `0 0 20px 5px rgba(52, 199, 89, ${opacity})`;
                                  card.style.border = `2px solid rgba(52, 199, 89, ${opacity})`;
                                } else if (info.offset.x < -50) {
                                  const opacity = Math.min(
                                    Math.abs(info.offset.x) / 300,
                                    0.8
                                  );
                                  card.style.boxShadow = `0 0 20px 5px rgba(255, 59, 48, ${opacity})`;
                                  card.style.border = `2px solid rgba(255, 59, 48, ${opacity})`;
                                } else {
                                  card.style.boxShadow =
                                    "0 8px 25px rgba(0, 0, 0, 0.15)";
                                  card.style.border = "none";
                                }
                              }}
                              onDragEnd={(_, info) => {
                                // Get the card element
                                const card =
                                  document.querySelector(".top-card");
                                if (!card) return;

                                // Check if the card was swiped far enough
                                const swipe = info.offset.x;
                                const swipeThreshold = 80;
                                const swipeVelocity = Math.abs(info.velocity.x);

                                // Determine if it's a valid swipe
                                const isSwipeLeft =
                                  swipe < -swipeThreshold ||
                                  (swipe < -40 && swipeVelocity > 0.8);
                                const isSwipeRight =
                                  swipe > swipeThreshold ||
                                  (swipe > 40 && swipeVelocity > 0.8);

                                // Reset background cards to center position to center position
                                const nextCards = document.querySelectorAll(
                                  ".tinder-card:not(.top-card)"
                                );

                                if (isSwipeLeft) {
                                  // Animate the card off-screen to the left
                                  card.style.transition = "transform 0.3s ease";
                                  card.style.transform = `translate(0, 0) translateX(-${window.innerWidth}px) rotate(-30deg)`;

                                  // Keep next card in center position
                                  if (nextCards.length > 0) {
                                    const nextCard = nextCards[0];
                                    nextCard.style.transition =
                                      "transform 0.3s ease";
                                    nextCard.style.transform =
                                      "translate(0, 0)";
                                  }

                                  // Call handleSwipeLeft after animation completes
                                  setTimeout(() => {
                                    handleSwipeLeft();

                                    // Reset all cards to center positions after state update
                                    setTimeout(() => {
                                      // Reset all visible cards to center position
                                      const allCards =
                                        document.querySelectorAll(
                                          ".tinder-card"
                                        );
                                      allCards.forEach((resetCard, i) => {
                                        resetCard.style.transition = "none";
                                        resetCard.style.transform =
                                          i === 0
                                            ? "translate(0, 0)"
                                            : `translate(0, 0) scale(${
                                                1 - i * 0.02
                                              })`;
                                        resetCard.style.boxShadow =
                                          "0 4px 10px rgba(0, 0, 0, 0.1)";
                                        resetCard.style.border = "none";
                                      });
                                    }, 50);
                                  }, 300);
                                } else if (isSwipeRight) {
                                  // Animate the card off-screen to the right
                                  card.style.transition = "transform 0.3s ease";
                                  card.style.transform = `translate(0, 0) translateX(${window.innerWidth}px) rotate(30deg)`;

                                  // Keep next card in center position
                                  if (nextCards.length > 0) {
                                    const nextCard = nextCards[0];
                                    nextCard.style.transition =
                                      "transform 0.3s ease";
                                    nextCard.style.transform =
                                      "translate(0, 0)";
                                  }

                                  // Call handleSwipeRight after animation completes
                                  setTimeout(() => {
                                    handleSwipeRight();

                                    // Reset all cards to center positions after state update
                                    setTimeout(() => {
                                      // Reset all visible cards to center position
                                      const allCards =
                                        document.querySelectorAll(
                                          ".tinder-card"
                                        );
                                      allCards.forEach((resetCard, i) => {
                                        resetCard.style.transition = "none";
                                        resetCard.style.transform =
                                          i === 0
                                            ? "translate(0, 0)"
                                            : `translate(0, 0) scale(${
                                                1 - i * 0.02
                                              })`;
                                        resetCard.style.boxShadow =
                                          "0 4px 10px rgba(0, 0, 0, 0.1)";
                                        resetCard.style.border = "none";
                                      });
                                    }, 50);
                                  }, 300);
                                } else {
                                  // Spring back to center if not swiped far enough
                                  card.style.transition =
                                    "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                                  card.style.transform =
                                    "translate(0, 0) rotate(0deg)";
                                  card.style.boxShadow =
                                    "0 8px 25px rgba(0, 0, 0, 0.15)";
                                  card.style.border = "none";
                                }
                              }}
                              style={{
                                width: "100%",
                                height: "100%",
                                position: "relative",
                                visibility: "visible", 
                              }}
                            >
                              <Card
                                user={user}
                                onSwipeLeft={handleSwipeLeft}
                                onSwipeRight={handleSwipeRight}
                                isCardSwiping={isCardSwiping}
                                swipeDirection={swipeDirection}
                              />
                            </motion.div>
                          ) : (
                            // Background cards - simplified version
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                position: "relative",
                              }}
                            >
                              <Card user={user} isNextCard={true} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="no-more-cards-in-place">
                <div className="no-more-cards-content text-white">
                  <div className="no-more-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 text-white`}>
                    {users.length === 0
                      ? "No Profiles Available"
                      : "No More Profiles"}
                  </h3>
                  <p className={`text-center opacity-80 text-white`}>
                    {users.length === 0
                      ? "There are no profiles to show at the moment."
                      : "You've seen all available profiles."}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats cards */}
          <motion.div
            className="stats-container relative z-20 p-4 rounded-lg bg-black/20 backdrop-blur-sm shadow-xl border-opacity-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="stats-card bg-black/40 shadow-lg relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
            >
              <Link to="/connections">
                <div className="stats-icon connections-icon">
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
                    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"></path>
                    <path d="M23 14h-4a2 2 0 0 0-2 2v4"></path>
                    <path d="M23 10V4a2 2 0 0 0-2-2h-6"></path>
                    <path d="M12 12L6 6"></path>
                    <path d="M6 10V6h4"></path>
                  </svg>
                </div>
                <h3 className="stats-title">Connections</h3>
                <motion.p
                  className="stats-value"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
                >
                  {connections.length}
                </motion.p>
              </Link>
            </motion.div>

            <motion.div
              className="stats-card bg-black/40 shadow-lg relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.6 }}
            >
              <Link to="/requests">
                <div className="stats-icon pending-icon">
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
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="stats-title">Pending</h3>
                <motion.p
                  className="stats-value"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.6 }}
                >
                  {requests.length}
                </motion.p>
              </Link>
            </motion.div>

            <motion.div
              className="stats-card bg-black/40 shadow-lg relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.7 }}
            >
              <div className="stats-icon messages-icon">
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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="stats-title">Messages</h3>
              <motion.p
                className="stats-value"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.7 }}
              >
                 <div className="unseen-summary">
  {unseenChats && unseenChats.length > 0 ? (
    <>
      <p>{unseenChats.length}</p>
      {/* {unseenChats.map((chat) => (
        <div key={chat.chatId}>
          Chat with {chat.userId}
          {chat.unseenCount > 0 && (
            <span className="unseen-badge">{chat.unseenCount}</span>
          )}
        </div>
      ))} */}
    </>
  ) : (
    <p>0</p>
  )}
</div>

              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
