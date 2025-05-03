import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { addConnection } from "../slice/ConnectionSlice";
import { addRequest, removeRequest } from "../slice/RequestSlice";
import SuccessPopup from "./ui/SuccessPopup";

const Request = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode, toggleDarkMode } = useTheme();
  const requests = useSelector((store) => store.request);
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    color: "",
  });

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/user/request/received",
          { withCredentials: true }
        );
        console.log(response.data.data);
        dispatch(addRequest(response.data.data));
      } catch (error) {
        console.error("Error fetching requests:", error);
        dispatch(addRequest([])); // Handle gracefully by showing "No requests found"
      }
    };

    fetchRequest();
  }, [dispatch, navigate]);

  const handleRequestAction = async (status, request) => {
    try {
      await axios.post(
        `http://localhost:4000/request/review/${status}/${request._id}`,
        {},
        { withCredentials: true }
      );

      if (status === "accepted") {
        dispatch(addConnection([request.fromUserId])); // Ensure it's an array
        setPopup({
          isVisible: true,
          message: `You accepted ${request.fromUserId.firstName}'s request.`,
          color: "green",
        });
      } else if (status === "rejected") {
        setPopup({
          isVisible: true,
          message: `You rejected ${request.fromUserId.firstName}'s request.`,
          color: "red",
        });
      }

      dispatch(removeRequest(request._id));
    } catch (err) {
      console.error("Error handling request action:", err);
    }
  };

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

  if (!requests) return;
  if (requests.length === 0)
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
          <h1 className="no-requests-message">No connection requests found.</h1>
          <p className="no-requests-subtext">
            Check back later for new connection requests.
          </p>
        </div>
      </div>
    );

  return (
    <div className="request-maindiv">
      <SuccessPopup
        isVisible={popup.isVisible}
        message={popup.message}
        onClose={() => setPopup({ isVisible: false, message: "", color: "" })}
        color={popup.color}
      />
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
        <h1 className="request-title">Requests</h1>
        <div className="request-cards-horizontal">
          {requests.map((req) => (
            <div className="request-card-horizontal" key={req._id}>
              <img
                src={req.fromUserId.photoUrl || "default-avatar.png"} // Fallback for missing photo
                alt={`${req.fromUserId.firstName || "Unknown"} ${
                  req.fromUserId.lastName || "User"
                }`}
                className="request-card-image"
              />
              <div className="request-card-content">
                <h2 className="request-card-name">{`${
                  req.fromUserId.firstName || "Unknown"
                } ${req.fromUserId.lastName || "User"}`}</h2>
                <p className="request-card-about">
                  {truncateText(req.fromUserId.about, 20) ||
                    "No description available"}
                </p>
                <div className="request-card-info">
                  <div className="request-card-age-gender">
                    {req.fromUserId.age && (
                      <div className="info-item">
                        <span>Age:</span>
                        <span>{req.fromUserId.age} years</span>
                      </div>
                    )}
                    {req.fromUserId.gender && (
                      <div className="info-item">
                        {getGenderSymbol(req.fromUserId.gender)}
                        <span>{req.fromUserId.gender}</span>
                      </div>
                    )}
                  </div>
                  {req.fromUserId.skills &&
                    req.fromUserId.skills.length > 0 && (
                      <div className="request-card-skills">
                        {req.fromUserId.skills.map((skill, index) => (
                          <span className="request-skill-tag" key={index}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              </div>
              <div className="request-card-actions">
                <button
                  className="accept-button"
                  onClick={() => handleRequestAction("accepted", req)}
                >
                  ✓
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleRequestAction("rejected", req)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Request;
