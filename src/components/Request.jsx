import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { addRequest } from "../slice/RequestSlice";

const Request = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode, toggleDarkMode } = useTheme();

  const requests = useSelector((state) => state.request);

  const fetchRequest = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/user/request/received",
        {
          withCredentials: true,
        }
      );
      dispatch(addRequest(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.post(
        `http://localhost:4000/user/request/accept/${id}`,
        {},
        { withCredentials: true }
      );
      alert("Request accepted!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(
        `http://localhost:4000/user/request/reject/${id}`,
        {},
        { withCredentials: true }
      );
      alert("Request rejected!");
    } catch (err) {
      console.error(err);
    }
  };

  const getGenderIcon = (gender) => {
    if (gender.toLowerCase() === "male") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="4" r="4"></circle>
          <path d="M16 8v8h-8"></path>
          <path d="M12 12l4 4"></path>
        </svg>
      );
    } else if (gender.toLowerCase() === "female") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="4"></circle>
          <path d="M12 12v4"></path>
          <path d="M10 16h4"></path>
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="4"></circle>
          <path d="M8 12h8"></path>
          <path d="M10 16h4"></path>
        </svg>
      );
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  if (!requests) return;
  if (requests.length === 0)
    return <h1 className="no-requests">No request found.</h1>;

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
        <h1 className="request-title">Requests</h1>
        <div className="request-cards-horizontal">
          {requests.map((req) => (
            <div className="request-card-horizontal" key={req._id}>
              <img
                src={req.fromUserId.photoUrl}
                alt={`${req.fromUserId.firstName} ${req.fromUserId.lastName}`}
                className="request-card-image"
              />
              <div className="request-card-content">
                <h2 className="request-card-name">
                  {req.fromUserId.firstName}{" "}
                  {req.fromUserId.lastName ? req.fromUserId.lastName : ""}
                </h2>
                <p className="request-card-about">
                  {req.fromUserId.about ? "About: " + req.fromUserId.about : ""}
                </p>
                <div className="request-card-info">
                  <div className="request-card-age-gender">
                    <div className="info-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="4"></circle>
                        <path d="M12 12v6"></path>
                        <path d="M9 18h6"></path>
                      </svg>
                      <span>
                        {req.fromUserId.age ? "Age: " + req.fromUserId.age : ""}{" "}
                        years
                      </span>
                    </div>
                    <div className="info-item">
                      {getGenderIcon(req.fromUserId.gender)}
                      <span>
                        {req.fromUserId.gender ? req.fromUserId.gender : ""}
                      </span>
                    </div>
                  </div>
                  <div className="request-card-skills">
                    {req.fromUserId.skills.length > 0
                      ? req.fromUserId.skills.map((skill, index) => (
                          <span className="request-skill-tag" key={index}>
                            {skill}
                          </span>
                        ))
                      : ""}
                  </div>
                </div>
              </div>
              <div className="request-card-actions">
                <button
                  className="accept-button"
                  onClick={() => handleAccept(req._id)}
                >
                  ✓
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleReject(req._id)}
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
