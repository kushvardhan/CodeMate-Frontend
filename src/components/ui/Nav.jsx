import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Nav = () => {
  const { user } = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-full h-[12vw] bg-zinc-900 flex overflow-hidden">
      {/* Logo section */}
      <div>
        <div>
          <div>
            <h1>CodeMate</h1>
          </div>
        </div>
      </div>

      {/* User section */}
      <div>
        {/* User name */}
        <div>
          <span>{user?.firstName || "Guest"}</span>
        </div>

        {/* Dropdown menu */}
        <div>
          <div
            role="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div>
              {user?.photoUrl ? (
                <img
                  alt="User profile"
                  src={user.photoUrl}
                />
              ) : (
                <div>
                  {user?.firstName ? user.firstName[0].toUpperCase() : "G"}
                </div>
              )}
            </div>
          </div>

          {isDropdownOpen && (
            <ul>
              <li>
                <Link to="/profile">
                  Profile
                  <span>New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">
                  Connections
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  Settings
                </Link>
              </li>
              <div></div>
              <li>
                <Link to="/logout">
                  Logout
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
