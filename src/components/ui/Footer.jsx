import React, { useContext } from "react";
import { BsEnvelope, BsLinkedin } from "react-icons/bs";
import { ThemeContext } from "../../context/ThemeContext";

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <footer
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }
      transition-colors duration-300 rounded-lg shadow-lg backdrop-blur-sm
      border ${darkMode ? "border-gray-700" : "border-gray-200"} m-4 mt-auto`}
    >
      <div className="w-full p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="mb-4 md:mb-0 flex items-center">
            <a href="/" className="flex items-center group">
              <div
                className={`relative overflow-hidden rounded-lg ${
                  darkMode ? "dark-theme" : "light-theme"
                }`}
              >
                <img
                  src="/codemate-logo.svg"
                  className={`h-10 mr-3 transition-transform duration-300 group-hover:scale-110
                    ${darkMode ? "filter-none" : "filter-none"}`}
                  alt="CodeMate Logo"
                />
              </div>
              <span
                className={`self-center text-2xl font-bold whitespace-nowrap
                ${darkMode ? "text-white" : "text-gray-800"}
                transition-colors duration-300 group-hover:text-indigo-500`}
              >
                CodeMate
              </span>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-center md:text-left">
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Connect with developers and collaborate on exciting projects.
              </p>
            </div>
          </div>
        </div>

        <hr
          className={`my-6 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } sm:mx-auto`}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            } text-center md:text-left`}
          >
            © {new Date().getFullYear()}{" "}
            <a href="#" className="font-medium hover:underline">
              Kush Vardhan
            </a>
            . All Rights Reserved.
          </span>

          <div className="flex space-x-6 justify-center">
            <a
              href="https://www.linkedin.com/in/kush-vardhan-48996a251/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }
                transition-colors duration-300 hover:scale-110 transform`}
            >
              <BsLinkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:kushvardhan39797@gmail.com"
              className={`${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }
                transition-colors duration-300 hover:scale-110 transform`}
            >
              <BsEnvelope className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
