import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Card from "./ui/Card";
import Nav from "./ui/Nav";

const Home = () => {
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

  // Programming language icons with coding-related symbols
  const programmingLanguages = [
    { name: "JavaScript", color: "#F7DF1E", symbol: "JS" },
    { name: "React", color: "#61DAFB", symbol: "⚛" },
    { name: "Node.js", color: "#339933", symbol: "ⓝ" },
    { name: "Python", color: "#3776AB", symbol: "🐍" },
    { name: "Java", color: "#007396", symbol: "☕" },
    { name: "C++", color: "#00599C", symbol: "C++" },
    { name: "TypeScript", color: "#3178C6", symbol: "TS" },
    { name: "PHP", color: "#777BB4", symbol: "PHP" },
  ];

  // Framework icons with SVG symbols
  const frameworks = [
    {
      name: "Angular",
      color: "#DD0031",
      symbol:
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path fill='currentColor' d='M9.931 12.645h4.138l-2.07-4.908m0-7.737L.68 3.982l1.726 14.771L12 24l9.596-5.242L23.32 3.984 11.999.001zm7.064 18.31h-2.638l-1.422-3.503H8.996l-1.422 3.504h-2.64L12 2.65z'/></svg>",
    },
    {
      name: "Vue",
      color: "#4FC08D",
      symbol:
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path fill='currentColor' d='M24 1.61h-9.94L12 5.16 9.94 1.61H0l12 20.78zm-18.77 2h3.22L12 11.76 15.55 3.61h3.22L12 18.39z'/></svg>",
    },
    {
      name: "Next.js",
      color: "#000000",
      symbol:
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path fill='currentColor' d='M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z'/></svg>",
    },
    {
      name: "Svelte",
      color: "#FF3E00",
      symbol:
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path fill='currentColor' d='M10.354 21.125a4.44 4.44 0 0 1-4.765-1.767 4.109 4.109 0 0 1-.703-3.107 3.898 3.898 0 0 1 .134-.522l.105-.321.287.21a7.21 7.21 0 0 0 2.186 1.092l.208.063-.02.208a1.253 1.253 0 0 0 .226.83 1.337 1.337 0 0 0 1.435.533 1.231 1.231 0 0 0 .343-.15l5.59-3.562a1.164 1.164 0 0 0 .524-.778 1.242 1.242 0 0 0-.211-.937 1.338 1.338 0 0 0-1.435-.533 1.23 1.23 0 0 0-.343.15l-2.133 1.36a4.078 4.078 0 0 1-1.135.499 4.44 4.44 0 0 1-4.765-1.766 4.108 4.108 0 0 1-.702-3.108 3.855 3.855 0 0 1 1.742-2.582l5.589-3.563a4.072 4.072 0 0 1 1.135-.499 4.44 4.44 0 0 1 4.765 1.767 4.109 4.109 0 0 1 .703 3.107 3.943 3.943 0 0 1-.134.522l-.105.321-.287-.21a7.204 7.204 0 0 0-2.186-1.092l-.208-.063.02-.208a1.253 1.253 0 0 0-.226-.83 1.337 1.337 0 0 0-1.435-.533 1.23 1.23 0 0 0-.343.15L9.15 8.407a1.163 1.163 0 0 0-.524.778 1.242 1.242 0 0 0 .211.937 1.338 1.338 0 0 0 1.435.533 1.23 1.23 0 0 0 .343-.15l2.133-1.36a4.078 4.078 0 0 1 1.135-.499 4.44 4.44 0 0 1 4.765 1.767 4.108 4.108 0 0 1 .702 3.108 3.855 3.855 0 0 1-1.742 2.582l-5.589 3.563a4.072 4.072 0 0 1-1.135.499c-.22.063-.443.095-.666.097a3.41 3.41 0 0 1-.531-.037z'/></svg>",
    },
  ];

  // Tool and library icons with coding-related symbols
  const tools = [
    { name: "Git", color: "#F05032", symbol: "ʩ" },
    { name: "Docker", color: "#2496ED", symbol: "૱" },
    { name: "Kubernetes", color: "#326CE5", symbol: "₰" },
    // ...add more tools...
  ];

  // Code symbols with random vibrant colors
  const codeSymbols = [
    "{",
    "⟹",
    "[",
    "⩽",
    "cout<<",
    ")",
    "⧺",
    ">>=",
    "⨉",
    "≔",
    "≅",
    "conso..",
    "‽",
    "*",
    "⋈",
    "%",
    "&",
    "|",
    "^",
    "print(.",
    "!",
    "?",
    "≠",
    "!==",
    "#",
    "$",
    "@",
    // Additional code snippets
    "func()",
    "return;",
    "for(i=0;",
    "catch{",
    "class ",
    "const ",
    "let x=",
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
  ];

  // Function to generate fixed positions based on the reference image layout
  const generateFixedPositions = () => {
    // Create predefined positions that match the reference image layout
    const positions = [
      // Top left area
      { top: "18%", left: "5%" },
      { top: "25%", left: "12%" },
      { top: "15%", left: "22%" },
      { top: "30%", left: "28%" },

      // Top right area
      { top: "20%", left: "75%" },
      { top: "15%", left: "85%" },
      { top: "28%", left: "92%" },
      { top: "35%", left: "80%" },

      // Middle left area
      { top: "45%", left: "8%" },
      { top: "55%", left: "15%" },
      { top: "65%", left: "5%" },
      { top: "50%", left: "25%" },

      // Middle right area
      { top: "45%", left: "75%" },
      { top: "55%", left: "88%" },
      { top: "65%", left: "82%" },
      { top: "50%", left: "95%" },

      // Bottom area
      { top: "80%", left: "15%" },
      { top: "85%", left: "30%" },
      { top: "82%", left: "50%" },
      { top: "88%", left: "65%" },
      { top: "85%", left: "80%" },

      // Additional positions throughout the page
      { top: "40%", left: "40%" },
      { top: "60%", left: "60%" },
      { top: "75%", left: "40%" },
      { top: "35%", left: "55%" },
      { top: "70%", left: "25%" },
      { top: "25%", left: "45%" },
      { top: "60%", left: "35%" },
      { top: "40%", left: "70%" },

      // More positions to ensure we have enough
      { top: "75%", left: "75%" },
      { top: "20%", left: "60%" },
      { top: "30%", left: "70%" },
      { top: "50%", left: "50%" },
      { top: "65%", left: "65%" },
      { top: "35%", left: "35%" },
      { top: "90%", left: "40%" },
      { top: "15%", left: "40%" },
      { top: "40%", left: "15%" },
      { top: "60%", left: "80%" },
      { top: "70%", left: "45%" },
    ];

    return positions;
  };

  // Get all fixed positions
  const allPositions = generateFixedPositions();

  // Ensure we have enough positions
  const totalElements =
    programmingLanguages.length +
    frameworks.length +
    tools.length +
    codeSymbols.length;
  if (allPositions.length < totalElements) {
    console.warn(
      `Not enough predefined positions (${allPositions.length}) for all elements (${totalElements})`
    );
  }

  // Assign positions to each category in a way that distributes them evenly across the screen
  // This ensures a balanced layout matching the reference image

  // Distribute programming languages in the top-left and middle-right areas
  const programmingPositions = [
    allPositions[0],
    allPositions[1],
    allPositions[2],
    allPositions[3],
    allPositions[12],
    allPositions[13],
    allPositions[14],
    allPositions[15],
  ];

  // Distribute frameworks in the top-right and middle-left areas
  const frameworkPositions = [
    allPositions[4],
    allPositions[5],
    allPositions[6],
    allPositions[7],
    allPositions[8],
    allPositions[9],
    allPositions[10],
    allPositions[11],
  ];

  // Distribute tools in the bottom area
  const toolPositions = [
    allPositions[16],
    allPositions[17],
    allPositions[18],
    allPositions[19],
    allPositions[20],
    allPositions[22],
    allPositions[26],
    allPositions[34],
  ];

  // Distribute code symbols throughout the remaining positions
  const symbolPositions = allPositions.filter(
    (_, index) =>
      ![
        ...programmingPositions,
        ...frameworkPositions,
        ...toolPositions,
      ].includes(allPositions[index])
  );

  // Create distributed elements with fixed positions
  const distributedProgrammingLanguages = programmingLanguages.map(
    (lang, i) => ({
      ...lang,
      position: programmingPositions[i % programmingPositions.length],
    })
  );

  const distributedFrameworks = frameworks.map((framework, i) => ({
    ...framework,
    position: frameworkPositions[i % frameworkPositions.length],
  }));

  const distributedTools = tools.map((tool, i) => ({
    ...tool,
    position: toolPositions[i % toolPositions.length],
  }));

  const distributedSymbols = codeSymbols.map((symbol, i) => ({
    name: symbol,
    color: symbolColors[i % symbolColors.length],
    position: symbolPositions[i % symbolPositions.length],
  }));

  return (
    <div className="min-h-screen transition-all duration-300 text-white relative overflow-hidden">
      {/* Background with coding icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0A0F18] dark:bg-[#0A0F18] light:bg-[#f8fafc]"></div>

        {/* Programming languages */}
        {distributedProgrammingLanguages.map((lang, i) => (
          <div
            key={`lang-${i}`}
            style={{
              ...lang.position,
              fontSize: "22px",
              color: lang.color,
              filter: `blur(0.5px) drop-shadow(0 0 5px ${lang.color})`,
              textShadow: `0 0 8px ${lang.color}`,
              opacity: 0.85,
              position: "absolute",
              zIndex: 1,
            }}
            className="font-mono font-bold"
          >
            {lang.symbol || lang.name}
          </div>
        ))}

        {/* Frameworks */}
        {distributedFrameworks.map((framework, i) => (
          <div
            key={`framework-${i}`}
            style={{
              ...framework.position,
              fontSize: "20px",
              color: framework.color,
              filter: `blur(0.5px) drop-shadow(0 0 5px ${framework.color})`,
              textShadow: `0 0 8px ${framework.color}`,
              opacity: 0.85,
              position: "absolute",
              zIndex: 1,
            }}
            className="font-mono font-bold"
          >
            {framework.symbol || framework.name}
          </div>
        ))}

        {/* Tools */}
        {distributedTools.map((tool, i) => (
          <div
            key={`tool-${i}`}
            style={{
              ...tool.position,
              fontSize: "20px",
              color: tool.color,
              filter: `blur(0.5px) drop-shadow(0 0 5px ${tool.color})`,
              textShadow: `0 0 8px ${tool.color}`,
              opacity: 0.85,
              position: "absolute",
              zIndex: 1,
            }}
            className="font-mono font-bold"
          >
            {tool.symbol || tool.name}
          </div>
        ))}

        {/* Code symbols */}
        {distributedSymbols.map((symbol, i) => (
          <div
            key={`symbol-${i}`}
            style={{
              ...symbol.position,
              fontSize: "18px",
              color: symbol.color,
              filter: `blur(0.5px) drop-shadow(0 0 5px ${symbol.color})`,
              textShadow: `0 0 8px ${symbol.color}`,
              opacity: 0.85,
              position: "absolute",
              zIndex: 1,
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

          {/* Stats cards */}
          <motion.div
            className="stats-container relative z-20 p-4 rounded-lg bg-black/20 backdrop-blur-sm shadow-xl border-opacity-20"
            initial={{ opacity: 0, y: 20 }}
            animate={
              loadingSequence.statsLoaded
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="stats-card bg-black/40 shadow-lg relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
            >
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
                24
              </motion.p>
            </motion.div>

            <motion.div
              className="stats-card bg-black/40 shadow-lg relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.6 }}
            >
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
                12
              </motion.p>
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
