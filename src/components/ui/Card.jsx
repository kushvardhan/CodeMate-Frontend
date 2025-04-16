import { motion } from "framer-motion";
import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Card = ({
  user,
  onSwipeLeft,
  onSwipeRight,
  isNextCard = false,
  isCardSwiping = false,
  swipeDirection = null,
}) => {
  const { darkMode } = useTheme();

  // Default user data if not provided
  const defaultUser = {
    name: "Kush Vardhan",
    bio: "Passionate about creating beautiful and functional web applications. Love working with React, Node.js, and exploring new technologies.",
    skills: ["React", "Node.js", "JavaScript", "TypeScript", "MongoDB"],
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    location: "San Francisco, CA",
  };

  // Use provided user data or default
  const userData = user || defaultUser;

  // Truncate bio to exactly 10 words
  const truncateBio = (bio) => {
    if (!bio) return "";
    const words = bio.split(" ");
    if (words.length <= 10) return bio;
    return words.slice(0, 10).join(" ") + "...";
  };

  // Dynamically handle skills display - always show max 2 skills
  const getDisplaySkills = (skills) => {
    if (!skills || skills.length === 0) return [];
    if (skills.length <= 2) return skills;
    return skills.slice(0, 2); // Always show only 2 skills to make room for the +X indicator
  };

  // Get the count of additional skills
  const getAdditionalSkillsCount = (skills) => {
    if (!skills || skills.length <= 2) return 0;
    return skills.length - 2;
  };

  // Card animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "none" /* Ensure no filter is applied */,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
    // Tinder-like next card (exactly like Tinder)
    nextCard: {
      opacity: 1 /* Fully visible but behind current card */,
      scale: 1 /* Same size as current card */,
      y: 0 /* Same position as current card */,
      rotateZ: 0 /* No rotation */,
      filter: "blur(0px)" /* No blur */,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.2,
      },
    },
    hover: {
      y: -3, // Reduced lift effect
      scale: 1.01, // Significantly reduced scale effect
      boxShadow: darkMode
        ? "0 12px 30px -5px rgba(66, 153, 225, 0.3), 0 8px 10px -5px rgba(66, 153, 225, 0.2)"
        : "0 12px 30px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.06)",
      transition: {
        type: "tween", // Changed to tween for smoother effect
        ease: "easeOut",
        duration: 0.2,
      },
    },
    swipeLeft: {
      x: -1000,
      opacity: 0,
      rotate: -10, // Less rotation for more natural feel
      transition: {
        duration: 0.2, // Faster transition for instant feel
        ease: [0.23, 1, 0.32, 1],
        type: "tween", // Explicit tween for smoother animation
      },
    },
    swipeRight: {
      x: 1000,
      opacity: 0,
      rotate: 10, // Less rotation for more natural feel
      transition: {
        duration: 0.2, // Faster transition for instant feel
        ease: [0.23, 1, 0.32, 1],
        type: "tween", // Explicit tween for smoother animation
      },
    },
  };

  // Skill tag animation variants
  const skillVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.05 },
  };

  // State to track drag direction
  const [dragDirection, setDragDirection] = React.useState(null);

  // Effect to handle external swipe triggers (from buttons or parent component)
  React.useEffect(() => {
    if (isCardSwiping && swipeDirection) {
      // Use document.querySelector with a more specific selector for better performance
      const element = document.querySelector(".tinder-current-card .dev-card");
      if (element) {
        // Set will-change to hint browser for optimization
        element.style.willChange = "transform, opacity, box-shadow, border";

        // Force a reflow to ensure smooth animation
        void element.offsetWidth;

        // Apply Tinder-like exit animation based on direction
        // Use a longer duration for smoother animation
        element.style.transition =
          "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease-out, box-shadow 0.4s ease-out, border 0.4s ease-out";

        if (swipeDirection === "left") {
          element.style.transform = `translateX(-1500px) rotate(-30deg) scale(0.8)`;
          element.style.opacity = "0";
          element.style.boxShadow = "0 0 30px 10px rgba(255, 59, 48, 0.8)";
          element.style.border = "3px solid rgba(255, 59, 48, 0.9)";
          // Set data attribute for CSS targeting
          element.setAttribute("data-drag", "left");
        } else if (swipeDirection === "right") {
          element.style.transform = `translateX(1500px) rotate(30deg) scale(0.8)`;
          element.style.opacity = "0";
          element.style.boxShadow = "0 0 30px 10px rgba(52, 199, 89, 0.8)";
          element.style.border = "3px solid rgba(52, 199, 89, 0.9)";
          // Set data attribute for CSS targeting
          element.setAttribute("data-drag", "right");
        }

        // Clean up after animation completes
        setTimeout(() => {
          if (element) {
            element.style.willChange = "auto";
          }
        }, 600); // Longer timeout to match the longer animation
      }
    }
  }, [isCardSwiping, swipeDirection]);

  // State to track swipe progress (0-100%)
  const [swipeProgress, setSwipeProgress] = React.useState(0);

  // State to track if we're showing the next card
  const [showingNextCard, setShowingNextCard] = React.useState(false);

  // Optimized drag handler to reduce stuttering
  const handleDrag = (event, info) => {
    // Don't process drag if we're already showing the next card
    if (showingNextCard) return;

    // Calculate swipe progress as a percentage (0-100)
    const swipeThreshold = 100; // Lower threshold for easier swiping (Tinder-like)

    // Calculate rotation based on drag distance (Tinder-like)
    // Max rotation of 20 degrees (Tinder uses about 15-20 degrees)
    const rotate = Math.min(Math.max(info.offset.x * 0.1, -20), 20); // 0.1 is a sensitivity factor, clamp between -20 and 20 degrees

    // Get the card element directly from the event target for better performance
    // This avoids querySelector which can cause performance issues
    const element = event.currentTarget;
    if (element) {
      // Apply rotation and horizontal movement with slight vertical lift (Tinder-like)
      // Use transform for better performance
      element.style.transform = `translateX(${info.offset.x}px) translateY(${
        -Math.abs(info.offset.x) * 0.05
      }px) rotate(${rotate}deg)`;

      // Apply color overlay based on direction (Tinder-like), but ONLY when actively moving
      // Check if there's actual movement (velocity) to determine if actively dragging
      // Use a higher threshold to ensure we only show colors during definite movement
      const isActivelyDragging = Math.abs(info.velocity.x) > 0.5;

      if (info.offset.x > 50 && isActivelyDragging) {
        // Green overlay for right swipe (like), only when actively dragging right
        // Pre-calculate the opacity value to reduce calculations during drag
        const opacity = Math.min(Math.abs(info.offset.x) / 300, 0.9);
        // More pronounced green shadow/glow effect
        element.style.boxShadow = `0 0 20px 5px rgba(52, 199, 89, ${opacity})`;
        element.style.borderColor = `rgba(52, 199, 89, ${opacity})`;
        // Add a subtle green border
        element.style.border = `2px solid rgba(52, 199, 89, ${opacity})`;
        // Set data attribute for CSS targeting
        element.setAttribute("data-drag", "right");
      } else if (info.offset.x < -50 && isActivelyDragging) {
        // Red overlay for left swipe (nope), only when actively dragging left
        // Pre-calculate the opacity value to reduce calculations during drag
        const opacity = Math.min(Math.abs(info.offset.x) / 300, 0.9);
        // More pronounced red shadow/glow effect
        element.style.boxShadow = `0 0 20px 5px rgba(255, 59, 48, ${opacity})`;
        // Add a subtle red border
        element.style.border = `2px solid rgba(255, 59, 48, ${opacity})`;
        // Set data attribute for CSS targeting
        element.setAttribute("data-drag", "left");
      } else {
        // Reset overlay when not actively dragging or near center
        element.style.boxShadow = "";
        element.style.border = "none";
        // Reset data attribute
        element.setAttribute("data-drag", "none");
      }
    }

    // Calculate progress with dampened velocity influence (Tinder-like)
    // Use Math.floor to reduce unnecessary state updates for small changes
    const progress = Math.floor(
      Math.min((Math.abs(info.offset.x) / swipeThreshold) * 100, 100)
    );

    // Only update state if progress has changed significantly to reduce renders
    if (Math.abs(progress - swipeProgress) > 5) {
      setSwipeProgress(progress);
    }

    // Set direction based on drag direction (Tinder-like), but ONLY when actively moving
    // Use a larger threshold to reduce flickering between states
    // Check if there's actual movement (velocity) to determine if actively dragging
    // Use a higher threshold to ensure we only show colors during definite movement
    const isActivelyDragging = Math.abs(info.velocity.x) > 0.5;

    if (info.offset.x > 30 && isActivelyDragging) {
      if (dragDirection !== "right") setDragDirection("right");
    } else if (info.offset.x < -30 && isActivelyDragging) {
      if (dragDirection !== "left") setDragDirection("left");
    } else {
      // Reset when not actively dragging, regardless of position
      // This ensures the card has no color when at rest or just being held
      setDragDirection("none");
    }
  };

  return (
    <div className="card-container">
      {/* Swipe indicators */}
      <div className="swipe-indicators tinder-style">
        <div
          className="swipe-left-indicator tinder-indicator"
          style={{
            opacity: dragDirection === "left" ? swipeProgress / 100 : 0,
          }}
        >
          <div className="indicator-icon ignore-icon tinder-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <span className="indicator-text tinder-text">NOPE</span>
        </div>

        <div
          className="swipe-right-indicator tinder-indicator"
          style={{
            opacity: dragDirection === "right" ? swipeProgress / 100 : 0,
          }}
        >
          <div className="indicator-icon match-icon tinder-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span className="indicator-text tinder-text">LIKE</span>
        </div>
      </div>

      {/* Only show floating icons when swiping right */}
      {dragDirection === "right" && (
        <div className="floating-icons right-icons">
          {/* Code brackets */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`code-${i}`}
              className="floating-icon code-icon"
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0, 1, 0.8],
                x: [0, Math.random() * 300 + 100],
                y: [0, Math.random() * 300 - 150],
              }}
              transition={{ duration: 1.2, delay: i * 0.1 }}
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
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </motion.div>
          ))}

          {/* Function symbols */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`function-${i}`}
              className="floating-icon function-icon"
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0, 1, 0.8],
                x: [0, Math.random() * 300 + 100],
                y: [0, Math.random() * 300 - 150],
              }}
              transition={{ duration: 1.2, delay: 0.15 + i * 0.1 }}
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
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </motion.div>
          ))}

          {/* Heart icons */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`heart-${i}`}
              className="floating-icon heart-icon"
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0, 1, 0.8],
                x: [0, Math.random() * 300 + 100],
                y: [0, Math.random() * 300 - 150],
              }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
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
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </motion.div>
          ))}

          {/* Code symbols */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`terminal-${i}`}
              className="floating-icon terminal-icon"
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0, 1, 0.8],
                x: [0, Math.random() * 300 + 100],
                y: [0, Math.random() * 300 - 150],
              }}
              transition={{ duration: 1.2, delay: 0.2 + i * 0.1 }}
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
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main card */}
      <motion.div
        className={`dev-card ${isNextCard ? "next-card" : ""}`}
        variants={cardVariants}
        initial="initial"
        animate={isNextCard ? "nextCard" : "animate"}
        whileHover={
          showingNextCard || isNextCard ? undefined : "hover"
        } /* Disable hover animation during transitions and for next card */
        drag={
          showingNextCard || isNextCard ? false : "x"
        } /* Disable dragging for next card */
        dragConstraints={{
          left: -1000,
          right: 1000,
        }} /* Allow more movement for Tinder-like feel */
        dragElastic={1} /* Full elasticity for Tinder-like feel */
        dragMomentum={true} /* Enable momentum for natural feel */
        dragTransition={{
          power: 0.2 /* More natural power for Tinder-like feel */,
          timeConstant: 400 /* Faster time constant for Tinder-like feel */,
          restDelta: 0.5 /* Higher rest delta for Tinder-like feel */,
        }}
        onDrag={handleDrag}
        onDragEnd={(event, { offset, velocity }) => {
          // Don't process drag end if we're already showing the next card
          if (showingNextCard) return;

          const swipe = offset.x;
          const swipeVelocity = Math.abs(velocity.x);
          const swipeThreshold = 80; // Lower threshold for easier swiping (Tinder uses ~80px)

          // Get the card element directly from the event for better performance
          const element = event.currentTarget;

          // Consider both distance and velocity for a more natural feel (Tinder-like)
          // Tinder allows quick flicks with less distance
          const isSwipeLeft =
            swipe < -swipeThreshold || (swipe < -40 && swipeVelocity > 0.8);
          const isSwipeRight =
            swipe > swipeThreshold || (swipe > 40 && swipeVelocity > 0.8);

          if (isSwipeLeft) {
            // Prevent multiple swipes
            if (showingNextCard) return;
            setShowingNextCard(true);

            // Tinder-like exit animation for left swipe with more pronounced red effect
            if (element) {
              // Use will-change to hint browser for optimization
              element.style.willChange =
                "transform, opacity, box-shadow, border";
              // Tinder uses a combination of rotation, translation and opacity
              element.style.transition =
                "transform 0.4s ease-out, opacity 0.3s ease-out, box-shadow 0.3s ease-out, border 0.3s ease-out";
              element.style.transform = `translateX(-1500px) rotate(-30deg) scale(0.8)`;
              element.style.opacity = "0";
              // More pronounced red shadow/glow effect
              element.style.boxShadow = "0 0 30px 10px rgba(255, 59, 48, 0.8)";
              element.style.border = "3px solid rgba(255, 59, 48, 0.9)";
            }

            // Set the swipe direction for animation
            setDragDirection("left");

            // Preload next card image to prevent lag
            if (onSwipeLeft) {
              // Trigger the swipe action after a short delay
              // This is faster than Tinder but still allows for the animation
              setTimeout(() => {
                onSwipeLeft();
                // Reset progress after the card is gone
                setSwipeProgress(0);
              }, 200);
            }
          } else if (isSwipeRight) {
            // Prevent multiple swipes
            if (showingNextCard) return;
            setShowingNextCard(true);

            // Tinder-like exit animation for right swipe with more pronounced green effect
            if (element) {
              // Use will-change to hint browser for optimization
              element.style.willChange =
                "transform, opacity, box-shadow, border";
              // Tinder uses a combination of rotation, translation and opacity
              element.style.transition =
                "transform 0.4s ease-out, opacity 0.3s ease-out, box-shadow 0.3s ease-out, border 0.3s ease-out";
              element.style.transform = `translateX(1500px) rotate(30deg) scale(0.8)`;
              element.style.opacity = "0";
              // More pronounced green shadow/glow effect
              element.style.boxShadow = "0 0 30px 10px rgba(52, 199, 89, 0.8)";
              element.style.border = "3px solid rgba(52, 199, 89, 0.9)";
            }

            // Set the swipe direction for animation
            setDragDirection("right");

            // Preload next card image to prevent lag
            if (onSwipeRight) {
              // Trigger the swipe action after a short delay
              // This is faster than Tinder but still allows for the animation
              setTimeout(() => {
                onSwipeRight();
                // Reset progress after the card is gone
                setSwipeProgress(0);
              }, 200);
            }
          } else {
            // Spring back to center if not swiped far enough (Tinder-like)
            if (element) {
              // Tinder uses a spring animation for the return
              element.style.transition =
                "transform 0.3s cubic-bezier(0.215, 0.610, 0.355, 1.000)";
              element.style.transform =
                "translateX(0) translateY(0) rotate(0deg)";
              element.style.boxShadow = "";

              // Reset progress
              setSwipeProgress(0);
            }
          }
        }}
        data-drag={dragDirection}
      >
        <div className="dev-card-content">
          <motion.img
            src={userData.image}
            alt={userData.name}
            className="dev-card-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.05 }} /* Even faster transition */
            loading="eager" /* Force eager loading */
            decoding="sync" /* Decode image synchronously */
            fetchPriority="high" /* High priority fetch */
            draggable="false" /* Prevent image dragging for better performance */
            style={{
              willChange:
                "transform, opacity" /* Hint browser for optimization */,
              backfaceVisibility: "hidden" /* Prevent flickering */,
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(0)" /* Force GPU acceleration */,
              WebkitTransform: "translateZ(0)",
              objectFit: "cover" /* Ensure image covers the entire card */,
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            onLoad={(e) => {
              // Force browser to render the image at full quality immediately
              e.target.style.opacity = "1";
              e.target.style.filter = "none";
              // Add a class to indicate the image is loaded
              e.target.classList.add("loaded");
            }}
          />
          <div className="dev-card-overlay">
            <div className="dev-card-info">
              <h2 className="dev-card-name">{userData.name}</h2>
              {userData.location && (
                <div className="dev-card-location">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{userData.location}</span>
                </div>
              )}

              {/* Age and Gender */}
              {userData.age && userData.gender && (
                <div className="dev-card-info-row">
                  <div className="dev-card-age-gender">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="5"></circle>
                      <path d="M20 21v-2a8 8 0 0 0-16 0v2"></path>
                    </svg>
                    <span>
                      {userData.age}, {userData.gender}
                    </span>
                  </div>
                </div>
              )}

              {userData.bio && (
                <p className="dev-card-bio">{truncateBio(userData.bio)}</p>
              )}

              {userData.skills && userData.skills.length > 0 && (
                <div className="dev-card-skills">
                  {getDisplaySkills(userData.skills).map((skill, index) => (
                    <motion.span
                      key={index}
                      className="dev-skill-tag"
                      variants={skillVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      transition={{ delay: index * 0.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                  {getAdditionalSkillsCount(userData.skills) > 0 && (
                    <motion.span
                      className="dev-skill-more"
                      variants={skillVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      transition={{ delay: 0.1 }}
                    >
                      +{getAdditionalSkillsCount(userData.skills)}
                    </motion.span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Card;
