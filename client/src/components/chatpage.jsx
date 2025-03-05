import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./sidebar";
import ChatContent from "./chatcontent";
import { useNavigate } from "react-router-dom";
import backendUrl from "./backendUrl";

const ChatPage = () => {
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showdropUpMenu, setShowDropUpMenu] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null); // Reference for the emoji button
  const dropUpShareRef = useRef(null);
  const dropUpShare = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!accessToken) {
        navigate("/login");
        return;
      }

      // ✅ Check if token is expired
      const isTokenExpired = (token) => {
        try {
          const parts = token.split(".");
          if (parts.length < 2) return true; // Invalid token
          const payload = JSON.parse(atob(parts[1])); // Decode JWT
          return payload.exp * 1000 < Date.now(); // Expiry check
        } catch (e) {
          return true; // Invalid token
        }
      };

      if (isTokenExpired(accessToken)) {
        if (refreshToken) {
          try {
            const response = await fetch(`${backendUrl}/api/token/refresh/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            });

            const data = await response.json();
            if (response.ok) {
              localStorage.setItem("access_token", data.access);
            } else {
              localStorage.clear();
              navigate("/login");
            }
          } catch (e) {
            localStorage.clear();
            navigate("/login");
          }
        } else {
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target) // Don't close if clicking the emoji button
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropUpShareRef.current &&
        !dropUpShareRef.current.contains(event.target) &&
        dropUpShare.current &&
        !dropUpShare.current.contains(event.target)
      ) {
        setShowDropUpMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        isLeftCollapsed={isLeftCollapsed}
        setIsLeftCollapsed={setIsLeftCollapsed}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />
      <ChatContent
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        messages={messages}
        setMessages={setMessages}
        message={message}
        setMessage={setMessage}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        emojiPickerRef={emojiPickerRef}
        emojiButtonRef={emojiButtonRef}
        handleEmojiClick={handleEmojiClick}
        dropUpShare={dropUpShare}
        dropUpShareRef={dropUpShareRef}
        setShowDropUpMenu={setShowDropUpMenu}
        showDropUpMenu={showdropUpMenu}
      />
    </div>
  );
};

export default ChatPage;
