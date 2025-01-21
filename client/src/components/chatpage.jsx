import React, { useState, useEffect, useRef } from "react";
import {
  FaPaperPlane,
  FaMicrophone,
  FaSmile,
  FaPaperclip,
  FaChevronLeft,
  FaChevronRight,
  FaPhoneAlt,
} from "react-icons/fa";
import "./chatpage.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import EmojiPicker from "emoji-picker-react";

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null); // Reference for the emoji button

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
      {/* Sidebar */}
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

          {/* Chat List */}
          <ul className="flex-1 overflow-y-auto hide-scrollbar border-r border-gray-700">
            {Array.from({ length: 20 }, (_, index) => (
              <li
                key={index}
                onClick={() => {
                  setActiveChat(`Chat ${index + 1}`);
                  setMessages([]);
                }}
                className="p-4 cursor-pointer hover:bg-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <Tippy content={`User ${index + 1}`}>
                    <div className="w-10 h-10 bg-gray-400 rounded-full overflow-hidden">
                      <img
                        src="https://via.placeholder.com/100"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Tippy>

                  {!isLeftCollapsed && (
                    <div>
                      <p className="font-semibold">User {index + 1}</p>
                      <p className="text-sm text-gray-400">Last message...</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chat Content */}
      <div
        className={`flex-1 ${
          activeChat === null ? "hidden" : "block"
        } md:block bg-gray-800`}
      >
        {activeChat ? (
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between mt-1">
              <h2 className="text-lg font-bold">{activeChat}</h2>
              {isMobileView && (
                <button
                  onClick={() => setActiveChat(null)}
                  className="p-2 text-gray-400 bg-gray-700 rounded-full hover:bg-gray-600"
                >
                  <FaChevronLeft />
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <p
                  key={index}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-2 w-fit"
                >
                  {msg}
                </p>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700 flex items-center space-x-2">
              <button className="text-gray-400 text-xl">
                <FaPaperclip />
              </button>
              <button
                ref={emojiButtonRef} // Attach the ref here
                className="text-gray-400 text-xl"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FaSmile />
              </button>
              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-16 z-50">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme="dark"
                    width="500px"
                  />
                </div>
              )}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
              />
              <button
                onClick={
                  message.trim()
                    ? () => setMessages([...messages, message])
                    : undefined
                }
                className="text-gray-400 text-xl"
              >
                {message.trim() ? <FaPaperPlane /> : <FaMicrophone />}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400">
              Select a chat to view the conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
