import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Card from "./ui/Card";
import Nav from "./ui/Nav";

const Home = () => {
  const { darkMode } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch users or use mock data
    const mockUsers = [
      {
        id: 1,
        name: "Jane Smith",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        address: "San Francisco, CA",
        description:
          "Full-stack developer with 5 years of experience in React and Node.js",
        skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
      },
      {
        id: 2,
        name: "John Doe",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        address: "New York, NY",
        description:
          "Frontend developer specializing in React and modern JavaScript",
        skills: ["React", "JavaScript", "CSS", "HTML", "Redux"],
      },
      {
        id: 3,
        name: "Emily Johnson",
        image: "https://randomuser.me/api/portraits/women/33.jpg",
        address: "Austin, TX",
        description: "Backend developer with expertise in Python and Django",
        skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
      },
      {
        id: 4,
        name: "Michael Brown",
        image: "https://randomuser.me/api/portraits/men/22.jpg",
        address: "Seattle, WA",
        description: "Mobile developer focused on React Native and Flutter",
        skills: ["React Native", "Flutter", "JavaScript", "Dart", "Firebase"],
      },
      {
        id: 5,
        name: "Sarah Wilson",
        image: "https://randomuser.me/api/portraits/women/56.jpg",
        address: "Chicago, IL",
        description: "DevOps engineer with strong CI/CD pipeline experience",
        skills: ["Docker", "Kubernetes", "Jenkins", "AWS", "Terraform"],
      },
    ];

    setUsers(mockUsers);
  }, []);

  const handleSwipeLeft = () => {
    console.log("Swiped left (pass)");
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    console.log("Swiped right (like)");
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getBackgroundClass = () => {
    return "";
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900/90 via-slate-900/90 to-gray-800/90 text-white"
          : "bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 text-gray-900"
      } ${getBackgroundClass()}`}
    >
      {/* WhatsApp-style background with glowy animated coding icons */}
      <div className="whatsapp-bg">
        {/* Base pattern */}
        <div className="absolute inset-0 bg-pattern opacity-30 dark:opacity-10"></div>

        {/* Animated circles for depth */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-10 dark:opacity-5 blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-10 dark:opacity-5 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-green-400 to-cyan-500 opacity-10 dark:opacity-5 blur-3xl animate-blob animation-delay-4000"></div>

        {/* Code icons scattered throughout */}
        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "10%", left: "15%", fontSize: "32px" }}
          animate={{ y: [-5, 5, -5], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          {`{ }`}
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "25%", right: "20%", fontSize: "36px" }}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          {`</>`}
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "40%", left: "25%", fontSize: "30px" }}
          animate={{ y: [-6, 6, -6], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          {`( )`}
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "60%", right: "25%", fontSize: "34px" }}
          animate={{ y: [-7, 7, -7], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          {`[ ]`}
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ bottom: "30%", left: "30%", fontSize: "28px" }}
          animate={{ y: [-5, 5, -5], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 5.5,
            ease: "easeInOut",
            delay: 0.7,
          }}
        >
          {`/* */`}
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ bottom: "20%", right: "20%", fontSize: "32px" }}
          animate={{ y: [-6, 6, -6], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 6.5,
            ease: "easeInOut",
            delay: 1.2,
          }}
        >
          {`=>`}
        </motion.div>

        {/* People icons */}
        <motion.div
          className="whatsapp-bg-icon people"
          style={{ top: "15%", right: "35%", fontSize: "36px" }}
          animate={{ y: [-7, 7, -7], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 0.3,
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon people"
          style={{ bottom: "40%", left: "15%", fontSize: "34px" }}
          animate={{ y: [-6, 6, -6], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
            delay: 1.8,
          }}
        >
          <svg
            width="34"
            height="34"
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
        </motion.div>

        {/* Connection icons */}
        <motion.div
          className="whatsapp-bg-icon connection"
          style={{ top: "50%", right: "10%", fontSize: "32px" }}
          animate={{ y: [-5, 5, -5], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 5.5,
            ease: "easeInOut",
            delay: 0.9,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon connection"
          style={{ bottom: "15%", left: "40%", fontSize: "34px" }}
          animate={{ y: [-7, 7, -7], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 7.5,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>
        </motion.div>

        {/* Programming language/framework icons */}
        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "8%", left: "38%" }}
          animate={{ y: [-6, 6, -6], opacity: [0.5, 0.7, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
            delay: 0.8,
          }}
        >
          {/* React Icon */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z"
              fill="currentColor"
            />
            <path
              d="M12 22.5C11.3905 22.5 10.7932 22.3898 10.1902 22.1769C9.5872 21.964 8.99409 21.6517 8.38398 21.2533C7.77386 20.8549 7.16374 20.3677 6.5379 19.8072C5.91206 19.2467 5.30195 18.6156 4.69183 17.9297C4.08171 17.2438 3.51732 16.5106 2.9794 15.7461C2.44148 14.9816 1.97283 14.2062 1.57346 13.4417C1.17408 12.6771 0.861963 11.9126 0.649102 11.1719C0.436242 10.4312 0.333252 9.73047 0.333252 9.07031C0.333252 8.41016 0.443404 7.70947 0.656265 6.96875C0.869125 6.22803 1.18124 5.46354 1.58062 4.69896C1.97999 3.93438 2.44865 3.15901 2.98656 2.39453C3.52448 1.63005 4.08887 0.896875 4.69899 0.210938C5.30911 0.0703125 5.91922 0 6.54506 0C7.1709 0 7.78102 0 8.39113 0C9.00125 0 9.59436 0 10.1974 0C10.8004 0 11.3977 0 12.0072 0C12.6167 0 13.214 0.0703125 13.817 0.210938C14.42 0.351562 15.0131 0.574219 15.6232 0.867188C16.2334 1.16016 16.8435 1.54688 17.4694 2.02734C18.0952 2.5078 18.7053 3.13281 19.3154 3.81875C19.9256 4.50469 20.4899 5.23789 21.0279 6.00234C21.5658 6.7668 22.0344 7.54219 22.4338 8.30677C22.8332 9.07135 23.1453 9.83594 23.3581 10.5767C23.571 11.3174 23.674 12.0182 23.674 12.6783C23.674 13.3385 23.5638 14.0392 23.3509 14.7799C23.1381 15.5206 22.826 16.2851 22.4266 17.0497C22.0272 17.8143 21.5586 18.5896 21.0207 19.3541C20.4827 20.1186 19.9184 20.8518 19.3082 21.5377C18.6981 22.2236 18.088 22.8486 17.4622 23.4128C16.8363 23.9769 16.2262 24.4641 15.6161 24.8625C15.006 25.2609 14.4129 25.5732 13.8099 25.7861C13.2069 25.999 12.6096 26.1092 12.0001 26.1092C11.3906 26.1092 10.7933 26.1092 10.1903 26.1092C9.5873 26.1092 8.9942 26.1092 8.38409 26.1092C7.77397 26.1092 7.17669 26.1092 6.57373 26.1092C5.97077 26.1092 5.37353 26.1092 4.77057 26.1092"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.3082 2.46094C19.9184 3.14687 20.4827 3.88008 21.0207 4.64453C21.5586 5.40898 22.0272 6.18438 22.4266 6.94896C22.826 7.71354 23.1381 8.47812 23.3509 9.21885C23.5638 9.95957 23.674 10.6603 23.674 11.3204C23.674 11.9806 23.571 12.6813 23.3581 13.422C23.1453 14.1628 22.8332 14.9273 22.4338 15.6919C22.0344 16.4565 21.5658 17.2319 21.0279 17.9964C20.4899 18.7608 19.9256 19.494 19.3154 20.18C18.7053 20.8659 18.0952 21.4909 17.4694 22.0714C16.8435 22.6518 16.2334 23.1391 15.6232 23.5375C15.0131 23.9359 14.42 24.2482 13.817 24.4611C13.214 24.674 12.6167 24.7842 12.0072 24.7842C11.3977 24.7842 10.8004 24.7842 10.1974 24.7842C9.59436 24.7842 9.00125 24.7842 8.39113 24.7842C7.78102 24.7842 7.1709 24.7842 6.54506 24.7842C5.91922 24.7842 5.30911 24.7139 4.69899 24.5733"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "12%", right: "22%" }}
          animate={{ y: [-7, 7, -7], opacity: [0.5, 0.7, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 0.3,
          }}
        >
          {/* JavaScript Icon */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3H21V21H3V3Z"
              fill="currentColor"
              fillOpacity="0.2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 11.5V17C16 17.5523 15.5523 18 15 18C14.4477 18 14 17.5523 14 17V11.5C14 10.9477 13.5523 10.5 13 10.5C12.4477 10.5 12 10.9477 12 11.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 12V17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17V12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "28%", left: "15%" }}
          animate={{ y: [-5, 5, -5], opacity: [0.5, 0.7, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 5.5,
            ease: "easeInOut",
            delay: 1.1,
          }}
        >
          {/* Python Icon */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.95 3C10.8048 3 9.86995 3.11436 9.09995 3.34094C7.55995 3.81188 7.19995 4.5875 7.19995 5.8V8.2H12V8.8H5.29995C4.01995 8.8 2.91995 9.55688 2.39995 10.7625C1.79995 12.1219 1.79995 13.0063 2.39995 14.4C2.85995 15.4844 3.69995 16.2 4.99995 16.2H7.09995V13.4469C7.09995 12.0281 8.29995 10.8 9.79995 10.8H14.6C15.8 10.8 16.8 9.75938 16.8 8.6V5.8C16.8 4.67812 15.75 3.81188 14.6 3.34094C13.85 3.04688 12.9 3 11.95 3ZM9.39995 4.6C9.84995 4.6 10.2 4.95938 10.2 5.4C10.2 5.84062 9.84995 6.2 9.39995 6.2C8.94995 6.2 8.59995 5.84062 8.59995 5.4C8.59995 4.95938 8.94995 4.6 9.39995 4.6Z"
              fill="currentColor"
              fillOpacity="0.5"
            />
            <path
              d="M17 8.8V11.6C17 13.0188 15.8 14.2 14.3 14.2H9.5C8.3 14.2 7.3 15.2406 7.3 16.4V19.2C7.3 20.3219 8.35 20.9344 9.5 21.2594C10.9 21.6438 12.2 21.7 13.7 21.2594C14.7 20.9938 15.7 20.3813 15.7 19.2V16.8H11V16.2H17.7C19 16.2 19.5 15.4844 20 14.4C20.5 13.2844 20.5 12.2 20 10.7625C19.65 9.7375 19 8.8 17.7 8.8H17ZM14.7 18.8C15.15 18.8 15.5 19.1594 15.5 19.6C15.5 20.0406 15.15 20.4 14.7 20.4C14.25 20.4 13.9 20.0406 13.9 19.6C13.9 19.1594 14.25 18.8 14.7 18.8Z"
              fill="currentColor"
              fillOpacity="0.5"
            />
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "35%", right: "35%" }}
          animate={{ y: [-6, 6, -6], opacity: [0.5, 0.7, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 6.5,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          {/* Java Icon */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 15C5.5 16.5 5.5 19.5 8.5 20.5C12.5 22 19 21.5 19 18C19 14.5 9.5 15 9.5 12.5C9.5 10 15 10.5 18 11.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8C12 8 14 6.5 14 5.5C14 4.5 13 3.5 11.5 3.5C10 3.5 9 4.5 9 5.5C9 6.5 10 7.5 12 8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 9C13 9 15 7.5 15 6.5C15 5.5 14 4.5 12.5 4.5C11 4.5 10 5.5 10 6.5C10 7.5 11 8.5 13 9Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "60%", left: "28%" }}
          animate={{ y: [-7, 7, -7], opacity: [0.5, 0.7, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 7.5,
            ease: "easeInOut",
            delay: 0.9,
          }}
        >
          {/* Rust Icon */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 9V12L14 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 12H5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 5V3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 21V19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ bottom: "35%", right: "18%" }}
          animate={{ y: [-6, 6, -6], opacity: [0.5, 0.7, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          {/* TypeScript Icon */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3H21V21H3V3Z"
              fill="currentColor"
              fillOpacity="0.2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 16.5V11.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 16.5V11.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 16.5C16 15.5717 16.3687 14.6815 17.0251 14.0251C17.6815 13.3687 18.5717 13 19.5 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 11.5C12 10.5717 11.6313 9.6815 10.9749 9.02513C10.3185 8.36875 9.42826 8 8.5 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ bottom: "25%", left: "25%" }}
          animate={{ y: [-5, 5, -5], opacity: [0.5, 0.7, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
            delay: 0.7,
          }}
        >
          {/* Node.js Icon */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="currentColor"
              fillOpacity="0.2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 16V8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 12L12 16L15 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Icons around stats section */}
        <motion.div
          className="whatsapp-bg-icon connection"
          style={{ top: "68%", left: "12%" }}
          animate={{ y: [-6, 6, -6], opacity: [0.4, 0.6, 0.4] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
            delay: 0.2,
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon people"
          style={{ top: "82%", left: "42%" }}
          animate={{ y: [-8, 8, -8], opacity: [0.4, 0.6, 0.4] }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
            delay: 1.2,
          }}
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon connection"
          style={{ top: "88%", left: "18%" }}
          animate={{ y: [-7, 7, -7], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <svg
            width="32"
            height="32"
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

        <motion.div
          className="whatsapp-bg-icon people"
          style={{ top: "25%", left: "8%" }}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
            delay: 1.7,
          }}
        >
          <svg
            width="34"
            height="34"
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
        </motion.div>

        {/* Infinity symbol with glow */}
        <motion.div
          className="absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.svg
            width="120"
            height="60"
            viewBox="0 0 120 60"
            className="infinity-symbol"
          >
            <motion.path
              d="M30,30 C30,16.8 41.34,6 55.2,6 C69.06,6 75,16.8 75,30 C75,43.2 69.06,54 55.2,54 C41.34,54 30,43.2 30,30 Z M90,30 C90,16.8 78.66,6 64.8,6 C50.94,6 45,16.8 45,30 C45,43.2 50.94,54 64.8,54 C78.66,54 90,43.2 90,30 Z"
              fill="none"
              stroke="url(#infinity-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              className="infinity-path"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: 1,
                filter: [
                  "drop-shadow(0 0 3px rgba(79, 70, 229, 0.6))",
                  "drop-shadow(0 0 8px rgba(79, 70, 229, 0.4))",
                  "drop-shadow(0 0 3px rgba(79, 70, 229, 0.6))",
                ],
              }}
              transition={{
                pathLength: { delay: 1.2, duration: 2, ease: "easeInOut" },
                opacity: { delay: 1.2, duration: 0.5 },
                filter: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              }}
            />
            <defs>
              <linearGradient
                id="infinity-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="50%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
          </motion.svg>
        </motion.div>
      </div>

      {/* Main content container - all content is positioned relative to the background */}
      <div className="relative z-10 min-h-screen w-full">
        <Nav />

        <div className="container mx-auto px-4 pt-12 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto mt-8 mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                delay: 0.3,
                duration: 0.6,
              }}
              className="relative inline-block heading-glow"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition duration-1000 animate-pulse"></div>
              <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold mb-1 font-heading bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                <span className="inline-block">Connect</span>{" "}
                <span className="inline-block">with</span>{" "}
                <span className="inline-block">Developers</span>
                <motion.svg
                  className="absolute bottom-0 left-0 w-full h-2 text-indigo-500 dark:text-indigo-400 opacity-60 z-0"
                  viewBox="0 0 100 10"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <path
                    d="M 0,5 C 25,12 75,-2 100,5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </h1>
              <p className="text-xl md:text-2xl opacity-90 font-alt leading-relaxed relative z-10 mb-4 mt-0">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 font-semibold">
                  Swipe
                </span>
                ,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 font-semibold">
                  match
                </span>
                , and{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 font-semibold">
                  collaborate
                </span>{" "}
                with talented developers around the world
              </p>
            </motion.div>

            {/* Decorative dots */}
            <div className="flex justify-center space-x-2 mb-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.3 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4 }}
              />
            </div>
          </motion.div>

          <div className="flex justify-center items-center mb-16">
            <Card
              user={users[currentIndex]}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          </div>

          <motion.div
            className="flex justify-center gap-12 mt-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              className="stats-card"
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                delay: 0.4,
                duration: 0.3,
              }}
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                delay: 0.5,
                duration: 0.3,
              }}
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
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
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                delay: 0.6,
                duration: 0.3,
              }}
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
