import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { addConnection } from "../slice/ConnectionSlice";
import { store } from "../store/store";


const Connection = () => {
  const connections = useSelector((store) => store.connection || []);
  const dispatch = useDispatch();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const fetchConnection = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/user/request/connections",
        { withCredentials: true }
      );
      console.log("API response:", response.data.data);
      console.log("Current state:", JSON.stringify(connections));
      dispatch(addConnection(response.data.data)); // Replace the state with the new data
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  useEffect(() => {
    fetchConnection();
  }, []);

  const getGenderSymbol = (gender) => {
    if (!gender) {
      return <span className="info-icon bold-light"></span>; // Default symbol for undefined gender
    }
    if (gender.toLowerCase() === "male") {
      return <span className="info-icon bold-light">♂</span>;
    } else if (gender.toLowerCase() === "female") {
      return <span className="info-icon bold-light">♀</span>;
    } else {
      return <span className="info-icon bold-light">⚧</span>; // Gender-neutral symbol
    }
  };

  const truncateText = (text, wordLimit) => {
    if (!text) return ""; // Return an empty string if text is undefined or null
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  if (!connections) return;
  if (!connections.length === 0)
    return (
      <div className="notfound-request">
        <div className="profile-top-nav-two">
          <button
            onClick={() => navigate("/")}
            className="back-button"
            aria-label="Go back"
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
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Home</span>
          </button>
          <button
            onClick={toggleDarkMode}
            className={`theme-toggle ${darkMode ? "dark" : "light"}`}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </div>
        <h1 className="request-title-two">Requests</h1>
        <div className="no-requests-container">
          <h1 className="no-requests-message">No connection found.</h1>
          <p className="no-requests-subtext">
            Check back later for new connection requests.
          </p>
        </div>
      </div>
    );

  return (
    <div className="request-maindiv">
      <div className="profile-top-nav">
        <button
          onClick={() => navigate("/")}
          className="back-button"
          aria-label="Go back"
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Home</span>
        </button>
        <button
          onClick={toggleDarkMode}
          className={`theme-toggle ${darkMode ? "dark" : "light"}`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>
      <div className="request-container">
        <h1 className="request-title">Connections</h1>
        <div className="request-cards-horizontal">
          {connections.map((req) => (
            <div className="request-card-horizontal" key={req._id}>
              <img
                src={req.photoUrl || "default-avatar.png"} // Fallback for missing photo
                alt={`${req.firstName || "Unknown"} ${req.lastName || "User"}`}
                className="request-card-image"
              />
              <div className="request-card-content">
                <h2 className="request-card-name">{`${
                  req.firstName || "Unknown"
                } ${req.lastName || "User"}`}</h2>
                <p className="request-card-about">
                  {truncateText(req.about, 20) || "No description available"}
                </p>
                <div className="request-card-info">
                  <div className="request-card-age-gender">
                    {req.age && (
                      <div className="info-item">
                        <span>Age:</span>
                        <span>{req.age} years</span>
                      </div>
                    )}
                    {req.gender && (
                      <div className="info-item">
                        {getGenderSymbol(req.gender)}
                        <span>{req.gender}</span>
                      </div>
                    )}
                  </div>
                  {req.skills && req.skills.length > 0 && (
                    <div className="request-card-skills">
                      <span>Skills:</span>
                      {req.skills.map((skill, index) => (
                        <span className="request-skill-tag" key={index}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connection;
