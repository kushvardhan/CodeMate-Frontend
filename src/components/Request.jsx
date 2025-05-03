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
  const requests = useSelector((state) => state.request);
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    color: "",
  });

  const fetchRequest = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/user/request/received"
      );
      console.log(res.data.data);
      dispatch(addRequest(res.data.data));
    } catch (err) {
      if (err.response?.status === 401) {
        console.error("Unauthorized: Redirecting to login...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.error(
          "Error fetching requests:",
          err.response?.data || err.message
        );
      }
    }
  };

  const handleRequestAction = async (status, request) => {
    try {
      await axios.post(
        `http://localhost:4000/request/review/${status}/${request._id}`,
        {},
        { withCredentials: true }
      );

      if (status === "accepted") {
        dispatch(addConnection(request.fromUserId));
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
    if (gender.toLowerCase() === "male") {
      return <span className="info-icon bold-light">♂</span>;
    } else if (gender.toLowerCase() === "female") {
      return <span className="info-icon bold-light">♀</span>;
    } else {
      return <span className="info-icon bold-light">⚧</span>; // Gender-neutral symbol
    }
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  if (!requests) return null;
  if (requests.length === 0)
    return <h1 className="no-requests">No request found.</h1>;

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
                src={req.fromUserId.photoUrl}
                alt={`${req.fromUserId.firstName} ${req.fromUserId.lastName}`}
                className="request-card-image"
              />
              <div className="request-card-content">
                <h2 className="request-card-name">{`${req.fromUserId.firstName} ${req.fromUserId.lastName}`}</h2>
                <p className="request-card-about">
                  {truncateText(req.fromUserId.about, 20)}
                </p>
                <div className="request-card-info">
                  <div className="request-card-age-gender">
                    <div className="info-item">
                      <span>Age:</span>
                      <span>{req.fromUserId.age} years</span>
                    </div>
                    <div className="info-item">
                      {getGenderSymbol(req.fromUserId.gender)}
                      <span>{req.fromUserId.gender}</span>
                    </div>
                  </div>
                  <div className="request-card-skills">
                    {req.fromUserId.skills.map((skill, index) => (
                      <span className="request-skill-tag" key={index}>
                        {skill}
                      </span>
                    ))}
                  </div>
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
