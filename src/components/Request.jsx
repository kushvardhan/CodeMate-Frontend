import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest } from "../slice/RequestSlice";

const Request = () => {
  const dispatch = useDispatch();
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

  useEffect(() => {
    fetchRequest();
  }, []);

  if (!requests) return;
  if (requests.length === 0)
    return <h1 className="no-requests">No request found.</h1>;

  return (
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
                {req.fromUserId.firstName} {req.fromUserId.lastName}
              </h2>
              <p className="request-card-about">{req.fromUserId.about}</p>
              <p className="request-card-age-gender">
                {req.fromUserId.age} years old, {req.fromUserId.gender}
              </p>
              <div className="request-card-skills">
                {req.fromUserId.skills.map((skill, index) => (
                  <span className="request-skill-tag" key={index}>
                    {skill}
                  </span>
                ))}
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
  );
};

export default Request;
