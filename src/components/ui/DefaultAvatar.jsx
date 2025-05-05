import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const DefaultAvatar = () => {
  const { darkMode } = useTheme();
  
  // Colors based on theme
  const primaryColor = darkMode ? '#a78bfa' : '#3a0ca3';
  const secondaryColor = darkMode ? '#8b5cf6' : '#4361ee';
  const bgColor = darkMode ? '#1e293b' : '#f8f9fa';
  
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <motion.circle
        cx="100"
        cy="100"
        r="100"
        fill={bgColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Glowing effect */}
      <motion.circle
        cx="100"
        cy="100"
        r="95"
        stroke={primaryColor}
        strokeWidth="2"
        strokeDasharray="10 5"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="30"
          dur="2s"
          repeatCount="indefinite"
        />
      </motion.circle>
      
      {/* Head */}
      <motion.circle
        cx="100"
        cy="85"
        r="35"
        fill={primaryColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />
      
      {/* Body */}
      <motion.path
        d="M50 180C50 146.863 76.8629 120 110 120H90C123.137 120 150 146.863 150 180V190H50V180Z"
        fill={secondaryColor}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      />
      
      {/* Code symbols */}
      <motion.text
        x="70"
        y="85"
        fontFamily="monospace"
        fontSize="12"
        fill={darkMode ? '#1e293b' : 'white'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        &lt;/&gt;
      </motion.text>
      
      <motion.text
        x="115"
        y="85"
        fontFamily="monospace"
        fontSize="12"
        fill={darkMode ? '#1e293b' : 'white'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        { }
      </motion.text>
      
      {/* Glowing dots */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.circle
          key={i}
          cx={100 + 45 * Math.cos((i * Math.PI) / 3)}
          cy={100 + 45 * Math.sin((i * Math.PI) / 3)}
          r="3"
          fill={i % 2 === 0 ? primaryColor : secondaryColor}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            delay: 0.8 + i * 0.1,
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
    </svg>
  );
};

export default DefaultAvatar;
