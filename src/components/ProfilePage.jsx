import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { setUser } from "../slice/UserSlice";
import Card from "./ui/Card";
import SuccessPopup from "./ui/SuccessPopup";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { darkMode, toggleDarkMode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/profile/", {
          withCredentials: true,
        });
        console.log(res.data.data);
        dispatch(setUser(res.data.data));
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        }
        console.error("Error fetching profile: " + err);
      }
    };
    fetchProfile();
  }, []);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    location: "", // Added location field
    about: "",
    skills: [],
    photoUrl: "",
  });

  // Skill input state
  const [skillInput, setSkillInput] = useState("");

  // Preview user for card
  const [previewUser, setPreviewUser] = useState(null);

  // Refs for form fields that might have errors
  const firstNameRef = useRef(null);
  const genderRef = useRef(null);
  const ageRef = useRef(null);
  const locationRef = useRef(null);
  const photoUrlRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        gender: user.gender || "",
        age: user.age || "",
        location: user.location || "", // Added location field
        about: user.about || "",
        skills: user.skills || [],
        photoUrl: user.photoUrl || "",
      });

      // Set preview user for card
      setPreviewUser({
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        bio: user.about || "Your bio will appear here",
        skills: user.skills || [],
        image: user.photoUrl || "https://i.imgur.com/6YQ1Zzt.png", // Clean, geometric profile avatar without text
        location: "Your location",
        age: user.age || 25,
        gender: user.gender || "other",
      });
    }
  }, [user]);

  // Update preview user when form data changes
  useEffect(() => {
    setPreviewUser({
      name: `${formData.firstName || ""} ${formData.lastName || ""}`,
      bio: formData.about || "Your bio will appear here",
      skills: formData.skills || [],
      image: formData.photoUrl || "https://i.imgur.com/6YQ1Zzt.png", // Clean, geometric profile avatar without text
      location: formData.location || "Your location",
      age: formData.age || 25,
      gender: formData.gender || "other",
    });
  }, [formData]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle skill input changes
  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  // Add skill to the list
  const handleAddSkill = () => {
    if (skillInput.trim()) {
      // Split by comma and process each skill
      const skillsToAdd = skillInput
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill && !formData.skills.includes(skill));

      if (skillsToAdd.length > 0) {
        setFormData({
          ...formData,
          skills: [...formData.skills, ...skillsToAdd],
        });
        setSkillInput("");
      }
    }
  };

  // Remove skill from the list
  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!formData.firstName.trim()) {
      validationErrors.firstName = "First name is required.";
    } else if (
      formData.firstName.length < 3 ||
      formData.firstName.length > 20
    ) {
      validationErrors.firstName =
        "First name must be between 3 and 20 characters.";
    }

    if (formData.age && (isNaN(formData.age) || formData.age < 16)) {
      validationErrors.age = "Age must be a number and at least 16.";
    }

    if (formData.photoUrl && !isValidUrl(formData.photoUrl)) {
      validationErrors.photoUrl = "Invalid photo URL.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.put("/profile", formData, {
        withCredentials: true,
      });
      setShowSuccessPopup(true);
      setPopupMessage("Profile updated successfully!");
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Handle closing the success popup
  const handleClosePopup = () => {
    setShowSuccessPopup(false);
  };

  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const response = await axios.get("/user/feed", {
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
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900/90 via-slate-900/90 to-gray-800/90 text-white light"
          : "bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 text-gray-900 light"
      }`}
    >
      {/* Success Popup */}
      <SuccessPopup
        isVisible={showSuccessPopup}
        message={popupMessage}
        onClose={handleClosePopup}
      />
      {/* Top navigation bar with back button and theme toggle */}
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

      <div className="profile-container">
        <motion.div
          className="profile-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="profile-title" variants={itemVariants}>
            Your Profile
          </motion.h1>

          <div className="profile-layout">
            {/* Card Preview Section */}
            <motion.div
              className="profile-card-preview"
              variants={itemVariants}
            >
              <h2 className="preview-title">Card Preview</h2>
              <div className="card-preview-container">
                {previewUser && <Card user={previewUser} isPreview={true} />}
              </div>
            </motion.div>

            {/* Profile Edit Form */}
            <motion.div className="profile-edit-form" variants={itemVariants}>
              <h2 className="form-section-title">Edit Profile</h2>

              {errors.general && (
                <div className="error-banner">
                  <p>{errors.general}</p>
                </div>
              )}

              {/* Success message is now shown in the popup */}

              <form onSubmit={handleSubmit}>
                <div className="form-group" ref={firstNameRef}>
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`form-input ${errors.firstName ? "error" : ""} ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                    }`}
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Your first name"
                  />
                  {errors.firstName && (
                    <p className="error-message">{errors.firstName}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className={`form-input ${errors.lastName ? "error" : ""} ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                    }`}
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Your last name"
                  />
                  {errors.lastName && (
                    <p className="error-message">{errors.lastName}</p>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group" ref={genderRef}>
                    <label htmlFor="gender" className="form-label">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      className={`form-input ${errors.gender ? "error" : ""} ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                      }`}
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="error-message">{errors.gender}</p>
                    )}
                  </div>

                  <div className="form-group" ref={ageRef}>
                    <label htmlFor="age" className="form-label">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      min="16"
                      className={`form-input ${errors.age ? "error" : ""} ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                      }`}
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Your age"
                    />
                    {errors.age && (
                      <p className="error-message">{errors.age}</p>
                    )}
                  </div>
                </div>

                <div className="form-group" ref={locationRef}>
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className={`form-input ${errors.location ? "error" : ""} ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                    }`}
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                  {errors.location && (
                    <p className="error-message">{errors.location}</p>
                  )}
                </div>

                <div className="form-group" ref={photoUrlRef}>
                  <label htmlFor="photoUrl" className="form-label">
                    Profile Photo URL
                  </label>
                  <input
                    type="text"
                    id="photoUrl"
                    name="photoUrl"
                    className={`form-input ${errors.photoUrl ? "error" : ""} ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                    }`}
                    value={formData.photoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/your-photo.jpg"
                  />
                  {errors.photoUrl && (
                    <p className="error-message">{errors.photoUrl}</p>
                  )}
                </div>

                <div className="form-group" ref={aboutRef}>
                  <label htmlFor="about" className="form-label">
                    About
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    rows="4"
                    className={`form-input ${errors.about ? "error" : ""} ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                    }`}
                    value={formData.about}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                  ></textarea>
                  {errors.about && (
                    <p className="error-message">{errors.about}</p>
                  )}
                </div>

                <div className="form-group" ref={skillsRef}>
                  <label htmlFor="skills" className="form-label">
                    Skills
                  </label>
                  <div className="skills-input-container">
                    <input
                      type="text"
                      id="skills"
                      className={`form-input ${errors.skills ? "error" : ""} ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                      }`}
                      value={skillInput}
                      onChange={handleSkillInputChange}
                      placeholder="Add skills separated by commas (e.g., JavaScript, React, Node.js)"
                      onKeyDown={(e) => {
                        // Add skills on Enter key
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                        // Auto-add skills when typing a comma
                        // This is optional but provides a smoother experience
                        else if (e.key === "," && skillInput.trim()) {
                          // Wait for the comma to be added to the input
                          setTimeout(() => {
                            handleAddSkill();
                          }, 10);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="add-skill-button"
                      onClick={handleAddSkill}
                    >
                      Add
                    </button>
                  </div>
                  {errors.skills && (
                    <p className="error-message">{errors.skills}</p>
                  )}

                  <div className="skills-list">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="skill-tag">
                        {skill}
                        <button
                          type="button"
                          className="remove-skill-button"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className={`form-button ${
                    darkMode ? "bg-blue-600 hover:bg-blue-700" : ""
                  }`}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ minWidth: "150px" }} // Prevent size changes
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Save Profile"
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
