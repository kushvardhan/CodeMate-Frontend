import { motion } from "framer-motion";
import React from "react";

const Card = ({
  user,
  isNextCard = false,
  isCardSwiping = false,
  swipeDirection = null,
  isPreview = false,
}) => {
  // Get theme context for potential future use

  // Default user data if not provided
  const defaultUser = {
    name: "User 1",
    bio: "Passionate about creating beautiful and functional web applications. Love working with React, Node.js, and exploring new technologies.",
    skills: ["React", "Node.js", "JavaScript", "TypeScript", "MongoDB"],
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    location: "San Francisco, CA",
  };
  console.log("User from card: ", user);

  // Use provided user data or default
  const userData = user || defaultUser;



const truncateBio = (bio) => {
  if (!bio) return "";

  if (bio.length <= 70) return bio;

  return bio.slice(0, 70) + "...";
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
    initial: { opacity: 1, y: 0, scale: 1 },
    animate: {
      opacity: 1, // Ensure full visibility for all cards
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
    nextCard: {
      opacity: 1, // Ensure no transparency for back cards
      scale: 1, // Same size as the top card
      y: 0, // Centered vertically
      x: 0, // Centered horizontally
      rotateZ: 0, // No rotation
      zIndex: 5, // Lower z-index to appear behind the current card
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      margin: "auto",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.2,
      },
    },
    hover: {
      y: -2,
      scale: 1.005,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.2,
      },
    },
    swipeLeft: {
      x: -1000,
      opacity: 0,
      rotate: -10,
      transition: {
        duration: 0.2,
        ease: [0.23, 1, 0.32, 1],
        type: "tween",
      },
    },
    swipeRight: {
      x: 1000,
      opacity: 0,
      rotate: 10,
      transition: {
        duration: 0.2,
        ease: [0.23, 1, 0.32, 1],
        type: "tween",
      },
    },
  };

  // Skill tag animation variants
  const skillVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.05 },
  };

  // No longer needed as drag is handled by parent
  // const [dragDirection, setDragDirection] = React.useState(null);

  // Effect to handle external swipe triggers (from buttons or parent component)
  React.useEffect(() => {
    if (isCardSwiping && swipeDirection) {
      // Use document.querySelector with a more specific selector for better performance
     const element = document.querySelector(".tinder-card.top-card");

      if (element) {
        // Set will-change to hint browser for optimization
        element.style.willChange = "transform, opacity, box-shadow, border";

        // Force a reflow to ensure smooth animation
        void element.offsetWidth;

        // Apply Tinder-like exit animation based on direction
        // Use a shorter duration for faster animation (like Tinder)
        element.style.transition =
          "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease-out, box-shadow 0.4s ease-out, border 0.4s ease-out";

        if (swipeDirection === "left") {
  element.style.transition = "box-shadow 0.3s ease, transform 0.4s ease";
  element.style.transform = `translateX(-1500px) rotate(-30deg) scale(0.8)`;
  element.style.opacity = "0";
  element.style.boxShadow = "0 0 40px 12px rgba(255, 59, 48, 0.8)";
  element.style.border = "3px solid rgba(255, 59, 48, 1)";
  element.setAttribute("data-drag", "left");
} else if (swipeDirection === "right") {
  element.style.transition = "box-shadow 0.3s ease, transform 0.4s ease";
  element.style.transform = `translateX(1500px) rotate(30deg) scale(0.8)`;
  element.style.opacity = "0";
  element.style.boxShadow = "0 0 40px 12px rgba(52, 199, 89, 0.8)";
  element.style.border = "3px solid rgba(52, 199, 89, 1)";
  element.setAttribute("data-drag", "right");
} else if (swipeDirection === "rewind") {
  element.style.transition = "box-shadow 0.3s ease, transform 0.4s ease";
  element.style.transform = `translateX(0) rotate(0) scale(1)`;
  element.style.opacity = "1";
  element.style.boxShadow = "0 0 40px 12px rgba(99, 102, 241, 0.8)";
  element.style.border = "3px solid rgba(99, 102, 241, 1)";
  element.setAttribute("data-drag", "rewind");
}


        // Clean up after animation completes
        setTimeout(() => {
          if (element && element.isConnected) {
            // Reset the transform to ensure the next card appears in the center
            element.style.transition = "none";
            element.style.transform = "translateX(0) rotate(0) scale(1)";
            element.style.opacity = "1";
            element.style.boxShadow = "";
            element.style.border = "none";
            element.setAttribute("data-drag", "none");
            element.style.willChange = "auto";
            element.style.left = "0";
            element.style.right = "0";
            element.style.top = "0";
            element.style.bottom = "0";
            element.style.margin = "auto";
            element.style.position = "relative";

            // Force a reflow to ensure the transition is removed
            void element.offsetWidth;

            // Also reset all next cards to ensure they appear in the center
            const nextCards = document.querySelectorAll(
              ".next-card, .preview-stack-card"
            );
            nextCards.forEach((card) => {
              // Force the card to be centered with !important styles
              card.style.cssText = `
                transition: transform 0.3s ease, opacity 0.3s ease !important;
                transform: translateX(0) translateY(10px) scale(0.95) !important;
                opacity: 0.85 !important;
                position: absolute !important;
                left: 0 !important;
                right: 0 !important;
                top: 0 !important;
                bottom: 0 !important;
                margin: auto !important;
                z-index: 5 !important;
              `;

              // Force a reflow to apply the changes immediately
              void card.offsetWidth;

              // Reset any parent containers as well
              const parentContainer = card.closest(
                ".static-card-position, .static-card-stack"
              );
              if (parentContainer) {
                parentContainer.style.cssText = `
                  position: absolute !important;
                  left: 0 !important;
                  right: 0 !important;
                  top: 0 !important;
                  bottom: 0 !important;
                  margin: auto !important;
                  display: flex !important;
                  justify-content: center !important;
                  align-items: center !important;
                `;
              }

              // Also reset the tinder-card-stack container
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
            });
          }
        }, 600); // Match timeout to the animation duration
      }
    }
  }, [isCardSwiping, swipeDirection]);

  const showingNextCard = false; // Just a constant now

  // We don't need the complex card positioning logic anymore
  // as it's handled by the parent component
  React.useEffect(() => {
    // No need to reset state as we're not handling drag anymore

    if (!isNextCard && !isPreview) {
      // No state to reset

      // Ensure the card is in the center position
      setTimeout(() => {
        const cardElement = document.querySelector(
          ".dev-card:not(.next-card):not(.preview-card)"
        );
        if (cardElement) {
          // Force absolute center positioning with !important
          cardElement.style.cssText = `
            transition: none !important;
            transform: translateX(0) rotate(0) scale(1) !important;
            opacity: 1 !important;
            box-shadow: none !important;
            border: none !important;
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            margin: 0 !important;
            z-index: 10 !important;
          `;
          cardElement.setAttribute("data-drag", "none");

          // Force a reflow to apply the changes immediately
          void cardElement.offsetWidth;
        }

        // Reset all next cards to ensure they appear in the center
        const nextCards = document.querySelectorAll(
          ".next-card, .preview-stack-card"
        );
        nextCards.forEach((card) => {
          // Force the card to be centered with !important styles
          card.style.cssText = `
            transition: transform 0.3s ease, opacity 0.3s ease !important;
            transform: translate(-50%, -50%) translateY(10px) scale(0.95) !important;
            opacity: 0.85 !important;
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            margin: 0 !important;
            z-index: 5 !important;
          `;

          // Force a reflow to apply the changes immediately
          void card.offsetWidth;

          // Reset any parent containers as well
          const parentContainer = card.closest(
            ".static-card-position, .static-card-stack"
          );
          if (parentContainer) {
            parentContainer.style.cssText = `
              position: absolute !important;
              left: 50% !important;
              top: 50% !important;
              transform: translate(-50%, -50%) !important;
              margin: 0 !important;
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
            `;
          }

          // Also reset the tinder-card-stack container
          const cardStack = document.querySelector(".tinder-card-stack");
          if (cardStack) {
            cardElement.style.cssText = `
  transition: none !important;
  transform: none !important;
  opacity: 1 !important;
  box-shadow: none !important;
  border: none !important;
  position: absolute !important;
  left: 0 !important;
  top: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 10 !important;
`;
          }
        });
      }, 50);
    }
  }, [isNextCard, isPreview]);

  return (
    <motion.div
      className={`tinder-card ${
        !isNextCard && !isPreview ? "top-card" : "background-card"
      }`}
      variants={cardVariants}
      initial="initial"
      animate={isNextCard ? "nextCard" : "animate"}
      whileHover={
        showingNextCard || isNextCard || isPreview ? undefined : "hover"
      }
      drag={false} // Disable drag as it's handled by parent component
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100%",
        maxHeight: "100%",
        position: "absolute",
        left: 0,
        top: 0,
        borderRadius: "1px",
        overflow: "hidden",
        background: "black", // Ensure white background
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow
      }}
    >
      
      <div
        className="dev-card-content"
        style={{
          backgroundColor: "transparent", // Always transparent to show image
          borderRadius: "10px",
          overflow: "hidden",
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
            filter:
              "brightness(1.05) contrast(1.05)" /* Slightly enhance brightness and contrast */,
            zIndex: 1,
            display: "block" /* Ensure image is displayed as block */,
            pointerEvents: "none", // Prevent image from interfering with drag
          }}
          onLoad={(e) => {
            // Force browser to render the image at full quality immediately
            e.target.style.opacity = "1";
            e.target.style.filter = "none";
            // Add a class to indicate the image is loaded
            e.target.classList.add("loaded");
          }}
        />
        <div
          className="dev-card-overlay"
          style={{
             zIndex: 2,
    position: "absolute",
    top:"30%",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",   
    background:
      "linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 0.3) 90%, transparent 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "20px 16px 16px 16px",
          }}
        >
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
                <span>{userData.location || ""} </span>
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
                    <path
                      d="M20 21v-2a8 8 0 0 0-16 0v2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {userData.age}, {userData.gender}
                  </span>
                </div>
              </div>
            )}

            {userData.bio && (
              <div className="dev-card-bio-section">
                {/* <div className="dev-card-bio-header">
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
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                  </svg>
                </div> */}
                <p className="dev-card-bio">{truncateBio(userData.bio)}</p>
              </div>
            )}

            {userData.skills && userData.skills.length > 0 && (
              <div className="dev-card-skills-section flex flex-wrap">
                <div className="dev-card-skills-header">
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
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                    <path d="M3 12v7c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-7"></path>
                  </svg>
                </div>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
