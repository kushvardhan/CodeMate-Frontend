import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HomePage.css";

const HomePage = () => {
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/user/feed", {
          withCredentials: true,
        });
        setFeedData(response.data.data); // Set the feed data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feed data:", error.message);
        setLoading(false);
      }
    };

    fetchFeedData();
  }, []);

  return (
    <div className="home-page">
      <h1>Welcome to the Home Page</h1>
      <div className="feed-container">
        {loading ? (
          <p>Loading feed...</p>
        ) : feedData.length > 0 ? (
          feedData.map((user) => (
            <div key={user._id} className="feed-card">
              <img
                src={user.photoUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="feed-card-image"
              />
              <h3 className="feed-card-name">{`${user.firstName} ${user.lastName}`}</h3>
              <p className="feed-card-about">{user.about}</p>
              <p className="feed-card-skills">Skills: {user.skills.join(", ")}</p>
              <p className="feed-card-age">Age: {user.age}</p>
              <p className="feed-card-gender">Gender: {user.gender}</p>
            </div>
          ))
        ) : (
          <p>No feed data available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;