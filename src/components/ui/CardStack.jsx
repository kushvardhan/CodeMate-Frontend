import React, { useState, useEffect } from "react";
import TinderCard from "./TinderCard";
import { motion, AnimatePresence } from "framer-motion";

const CardStack = ({ cards, onSwipeLeft, onSwipeRight, onEmpty }) => {
  const [stack, setStack] = useState([]);
  
  // Initialize the stack when cards change
  useEffect(() => {
    if (cards && cards.length > 0) {
      setStack([...cards]);
    }
  }, [cards]);

  // Remove a card from the stack
  const removeCard = (id) => {
    setStack((prevStack) => {
      const newStack = prevStack.filter((card) => card.id !== id);
      
      // If stack is empty, call onEmpty callback
      if (newStack.length === 0 && onEmpty) {
        setTimeout(() => onEmpty(), 300);
      }
      
      return newStack;
    });
  };

  return (
    <div className="card-stack-container">
      {/* Empty state */}
      {stack.length === 0 && (
        <div className="empty-stack">
          <div className="empty-stack-content">
            <div className="empty-icon">
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
            <h3>No More Profiles</h3>
            <p>You've seen all available profiles.</p>
          </div>
        </div>
      )}
      
      {/* Card stack */}
      <div className="card-stack">
        {/* Static background cards */}
        {stack.length > 1 && (
          <div className="static-card third-card"></div>
        )}
        
        {stack.length > 1 && (
          <div className="static-card second-card"></div>
        )}
        
        {/* Interactive cards */}
        <AnimatePresence>
          {stack.map((card, index) => (
            // Only render the top card (last in the array) as interactive
            index === stack.length - 1 && (
              <TinderCard
                key={card.id}
                data={card}
                onSwipeLeft={onSwipeLeft}
                onSwipeRight={onSwipeRight}
                removeCard={removeCard}
              />
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CardStack;
