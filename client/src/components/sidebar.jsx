import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "./chatpage.css";
import backendUrl from "./backendUrl";
const Sidebar = ({
  isLeftCollapsed,
  setIsLeftCollapsed,
  activeChat,
  setActiveChat,
}) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(`${backendUrl}/users/`)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);
  return (
    <div
      className={`${
        activeChat === null ? "block" : "hidden"
      } md:block transition-all duration-300 ${
        isLeftCollapsed ? "w-20" : "w-9/20 sm:w-1/2 md:w-1/3"
      } bg-gray-800`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          {isLeftCollapsed ? (
            <FaPhoneAlt className="text-2xl text-gray-400" />
          ) : (
            <h2 className="text-lg font-bold">Let's Talk</h2>
          )}
          <button
            onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
            className="p-2 text-gray-400 rounded-full hover:bg-gray-700"
          >
            {isLeftCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto hide-scrollbar border-r border-gray-700">
          {users.length > 0 ? (
            users.map((user) => (
              <li
                key={user.id}
                onClick={() => setActiveChat(user.username)}
                className="p-4 cursor-pointer hover:bg-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <Tippy content={user.username}>
                    <div className="w-10 h-10 bg-gray-400 rounded-full overflow-hidden">
                      <img
                        src={
                          user.profile_picture ||
                          "https://via.placeholder.com/100"
                        }
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Tippy>
                  {!isLeftCollapsed && (
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-gray-400">Last message...</p>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400 p-4">No users found</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
