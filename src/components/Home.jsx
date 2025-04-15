import { motion } from "framer-motion";
import React from "react";
import { useTheme } from "../context/ThemeContext";
import Navbar from "./ui/Navbar";

const Home = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto mt-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Welcome to CodeMate
          </h1>
          <p className="text-xl mb-8 opacity-80">
            Connect with other developers and find your perfect coding partner
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
