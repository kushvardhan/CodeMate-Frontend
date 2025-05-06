import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { addConnection } from "../slice/ConnectionSlice";
import { addRequest } from "../slice/RequestSlice";
import Card from "./ui/Card";
import Nav from "./ui/Nav";

const Home = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request) || [];
  const connections = useSelector((state) => state.connection) || [];

  // Fetch requests and connections data immediately when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsResponse, connectionsResponse] = await Promise.all([
          axios.get("/user/request/received", { withCredentials: true }),
          axios.get("/user/request/connections", { withCredentials: true }),
        ]);

        console.log("Requests data:", requestsResponse.data);
        console.log("Connections data:", connectionsResponse.data);

        if (requestsResponse.data && requestsResponse.data.data) {
          dispatch(addRequest(requestsResponse.data.data));
        } else if (requestsResponse.data) {
          dispatch(addRequest(requestsResponse.data));
        }

        if (connectionsResponse.data && connectionsResponse.data.data) {
          dispatch(addConnection(connectionsResponse.data.data));
        } else if (connectionsResponse.data) {
          dispatch(addConnection(connectionsResponse.data));
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
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

        console.log("Feed data fetched:", response.data);

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
        console.log("All images preloaded successfully");
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
    console.log("Swiped left (pass)");
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
      console.log(`Ignored user with ID: ${userId}`);

      // Make API call to update status
      await axios.post(
        `/request/send/ignored/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error sending ignored status:", error);
    }

    // Immediately update the index to show the next card
    if (nextCardIndex !== null) {
      // Update the index first
      setCurrentIndex(nextCardIndex);

      // Then immediately reset all card positions to ensure proper centering
      // This ensures the next card appears instantly in the center
      requestAnimationFrame(() => {
        // Reset the current card (which is now the next card)
        const currentCard = document.querySelector(".tinder-current-card");
        if (currentCard) {
          currentCard.style.cssText = `
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) scale(1) !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            z-index: 10 !important;
            transform-style: preserve-3d !important;
            transform-origin: center center !important;
            transition: none !important;
            width: 100% !important;
            height: 100% !important;
          `;
        }

        // Reset the background cards
        const backgroundCards = document.querySelectorAll(
          ".preview-stack-card, .deep-stack-card"
        );
        backgroundCards.forEach((card) => {
          card.style.transition = "none";
        });
      });

      // Reset swiping state after a short delay
      setTimeout(() => {
        setIsCardSwiping(false);
        setSwipeDirection(null);
      }, 100); // Very short timeout for quick reset
    } else {
      setAllCardsFinished(true);
      setIsCardSwiping(false);
      setSwipeDirection(null);
    }
  };

  const handleSwipeRight = async () => {
    console.log("Swiped right (like)");
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
      console.log(`Interested in user with ID: ${userId}`);

      // Make API call to update status
      await axios.post(
        `/request/send/interested/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error sending interested status:", error);
    }

    // Immediately update the index to show the next card
    if (nextCardIndex !== null) {
      // Update the index first
      setCurrentIndex(nextCardIndex);

      // Then immediately reset all card positions to ensure proper centering
      // This ensures the next card appears instantly in the center
      requestAnimationFrame(() => {
        // Reset the current card (which is now the next card)
        const currentCard = document.querySelector(".tinder-current-card");
        if (currentCard) {
          currentCard.style.cssText = `
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) scale(1) !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            z-index: 10 !important;
            transform-style: preserve-3d !important;
            transform-origin: center center !important;
            transition: none !important;
            width: 100% !important;
            height: 100% !important;
          `;
        }

        // Reset the background cards
        const backgroundCards = document.querySelectorAll(
          ".preview-stack-card, .deep-stack-card"
        );
        backgroundCards.forEach((card) => {
          card.style.transition = "none";
        });
      });

      // Reset swiping state after a short delay
      setTimeout(() => {
        setIsCardSwiping(false);
        setSwipeDirection(null);
      }, 100); // Very short timeout for quick reset
    } else {
      setAllCardsFinished(true);
      setIsCardSwiping(false);
      setSwipeDirection(null);
    }
  };

  // Rewind function to bring back the last card
  const handleRewind = async () => {
    // Check if there are any previous cards
    if (previousCards.length === 0) {
      console.log("No cards to rewind");
      return;
    }

    // Prevent rewind during swiping
    if (isCardSwiping) return;

    // Get the last card
    const lastCard = previousCards[previousCards.length - 1];
    console.log(
      "Rewinding to card:",
      lastCard.card.name,
      "Direction was:",
      lastCard.direction
    );

    // If we're rewinding a card, we should cancel the previous action
    try {
      const userId = lastCard.card.id;
      console.log(`Canceling previous action for user with ID: ${userId}`);

      // Make API call to cancel the previous action
      await axios.post(
        `/request/cancel/${userId}`,
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

    // Ensure the next card is properly positioned in the center
    const nextCards = document.querySelectorAll(
      ".preview-stack-card, .deep-stack-card"
    );
    nextCards.forEach((card) => {
      card.style.cssText = `
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        top: 0 !important;
        bottom: 0 !important;
        margin: auto !important;
        transform-origin: center center !important;
        will-change: transform, opacity !important;
        transition: transform 0.3s ease, opacity 0.3s ease !important;
        transform-style: preserve-3d !important;
      `;
    });

    // Reset the tinder-card-stack container to ensure proper positioning
    const cardStack = document.querySelector(".tinder-card-stack");
    if (cardStack) {
      cardStack.style.cssText = `
        position: relative !important;
        width: 100% !important;
        max-width: 340px !important;
        height: 550px !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        perspective: 1000px !important;
        transform-style: preserve-3d !important;
        margin: 0 auto !important;
        left: 0 !important;
        right: 0 !important;
        transform: translateX(0) !important;
        inset: 0 !important;
      `;
    }

    // Decrement the index to show the previous card
    setCurrentIndex((prev) => Math.max(prev - 1, 0));

    // Reset swiping state after animation
    setTimeout(() => {
      setIsCardSwiping(false);
      setSwipeDirection(null);

      // Ensure the next card is properly positioned in the center
      const nextCards = document.querySelectorAll(
        ".preview-stack-card, .deep-stack-card"
      );
      nextCards.forEach((card) => {
        card.style.cssText = `
          position: absolute !important;
          left: 0 !important;
          right: 0 !important;
          top: 0 !important;
          bottom: 0 !important;
          margin: auto !important;
          transform-origin: center center !important;
          will-change: transform, opacity !important;
          transition: transform 0.3s ease, opacity 0.3s ease !important;
          transform-style: preserve-3d !important;
        `;
      });

      // Reset the tinder-card-stack container again to ensure proper positioning
      const cardStack = document.querySelector(".tinder-card-stack");
      if (cardStack) {
        cardStack.style.cssText = `
          position: relative !important;
          width: 100% !important;
          max-width: 340px !important;
          height: 550px !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          perspective: 1000px !important;
          transform-style: preserve-3d !important;
          margin: 0 auto !important;
          left: 0 !important;
          right: 0 !important;
          transform: translateX(0) !important;
          inset: 0 !important;
        `;
      }
    }, 600); // Match the longer timeout for consistency
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

  // Effect to ensure the next card is properly positioned when the component mounts
  useEffect(() => {
    // Reset the card stack position
    const cardStack = document.querySelector(".tinder-card-stack");
    if (cardStack) {
      cardStack.style.cssText = `
        position: relative !important;
        width: 100% !important;
        max-width: 340px !important;
        height: 550px !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        perspective: 1000px !important;
        transform-style: preserve-3d !important;
        margin: 0 auto !important;
        left: 0 !important;
        right: 0 !important;
        transform: translateX(0) !important;
        inset: 0 !important;
      `;
    }

    // Reset all next cards to ensure they appear in the center
    const nextCards = document.querySelectorAll(
      ".preview-stack-card, .deep-stack-card"
    );
    nextCards.forEach((card) => {
      card.style.cssText = `
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        top: 0 !important;
        bottom: 0 !important;
        margin: auto !important;
        transform-origin: center center !important;
        will-change: transform, opacity !important;
        transition: transform 0.3s ease, opacity 0.3s ease !important;
        transform-style: preserve-3d !important;
        z-index: 5 !important;
        opacity: 0.85 !important;
        transform: translateX(0) translateY(10px) scale(0.95) !important;
      `;
    });

    // Reset the current card to ensure it appears in the center
    const currentCard = document.querySelector(".tinder-current-card");
    if (currentCard) {
      currentCard.style.cssText = `
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        top: 0 !important;
        bottom: 0 !important;
        margin: auto !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        z-index: 10 !important;
        transform-style: preserve-3d !important;
        transform-origin: center center !important;
        will-change: transform !important;
        transform: translateX(0) translateY(0) translateZ(0) !important;
      `;
    }
  }, []);

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
            className="Headingandsubheading text-center mb-28 relative z-10 p-4 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={
              loadingSequence.headingLoaded
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: -20 }
            }
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-3 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/50 inline-block px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Connect with Developers
            </motion.h1>
            <motion.p
              className="text-lg text-white font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/50 inline-block px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Swipe, match, collaborate
            </motion.p>
          </motion.div>

          {/* Card component */}
          <motion.div
            className="card-wrapper relative z-10 flex justify-center items-center w-full max-w-full mx-auto my-14"
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
                <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                  Loading profiles...
                </p>
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
                  overflow: "hidden", // Prevent overflow
                  maxWidth: "100%", // Ensure it doesn't exceed the screen width
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

                {/* Static background cards - perfectly centered and stacked */}
                <div
                  className="static-card-stack"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden", // Prevent cards from appearing outside the stack
                  }}
                >
                  {/* Next card - always centered */}
                  {currentIndex + 1 < users.length && (
                    <div
                      className="static-card-position preview-stack-card"
                      style={{
                        position: "absolute",
                        left: "50%", // Center horizontally
                        top: "50%", // Center vertically
                        transform: "translate(-50%, -50%) scale(0.95)", // Center with slight scale down
                        zIndex: "5",
                        opacity: "0.9", // Slightly less visible
                        transformStyle: "preserve-3d",
                        transformOrigin: "center center",
                        willChange: "transform, opacity",
                        transition: "none", // No transition to ensure instant positioning
                        pointerEvents: "none", // Prevent interaction with this card
                      }}
                    >
                      <Card user={users[currentIndex + 1]} isNextCard={true} />
                    </div>
                  )}

                  {/* Add a third card for deeper stack effect - always centered */}
                  {currentIndex + 2 < users.length && (
                    <div
                      className="static-card-position deep-stack-card"
                      style={{
                        position: "absolute",
                        left: "50%", // Center horizontally
                        top: "50%", // Center vertically
                        transform: "translate(-50%, -50%) scale(0.9)", // Center with more scale down
                        zIndex: "4",
                        opacity: "0.7", // Even less visible
                        transformStyle: "preserve-3d",
                        transformOrigin: "center center",
                        willChange: "transform, opacity",
                        transition: "none", // No transition to ensure instant positioning
                        pointerEvents: "none", // Prevent interaction with this card
                      }}
                    >
                      <Card user={users[currentIndex + 2]} isNextCard={true} />
                    </div>
                  )}
                </div>

                {/* Current card - always centered by default */}
                <div
                  className="tinder-current-card"
                  style={{
                    position: "absolute",
                    left: "50%", // Center horizontally
                    top: "50%", // Center vertically
                    transform: "translate(-50%, -50%) scale(1)", // Perfect center positioning
                    margin: "0",
                    padding: "0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: "10",
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                    willChange: "transform",
                    transition: "none", // No transition to ensure instant positioning
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <motion.div
                    drag="x"
                    dragConstraints={{
                      left: -window.innerWidth / 2,
                      right: window.innerWidth / 2,
                    }}
                    dragElastic={0.7} // Slightly elastic drag for better feel
                    dragTransition={{
                      power: 0.2,
                      timeConstant: 400,
                    }}
                    onDragStart={() => {
                      // No need to modify anything on drag start
                      // The card should move freely during drag
                    }}
                    onDragEnd={(_, info) => {
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

                      if (isSwipeLeft) {
                        handleSwipeLeft();
                      } else if (isSwipeRight) {
                        handleSwipeRight();
                      } else {
                        // If not swiped far enough, reset to center
                        const currentCard = document.querySelector(
                          ".tinder-current-card"
                        );
                        if (currentCard) {
                          currentCard.style.cssText = `
                            position: absolute !important;
                            left: 50% !important;
                            top: 50% !important;
                            transform: translate(-50%, -50%) scale(1) !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            display: flex !important;
                            justify-content: center !important;
                            align-items: center !important;
                            z-index: 10 !important;
                            transform-style: preserve-3d !important;
                            transform-origin: center center !important;
                            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                            width: 100% !important;
                            height: 100% !important;
                          `;
                        }
                      }
                    }}
                    className="card-container"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Card
                      user={users[currentIndex]}
                      onSwipeLeft={handleSwipeLeft}
                      onSwipeRight={handleSwipeRight}
                      isCardSwiping={isCardSwiping}
                      swipeDirection={swipeDirection}
                    />
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="no-more-cards-in-place">
                <div className="no-more-cards-content">
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
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {users.length === 0
                      ? "No Profiles Available"
                      : "No More Profiles"}
                  </h3>
                  <p className="text-center opacity-80 text-white">
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
                8
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
