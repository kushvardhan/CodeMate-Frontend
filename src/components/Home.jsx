import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Card from "./ui/Card";
import Nav from "./ui/Nav";

const Home = () => {
  const { darkMode } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousCards, setPreviousCards] = useState([]); // Store swiped cards for rewind function

  useEffect(() => {
    // Fetch users or use mock data
    const mockUsers = [
      {
        id: 1,
        name: "Jane Smith",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=100",
        location: "San Francisco, CA",
        bio: "Full-stack developer with 5 years of experience in React and Node.js",
        skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
        age: 28,
        gender: "Female",
      },
      {
        id: 2,
        name: "John Doe",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=100",
        location: "New York, NY",
        bio: "Frontend developer specializing in React and modern JavaScript",
        skills: ["React", "JavaScript", "CSS", "HTML", "Redux"],
        age: 32,
        gender: "Male",
      },
      {
        id: 3,
        name: "Emily Johnson",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=100",
        location: "Austin, TX",
        bio: "Backend developer with expertise in Python and Django",
        skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
        age: 26,
        gender: "Female",
      },
      {
        id: 4,
        name: "Michael Brown",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=100",
        location: "Seattle, WA",
        bio: "Mobile developer focused on React Native and Flutter",
        skills: ["React Native", "Flutter", "JavaScript", "Dart", "Firebase"],
        age: 30,
        gender: "Male",
      },
      {
        id: 5,
        name: "Sarah Wilson",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=100",
        location: "Chicago, IL",
        bio: "DevOps engineer with strong CI/CD pipeline experience",
        skills: ["Docker", "Kubernetes", "Jenkins", "AWS", "Terraform"],
        age: 29,
        gender: "Female",
      },
      {
        id: 6,
        name: "David Chen",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=100",
        location: "Boston, MA",
        bio: "Data scientist specializing in machine learning and AI applications",
        skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "SQL"],
        age: 34,
        gender: "Male",
      },
      {
        id: 7,
        name: "Olivia Martinez",
        image:
          "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=100",
        location: "Miami, FL",
        bio: "UX/UI designer with a passion for creating intuitive user experiences",
        skills: ["Figma", "Adobe XD", "Sketch", "HTML/CSS", "Prototyping"],
        age: 27,
        gender: "Female",
      },
      {
        id: 8,
        name: "James Wilson",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=100",
        location: "Denver, CO",
        bio: "Blockchain developer working on decentralized applications",
        skills: [
          "Solidity",
          "Ethereum",
          "Web3.js",
          "Smart Contracts",
          "JavaScript",
        ],
        age: 31,
        gender: "Male",
      },
      {
        id: 9,
        name: "Sophia Lee",
        image:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=100",
        location: "Portland, OR",
        bio: "Game developer with experience in Unity and Unreal Engine",
        skills: ["Unity", "C#", "3D Modeling", "Game Design", "Unreal Engine"],
        age: 29,
        gender: "Female",
      },
      {
        id: 10,
        name: "Robert Taylor",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=100",
        location: "Austin, TX",
        bio: "Cybersecurity specialist focused on network security and penetration testing",
        skills: [
          "Network Security",
          "Penetration Testing",
          "Ethical Hacking",
          "Python",
          "Linux",
        ],
        age: 35,
        gender: "Male",
      },
      {
        id: 11,
        name: "Emma Davis",
        image:
          "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=100",
        location: "San Diego, CA",
        bio: "Cloud architect specializing in AWS and serverless architecture",
        skills: ["AWS", "Serverless", "Terraform", "CloudFormation", "Node.js"],
        age: 33,
        gender: "Female",
      },
      {
        id: 12,
        name: "Daniel Kim",
        image:
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=100",
        location: "Chicago, IL",
        bio: "iOS developer with expertise in Swift and SwiftUI",
        skills: ["Swift", "SwiftUI", "Xcode", "Core Data", "Firebase"],
        age: 28,
        gender: "Male",
      },
    ];

    setUsers(mockUsers);
  }, []);

  // State to track if all cards have been swiped
  const [allCardsFinished, setAllCardsFinished] = useState(false);
  // State to track if a card is being swiped
  const [isCardSwiping, setIsCardSwiping] = useState(false);
  // State to track the previous index for animation
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

  // Pre-calculate next index to avoid state updates during animation
  const nextCardIndex =
    currentIndex < users.length - 1 ? currentIndex + 1 : null;

  const handleSwipeLeft = () => {
    console.log("Swiped left (pass)");
    // Prevent multiple swipes
    if (isCardSwiping) return;

    // Set swiping state and direction for animation
    setIsCardSwiping(true);
    setSwipeDirection("left");
    setPrevIndex(currentIndex);

    // Store the current card for rewind function
    const currentCard = users[currentIndex];
    setPreviousCards((prev) => [
      ...prev,
      { card: currentCard, direction: "left" },
    ]);

    // Use a longer timeout to ensure the exit animation completes before changing cards
    // This prevents the glitching/shifting effect
    setTimeout(() => {
      if (nextCardIndex !== null) {
        // Move to the next card
        setCurrentIndex(nextCardIndex);
      } else {
        // No more cards left
        setAllCardsFinished(true);
      }

      // Reset swiping state after a longer delay to ensure smooth transition
      setTimeout(() => {
        setIsCardSwiping(false);
        setSwipeDirection(null);
      }, 500); // Longer delay for smoother transition
    }, 600); // Wait for exit animation to complete
  };

  const handleSwipeRight = () => {
    console.log("Swiped right (like)");
    // Prevent multiple swipes
    if (isCardSwiping) return;

    // Set swiping state and direction for animation
    setIsCardSwiping(true);
    setSwipeDirection("right");
    setPrevIndex(currentIndex);

    // Store the current card for rewind function
    const currentCard = users[currentIndex];
    setPreviousCards((prev) => [
      ...prev,
      { card: currentCard, direction: "right" },
    ]);

    // Use a longer timeout to ensure the exit animation completes before changing cards
    // This prevents the glitching/shifting effect
    setTimeout(() => {
      if (nextCardIndex !== null) {
        // Move to the next card
        setCurrentIndex(nextCardIndex);
      } else {
        // No more cards left
        setAllCardsFinished(true);
      }

      // Reset swiping state after a longer delay to ensure smooth transition
      setTimeout(() => {
        setIsCardSwiping(false);
        setSwipeDirection(null);
      }, 500); // Longer delay for smoother transition
    }, 600); // Wait for exit animation to complete
  };

  // Rewind function to bring back the last card
  const handleRewind = () => {
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

    // Remove the last card from previousCards
    setPreviousCards((prev) => prev.slice(0, -1));

    // Set swiping state for animation
    setIsCardSwiping(true);
    setSwipeDirection("rewind");

    // Decrement the index to show the previous card
    setCurrentIndex((prev) => Math.max(prev - 1, 0));

    // Reset swiping state after animation
    setTimeout(() => {
      setIsCardSwiping(false);
      setSwipeDirection(null);
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

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900/90 via-slate-900/90 to-gray-800/90 text-white"
          : "bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 text-gray-900 light"
      }`}
    >
      {/* Navigation */}
      <Nav />

      {/* Main content */}
      <div className="home-container relative z-10 pt-24 pb-12">
        {/* Heading and subheading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={
            loadingSequence.headingLoaded
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: -20 }
          }
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Connect with Developers
          </motion.h1>
          <motion.p
            className="text-lg opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Swipe, match, collaborate
          </motion.p>
        </motion.div>

        {/* Card component */}
        <motion.div
          className="card-wrapper relative z-20 flex justify-center items-center w-full max-w-full mx-auto my-14"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            loadingSequence.cardLoaded
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {users.length > 0 &&
          currentIndex < users.length &&
          !allCardsFinished ? (
            <div className="tinder-card-stack relative w-full max-w-[340px] mx-auto">
              {/* Rewind button */}
              {previousCards.length > 0 && (
                <motion.button
                  className="rewind-button absolute top-4 left-4 z-30 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
                  onClick={handleRewind}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
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

              {/* Static background cards - always centered */}
              <div className="static-card-stack">
                {/* Next card (visible behind current card) - always centered */}
                {currentIndex + 1 < users.length && (
                  <div className="static-card-position preview-stack-card">
                    <Card user={users[currentIndex + 1]} isNextCard={true} />
                  </div>
                )}
              </div>

              {/* Current card */}
              <div className="tinder-current-card">
                <Card
                  user={users[currentIndex]}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  isCardSwiping={isCardSwiping}
                  swipeDirection={swipeDirection}
                />
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
                <h3 className="text-xl font-semibold mb-2">No More Profiles</h3>
                <p className="text-center opacity-80">
                  You've seen all available profiles.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats cards */}
        <motion.div
          className="stats-container"
          initial={{ opacity: 0, y: 20 }}
          animate={
            loadingSequence.statsLoaded
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="stats-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
          >
            <div className="stats-icon connections">
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
              24
            </motion.p>
          </motion.div>

          <motion.div
            className="stats-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.6 }}
          >
            <div className="stats-icon pending">
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
              12
            </motion.p>
          </motion.div>

          <motion.div
            className="stats-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.7 }}
          >
            <div className="stats-icon messages">
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

        <motion.div
          className="mt-24 w-full relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-12 left-0 right-0 h-24 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-24 h-24 rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-xl"></div>
            <div className="absolute top-6 right-1/3 w-32 h-32 rounded-full bg-purple-500/10 dark:bg-purple-600/10 blur-xl"></div>
            <div className="absolute top-4 right-1/4 w-20 h-20 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-xl"></div>

            {/* Separator line with enhanced styling */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 dark:via-indigo-400/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] w-full shadow-[0_-1px_2px_rgba(79,70,229,0.1)] dark:shadow-[0_-1px_2px_rgba(99,102,241,0.2)]"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
