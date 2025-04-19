import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Card from "./ui/Card";
import Nav from "./ui/Nav";

const Home = () => {
  const { darkMode } = useContext(ThemeContext); // Used for theme-specific colors in background elements
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

  // Programming languages with their brand colors
  const programmingLanguages = [
    { name: "JavaScript", color: "#F7DF1E" },
    { name: "Python", color: "#3776AB" },
    { name: "Java", color: "#007396" },
    { name: "C++", color: "#00599C" },
    { name: "TypeScript", color: "#3178C6" },
    { name: "PHP", color: "#777BB4" },
    { name: "Go", color: "#00ADD8" },
    { name: "Rust", color: "#DEA584" },
    { name: "Scala", color: "#DC322F" },
    { name: "Perl", color: "#39457E" },
    { name: "R", color: "#276DC3" },
    { name: "Dart", color: "#0175C2" },
    { name: "Swift", color: "#FA7343" },
    { name: "Kotlin", color: "#7F52FF" },
    { name: "Ruby", color: "#CC342D" },
    { name: "C#", color: "#239120" },
    { name: "HTML", color: "#E34F26" },
    { name: "CSS", color: "#1572B6" },
  ];

  // Frameworks with their brand colors
  const frameworks = [
    { name: "React", color: "#61DAFB" },
    { name: "Angular", color: "#DD0031" },
    { name: "Vue", color: "#4FC08D" },
    { name: "Next.js", color: "#000000" },
    { name: "Express", color: "#000000" },
    { name: "Django", color: "#092E20" },
    { name: "Spring", color: "#6DB33F" },
    { name: "Laravel", color: "#FF2D20" },
    { name: "Flask", color: "#000000" },
    { name: "Svelte", color: "#FF3E00" },
    { name: "Gatsby", color: "#663399" },
    { name: "NestJS", color: "#E0234E" },
    { name: "ASP.NET", color: "#512BD4" },
    { name: "Rails", color: "#CC0000" },
  ];

  // Tools and libraries with their brand colors
  const tools = [
    { name: "Git", color: "#F05032" },
    { name: "Docker", color: "#2496ED" },
    { name: "Redux", color: "#764ABC" },
    { name: "MongoDB", color: "#47A248" },
    { name: "AWS", color: "#FF9900" },
    { name: "Tailwind", color: "#06B6D4" },
    { name: "Kubernetes", color: "#326CE5" },
    { name: "Redis", color: "#DC382D" },
    { name: "PostgreSQL", color: "#336791" },
  ];

  // Code symbols with random vibrant colors
  const codeSymbols = [
    "{",
    "}",
    "[",
    "]",
    "(",
    ")",
    "</>",
    "&&",
    "||",
    "=>",
    "!==",
    "===",
    "//",
    "!!",
    "??",
    "++",
    "--",
    "**",
    "#",
    "$",
    "@",
    "~",
    "^",
    "&",
    "...",
    ":::",
    "::=",
    "=>>",
    "<<=",
    "<>",
  ];

  // Vibrant colors for code symbols
  const symbolColors = [
    "#FF5252",
    "#FF4081",
    "#E040FB",
    "#7C4DFF",
    "#536DFE",
    "#448AFF",
    "#40C4FF",
    "#18FFFF",
    "#64FFDA",
    "#69F0AE",
    "#B2FF59",
    "#EEFF41",
    "#FFFF00",
    "#FFD740",
    "#FFAB40",
    "#FF6E40",
    "#FF5252",
    "#FF4081",
    "#E040FB",
    "#7C4DFF",
  ];

  return (
    <div className="min-h-screen transition-all duration-300 text-white relative overflow-hidden">
      {/* Background with coding icons - based on reference image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Dark background like in reference image */}
        <div className="absolute inset-0 bg-[#0A0F18]"></div>

        {/* Programming languages - Scattered across the entire screen like in reference image */}
        {programmingLanguages.map((lang, i) => {
          // Generate random positions that are truly scattered across the entire screen
          const randomTop = Math.floor(Math.random() * 120) - 10; // Allow some to be slightly off-screen
          const randomLeft = Math.floor(Math.random() * 120) - 10; // Allow some to be slightly off-screen
          const randomSize = Math.floor(Math.random() * 10) + 16; // Larger size range
          const randomDelay = Math.floor(Math.random() * 15);
          const randomDuration = Math.floor(Math.random() * 15) + 25; // Slower animation
          const randomRotation = Math.floor(Math.random() * 20) - 10; // More rotation

          return (
            <motion.div
              key={`lang-${i}`}
              className="absolute font-mono font-bold"
              style={{
                top: `${randomTop}%`,
                left: `${randomLeft}%`,
                fontSize: `${randomSize}px`,
                opacity: 0.9,
                color: lang.color,
                filter: `drop-shadow(0 0 10px ${lang.color})`,
                zIndex: -1,
                textShadow: `0 0 15px ${lang.color}`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.6, 0.9, 0.6],
                rotate: [0, randomRotation, 0],
                scale: [1, 1.08, 1],
                filter: [
                  `drop-shadow(0 0 5px ${lang.color})`,
                  `drop-shadow(0 0 15px ${lang.color})`,
                  `drop-shadow(0 0 5px ${lang.color})`,
                ],
              }}
              transition={{
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: "easeInOut",
              }}
            >
              {lang.name}
            </motion.div>
          );
        })}

        {/* Frameworks - Scattered across the entire screen like in reference image */}
        {frameworks.map((framework, i) => {
          // Generate random positions that are truly scattered across the entire screen
          const randomTop = Math.floor(Math.random() * 120) - 10; // Allow some to be slightly off-screen
          const randomLeft = Math.floor(Math.random() * 120) - 10; // Allow some to be slightly off-screen
          const randomSize = Math.floor(Math.random() * 10) + 16; // Larger size range
          const randomDelay = Math.floor(Math.random() * 15);
          const randomDuration = Math.floor(Math.random() * 15) + 25; // Slower animation
          const randomRotation = Math.floor(Math.random() * 20) - 10; // More rotation

          return (
            <motion.div
              key={`framework-${i}`}
              className="absolute font-mono font-bold"
              style={{
                top: `${randomTop}%`,
                left: `${randomLeft}%`,
                fontSize: `${randomSize}px`,
                opacity: 0.9,
                color: framework.color,
                filter: `drop-shadow(0 0 10px ${framework.color})`,
                zIndex: -1,
                textShadow: `0 0 15px ${framework.color}`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.6, 0.9, 0.6],
                rotate: [0, randomRotation, 0],
                scale: [1, 1.08, 1],
                filter: [
                  `drop-shadow(0 0 5px ${framework.color})`,
                  `drop-shadow(0 0 15px ${framework.color})`,
                  `drop-shadow(0 0 5px ${framework.color})`,
                ],
              }}
              transition={{
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: "easeInOut",
              }}
            >
              {framework.name}
            </motion.div>
          );
        })}

        {/* Tools and libraries - Scattered across the entire screen like in reference image */}
        {tools.map((tool, i) => {
          // Generate random positions that are truly scattered across the entire screen
          const randomTop = Math.floor(Math.random() * 120) - 10; // Allow some to be slightly off-screen
          const randomLeft = Math.floor(Math.random() * 120) - 10; // Allow some to be slightly off-screen
          const randomSize = Math.floor(Math.random() * 10) + 16; // Larger size range
          const randomDelay = Math.floor(Math.random() * 15);
          const randomDuration = Math.floor(Math.random() * 15) + 25; // Slower animation
          const randomRotation = Math.floor(Math.random() * 20) - 10; // More rotation

          return (
            <motion.div
              key={`tool-${i}`}
              className="absolute font-mono font-bold"
              style={{
                top: `${randomTop}%`,
                left: `${randomLeft}%`,
                fontSize: `${randomSize}px`,
                opacity: 0.9,
                color: tool.color,
                filter: `drop-shadow(0 0 10px ${tool.color})`,
                zIndex: -1,
                textShadow: `0 0 15px ${tool.color}`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.6, 0.9, 0.6],
                rotate: [0, randomRotation, 0],
                scale: [1, 1.08, 1],
                filter: [
                  `drop-shadow(0 0 5px ${tool.color})`,
                  `drop-shadow(0 0 15px ${tool.color})`,
                  `drop-shadow(0 0 5px ${tool.color})`,
                ],
              }}
              transition={{
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: "easeInOut",
              }}
            >
              {tool.name}
            </motion.div>
          );
        })}

        {/* Code symbols - Scattered across the entire screen like in reference image */}
        {[...Array(80)].map((_, i) => {
          // Increased number of symbols even more for better coverage
          // Generate random positions that are truly scattered across the entire screen
          const randomTop = Math.floor(Math.random() * 130) - 15; // Allow some to be slightly off-screen
          const randomLeft = Math.floor(Math.random() * 130) - 15; // Allow some to be slightly off-screen
          const randomSize = Math.floor(Math.random() * 14) + 16; // Larger size range
          const randomDelay = Math.floor(Math.random() * 20);
          const randomDuration = Math.floor(Math.random() * 20) + 25; // Slower animation
          const randomRotation = Math.floor(Math.random() * 40) - 20; // More rotation

          // Random colors for symbols
          const randomColor =
            symbolColors[Math.floor(Math.random() * symbolColors.length)];
          const randomSymbol =
            codeSymbols[Math.floor(Math.random() * codeSymbols.length)];

          return (
            <motion.div
              key={`symbol-${i}`}
              className="absolute font-mono font-bold"
              style={{
                top: `${randomTop}%`,
                left: `${randomLeft}%`,
                fontSize: `${randomSize}px`,
                opacity: 0.9,
                color: randomColor,
                filter: `drop-shadow(0 0 12px ${randomColor})`,
                zIndex: -1,
                textShadow: `0 0 18px ${randomColor}`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.6, 0.9, 0.6],
                rotate: [0, randomRotation, 0],
                scale: [1, 1.08, 1],
                filter: [
                  `drop-shadow(0 0 5px ${randomColor})`,
                  `drop-shadow(0 0 15px ${randomColor})`,
                  `drop-shadow(0 0 5px ${randomColor})`,
                ],
              }}
              transition={{
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: "easeInOut",
              }}
            >
              {randomSymbol}
            </motion.div>
          );
        })}
      </div>

      {/* All content positioned on top of background icons */}
      <div className="content-wrapper absolute top-[13vh] left-0 right-0 z-10 bg-transparent">
        {/* Navigation */}
        <div className="nav-container">
          <Nav />
        </div>

        {/* Main content */}
        <div className="home-container pt-6 pb-12 mx-auto max-w-4xl bg-transparent">
          {/* Heading and subheading */}
          <motion.div
            className="Headingandsubheading text-center mb-28 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={
              loadingSequence.headingLoaded
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: -20 }
            }
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-3 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Connect with Developers
            </motion.h1>
            <motion.p
              className="text-lg opacity-80 text-white"
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
                  <h3 className="text-xl font-semibold mb-2">
                    No More Profiles
                  </h3>
                  <p className="text-center opacity-80">
                    You've seen all available profiles.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
