import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const AnimatedBackground = () => {
  const { darkMode } = useTheme();

  // Programming languages
  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go'];
  
  // Frameworks
  const frameworks = ['React', 'Angular', 'Vue', 'Next.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'TensorFlow'];
  
  // Tools and libraries
  const tools = ['Git', 'Docker', 'Redux', 'GraphQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Firebase', 'Webpack', 'Tailwind'];
  
  // Code symbols
  const symbols = ['{ }', '[ ]', '( )', '</>', '&&', '||', '=>', '++', '**', '...', '?:', '===', '!==', '//'];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated glowing blobs */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-xl"
        animate={{
          y: [0, 15, 0],
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 right-10 w-80 h-80 rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-xl"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-40 left-1/3 w-72 h-72 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-xl"
        animate={{
          x: [0, 15, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Code-like pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYyYzcuNzMyIDAgMTQgNi4yNjggMTQgMTRoMnptLTIgMGMwIDcuNzMyLTYuMjY4IDE0LTE0IDE0djJjOC45NCAwIDE2LTcuMDYgMTYtMTZoLTJ6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg==')]"></div>
      
      {/* Programming languages */}
      {languages.map((lang, i) => (
        <motion.div
          key={`lang-${i}`}
          className={`absolute ${darkMode ? 'text-blue-400' : 'text-blue-500'} font-mono font-bold`}
          style={{
            top: `${Math.random() * 90 + 5}%`,
            left: `${Math.random() * 90 + 5}%`,
            fontSize: `${Math.random() * 10 + 12}px`,
            opacity: 0.4,
            filter: `drop-shadow(0 0 3px ${darkMode ? 'rgba(96, 165, 250, 0.5)' : 'rgba(59, 130, 246, 0.5)'})`
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            y: [0, -15, 0],
            filter: [
              `drop-shadow(0 0 2px ${darkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.3)'})`,
              `drop-shadow(0 0 5px ${darkMode ? 'rgba(96, 165, 250, 0.6)' : 'rgba(59, 130, 246, 0.6)'})`,
              `drop-shadow(0 0 2px ${darkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.3)'})`
            ]
          }}
          transition={{
            duration: Math.random() * 5 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        >
          {lang}
        </motion.div>
      ))}
      
      {/* Frameworks */}
      {frameworks.map((framework, i) => (
        <motion.div
          key={`framework-${i}`}
          className={`absolute ${darkMode ? 'text-purple-400' : 'text-purple-500'} font-mono font-bold`}
          style={{
            top: `${Math.random() * 90 + 5}%`,
            left: `${Math.random() * 90 + 5}%`,
            fontSize: `${Math.random() * 10 + 12}px`,
            opacity: 0.4,
            filter: `drop-shadow(0 0 3px ${darkMode ? 'rgba(192, 132, 252, 0.5)' : 'rgba(168, 85, 247, 0.5)'})`
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            y: [0, -15, 0],
            filter: [
              `drop-shadow(0 0 2px ${darkMode ? 'rgba(192, 132, 252, 0.3)' : 'rgba(168, 85, 247, 0.3)'})`,
              `drop-shadow(0 0 5px ${darkMode ? 'rgba(192, 132, 252, 0.6)' : 'rgba(168, 85, 247, 0.6)'})`,
              `drop-shadow(0 0 2px ${darkMode ? 'rgba(192, 132, 252, 0.3)' : 'rgba(168, 85, 247, 0.3)'})`
            ]
          }}
          transition={{
            duration: Math.random() * 5 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        >
          {framework}
        </motion.div>
      ))}
      
      {/* Tools and libraries */}
      {tools.map((tool, i) => (
        <motion.div
          key={`tool-${i}`}
          className={`absolute ${darkMode ? 'text-green-400' : 'text-green-500'} font-mono font-bold`}
          style={{
            top: `${Math.random() * 90 + 5}%`,
            left: `${Math.random() * 90 + 5}%`,
            fontSize: `${Math.random() * 10 + 12}px`,
            opacity: 0.4,
            filter: `drop-shadow(0 0 3px ${darkMode ? 'rgba(74, 222, 128, 0.5)' : 'rgba(34, 197, 94, 0.5)'})`
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            y: [0, -15, 0],
            filter: [
              `drop-shadow(0 0 2px ${darkMode ? 'rgba(74, 222, 128, 0.3)' : 'rgba(34, 197, 94, 0.3)'})`,
              `drop-shadow(0 0 5px ${darkMode ? 'rgba(74, 222, 128, 0.6)' : 'rgba(34, 197, 94, 0.6)'})`,
              `drop-shadow(0 0 2px ${darkMode ? 'rgba(74, 222, 128, 0.3)' : 'rgba(34, 197, 94, 0.3)'})`
            ]
          }}
          transition={{
            duration: Math.random() * 5 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        >
          {tool}
        </motion.div>
      ))}
      
      {/* Code symbols */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`symbol-${i}`}
          className={`absolute ${darkMode ? 'text-amber-400' : 'text-amber-500'} font-mono font-bold`}
          style={{
            top: `${Math.random() * 90 + 5}%`,
            left: `${Math.random() * 90 + 5}%`,
            fontSize: `${Math.random() * 12 + 14}px`,
            opacity: 0.4,
            filter: `drop-shadow(0 0 3px ${darkMode ? 'rgba(251, 191, 36, 0.5)' : 'rgba(245, 158, 11, 0.5)'})`
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            y: [0, -15, 0],
            rotate: [0, Math.random() * 20 - 10, 0],
            filter: [
              `drop-shadow(0 0 2px ${darkMode ? 'rgba(251, 191, 36, 0.3)' : 'rgba(245, 158, 11, 0.3)'})`,
              `drop-shadow(0 0 5px ${darkMode ? 'rgba(251, 191, 36, 0.6)' : 'rgba(245, 158, 11, 0.6)'})`,
              `drop-shadow(0 0 2px ${darkMode ? 'rgba(251, 191, 36, 0.3)' : 'rgba(245, 158, 11, 0.3)'})`
            ]
          }}
          transition={{
            duration: Math.random() * 5 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        >
          {symbols[Math.floor(Math.random() * symbols.length)]}
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedBackground;
